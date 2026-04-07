import Axiom, { $START_TIME } from "@axiom/core";
import s from "@axiom/schema";
import uploadPlugin from "@axiom/upload";

new Axiom()
  .use(uploadPlugin({ dest: "./uploads" }))
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
    "/upload",
    async (ctx) => {
      const { file } = ctx.body;

      await ctx.storage.save(file, `${ctx.storage.defaultDest}/${file.name}`);

      return {
        status: "success",
        message: "File uploaded successfully",
        filename: file.name,
      };
    },
    {
      body: s.object({
        file: s.file().max(5000000).type("image/"),
      }),
    },
  )
  .sse("/events", async function* () {
    for (let i = 0; i < 10; i++) {
      yield {
        message: `Event ${i}`,
        timestamp: new Date().toISOString(),
      };
      await Bun.sleep(1000);
    }
  })
  .listen(3333);

/* 
  File Upload Test:

  curl -X POST http://localhost:3333/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/image.jpg"
*/
