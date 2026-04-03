import { authRoutes } from "@axiom/auth";
import Axiom from "@axiom/core";

const axiom = new Axiom()
  .decorate({
    db: { query: (sql: string) => `Result from Bun DB for ${sql}` },
    log: (msg: string) => console.log(`[BUN LOG]: ${msg}`),
  })
  .use(authRoutes)
  .onRequest((ctx) => {
    console.log(`[BUN]: Request to ${ctx.request.url}`);
  })
  .get("/whoami", ({ user }: any) => `Axiom on Bun: Hello ${user}`)
  .get("/posts", () => {
    return {
      message: "This is running natively on Bun!",
      runtime: "bun",
      version: (globalThis as any).Bun?.version || "unknown",
    };
  });

console.log("Axiom is live (Bun Native) at http://localhost:3001");

export default {
  port: 3001,
  async fetch(req: Request) {
    return axiom.handle(req);
  },
};
