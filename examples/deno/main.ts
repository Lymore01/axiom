import Axeom from "@axeom/core";

const Axeom = new Axeom()
  .get("/", () => {
    return {
      message: "Axeom running on Deno! 🦕",
      runtime: "deno",
      version: Deno.version.deno,
    };
  })
  .get("/api/v1", () => ({ status: "OK" }));

Axeom.listen(3002);
