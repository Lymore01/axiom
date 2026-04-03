import { authRoutes } from "@axiom/auth";
import Axiom from "@axiom/core";
import { cors } from "@axiom/cors";
import { createExpressAdapter } from "@axiom/express";
import { securityHeaders } from "@axiom/security";

const axiom = new Axiom()
  .use(cors({ origin: ["http://localhost:5173"] }))
  .use(securityHeaders())
  .decorate({
    db: { query: (sql: string) => `Result for ${sql}` },
  })
  .use(authRoutes)
  .get("/users/:id", ({ params }) => {
    return { id: params.id };
  })
  .get("/posts", () => {
    return { message: "List of posts (Node/Express)" };
  })
  .get("/test", ({ logger, db }) => {
    logger.info("Fetching data...");
    return db.query("SELECT * FROM users");
  });

const server = createExpressAdapter(axiom);

server.listen(3000, () => {
  console.log("Axiom is live (Node/Express) at http://localhost:3000");
});
