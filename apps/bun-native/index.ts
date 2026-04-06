import Axiom from "@axiom/core";
import { z } from "zod";

new Axiom()
  .derive(() => ({
    startTime: performance.now(),
  }))
  .onResponse((res, ctx: any) => {
    const duration = performance.now() - ctx.startTime;
    res.headers.set("X-Response-Time", `${duration.toFixed(3)}ms`);
    console.log(
      `\x1b[35m[PERF]\x1b[0m ${ctx.request.method} ${new URL(ctx.request.url).pathname} - ${duration.toFixed(3)}ms`,
    );
  })
  .decorate({
    runtime: "Bun " + Bun.version,
    startedAt: new Date(),
  })
  .get("/", (ctx) => {
    return {
      message: "Hello from Axiom running on Bun!",
      runtime: ctx.runtime,
      status: "online",
    };
  })
  .post(
    "/echo",
    (ctx) => {
      return {
        received: ctx.body,
        timestamp: new Date().toISOString(),
      };
    },
    {
      body: z.object({
        name: z.string(),
        age: z.number().optional(),
      }),
    },
  )
  .listen(3333);
