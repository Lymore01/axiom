import { authPlugin, bearerGuard } from "@axeom/auth";
import { compression } from "@axeom/compression";
import { cors } from "@axeom/cors";
import Axeom, { logger, s } from "@axeom/framework";
import { rateLimit } from "@axeom/rate-limit";
import { securityHeaders } from "@axeom/security";
import { staticPlugin } from "@axeom/static";
import { swagger } from "@axeom/swagger";
import uploadPlugin from "@axeom/upload";
import { wsPlugin } from "@axeom/ws";
import { Database } from "bun:sqlite";

const db = new Database("kitchen-sink.db");

// Initialize tables
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);

// --- 2. Initialize the Axeom App ---
const app = new Axeom()
  // Global Plugins
  .use(logger())
  .use(cors())
  .use(compression())
  .use(securityHeaders())
  .use(rateLimit({ limit: 100, windowMs: 60 * 1000 }))
  .use(wsPlugin())
  .use(
    swagger({
      info: {
        title: "🔥 Axeom Production Kitchen Sink",
        version: "2.0.0",
        description:
          "A full-featured production-ready demonstration with SQLite, Auth, and WebSockets.",
      },
    }),
  )
  .use(
    authPlugin({
      secret: Bun.env.SESSION_SECRET || "PRODUCTION_FALLBACK_CHANGE_ME",
    }),
  )
  .use(uploadPlugin({ dest: "./uploads" }))
  .use(staticPlugin({ prefix: "/", rootPath: "./public" }))

  // --- 3. Health & Monitoring ---
  .get("/health", () => ({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
    engine: "Axeom v0.2.0",
    architect: "Kelly Limo",
  }))

  // --- 3. Decorations (Injecting our Real DB) ---
  .decorate({
    db: {
      user: {
        create: (id: string, user: string, pass: string) =>
          db
            .prepare(
              "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
            )
            .run(id, user, pass),
        findByName: (name: string) =>
          db.prepare("SELECT * FROM users WHERE username = ?").get(name) as any,
        findById: (id: string) =>
          db.prepare("SELECT * FROM users WHERE id = ?").get(id) as any,
      },
      note: {
        create: (id: string, userId: string, content: string) =>
          db
            .prepare(
              "INSERT INTO notes (id, user_id, content) VALUES (?, ?, ?)",
            )
            .run(id, userId, content),
        listByUser: (userId: string) =>
          db
            .prepare(
              "SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC",
            )
            .all(userId) as any[],
        delete: (id: string, userId: string) =>
          db
            .prepare("DELETE FROM notes WHERE id = ? AND user_id = ?")
            .run(id, userId),
      },
    },
  })

  // --- 4. Derivations (Request Tracking) ---
  .derive(({ headers }) => ({
    requestId: crypto.randomUUID(),
    clientIp: headers.get("x-forwarded-for") || "127.0.0.1",
  }))

  // --- 5. Hooks ---
  .onRequest(({ request, logger, requestId }) => {
    logger.info(
      `Incoming: ${request.method} ${request.url} [ID: ${requestId}]`,
    );
  })
  .onResponse((response, { logger, requestId }) => {
    logger.info(`Outgoing: ${response.status} [ID: ${requestId}]`);
  })

  // --- 6. Real Auth Routes ---
  .group("/auth", (auth) =>
    auth
      .post(
        "/register",
        async ({ body, db, error }) => {
          const existing = db.user.findByName(body.username);
          if (existing) return error.Conflict("Username already exists");

          const hashedPassword = await Bun.password.hash(body.password);
          const userId = crypto.randomUUID();

          db.user.create(userId, body.username, hashedPassword);

          return { status: "success", userId };
        },
        {
          body: s.object({
            username: s.string().min(3).toLowerCase(),
            password: s.string().min(8),
          }),
        },
      )

      .post(
        "/login",
        async ({ body, db, auth, error, setResponseHeader }) => {
          const user = db.user.findByName(body.username);
          if (!user) return error.Unauthorized("Invalid credentials");

          const isValid = await Bun.password.verify(
            body.password,
            user.password,
          );
          if (!isValid) return error.Unauthorized("Invalid credentials");

          const token = await auth.sign({
            id: user.id,
            username: user.username,
          });

          setResponseHeader(
            "Set-Cookie",
            `axeom_token=${token}; Path=/; Max-Age=86400; SameSite=Lax`,
          );

          return { token, user: { id: user.id, username: user.username } };
        },
        {
          body: s.object({
            username: s.string().min(3),
            password: s.string(),
          }),
        },
      ),
  )

  // --- 7. Protected Business Logic (The Noter API) ---
  .group("/api", (api) =>
    api
      .derive(bearerGuard()) // 🛡️ Protect all routes in this group

      .get("/me", ({ user }) => user)

      .get("/notes", ({ db, user }) => {
        return db.note.listByUser(user.id);
      })

      .post(
        "/notes",
        ({ body, db, user }) => {
          const id = crypto.randomUUID();
          db.note.create(id, user.id, body.content);
          return { id, content: body.content };
        },
        {
          body: s.object({
            content: s.string().min(1).max(500),
          }),
        },
      )

      .delete("/notes/:id", ({ params, db, user, error }) => {
        const result = db.note.delete(params.id, user.id);
        const changes = (result as any).changes;
        if (changes === 0) return error.NotFound("Note not found");
        return { success: true };
      }),
  )

  // --- 8. Utility Routes (Echo, SSE, Uploads) ---
  .post("/api/echo", ({ body }) => ({ ...body, timestamp: Date.now() }), {
    body: s.object({ message: s.string() }),
  })

  .sse("/api/metrics", async function* () {
    while (true) {
      yield {
        cpu: Math.random() * 10,
        mem: process.memoryUsage().heapUsed / 1024 / 1024,
        time: new Date().toLocaleTimeString(),
      };
      await new Promise((r) => setTimeout(r, 2000));
    }
  })

  .post(
    "/api/upload",
    async (ctx) => {
      const { file } = ctx.body;
      await ctx.storage.save(file, `${ctx.storage.defaultDest}/${file.name}`);
      return { url: `/uploads/${file.name}`, name: file.name };
    },
    {
      body: s.object({ file: s.file().type("image/") }),
    },
  )

  // --- 9. Real-time Pub/Sub via WebSockets ---
  .ws("/ws", {
    open(ws) {
      ws.subscribe("global-feed");
      ws.send(
        JSON.stringify({
          type: "info",
          data: "Welcome to the real-time feed!",
        }),
      );
    },
    message(ws, msg) {
      // Broadcast to everyone
      ws.publish(
        "global-feed",
        JSON.stringify({
          type: "broadcast",
          data: msg,
          sender: "User",
        }),
      );
    },
  });

// --- 10. Start Server (Axeom Native)
app.listen(3000, () => {
  console.log(`
🚀 Axeom Kitchen Sink (v0.2.0) is live!
-------------------------------------
📍 Dashboard:    http://localhost:3000
📍 Swagger:      http://localhost:3000/swagger
📍 Database:     kitchen-sink.db (SQLite)
-------------------------------------
`);
});

export type App = typeof app;
