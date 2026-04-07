import Axiom, { $START_TIME } from "@axiom/core";
import { z } from "zod";

const generator = async function* () {
  for (let i = 0; i < 10; i++) {
    yield {
      message: `Event ${i}`,
      timestamp: new Date().toISOString(),
    };
    await Bun.sleep(1000);
  }
};

new Axiom()
  .derive(() => ({
    [$START_TIME]: performance.now(),
  }))
  .onResponse((res, ctx: any) => {
    const duration = performance.now() - ctx[$START_TIME];
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
  .sse("/events", () => {
    return generator();
  })
  .listen(3333);
