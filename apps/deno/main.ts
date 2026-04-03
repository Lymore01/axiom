import Axiom from "@axiom/core";

const axiom = new Axiom()
  .get("/", () => {
    return {
      message: "Axiom running on Deno! 🦕",
      runtime: "deno",
      version: Deno.version.deno,
    };
  })
  .get("/api/v1", () => ({ status: "OK" }));

Deno.serve({ port: 3002 }, (req) => axiom.handle(req));
