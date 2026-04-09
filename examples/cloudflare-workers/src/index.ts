import Axeom from "@axeom/core";

const Axeom = new Axeom()
  .get("/", () => {
    return {
      message: "Hello from Cloudflare Workers! ☁️",
      runtime: "workerd",
      region: "edge",
    };
  })
  .get("/env", (_ctx) => {
    return {
      message: "Access environment variables directly in Cloudflare!",
    };
  });

export default {
  async fetch(request: Request, _env: any, _ctx: any): Promise<Response> {
    return Axeom.handle(request);
  },
};
