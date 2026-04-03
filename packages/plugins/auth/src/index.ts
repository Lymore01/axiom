import type Axiom from "@axiom/core";
import type { Context } from "@axiom/core";

export const authPlugin = <T extends Record<string, any>, D extends Record<string, any>>(
  app: Axiom<T, D>,
) => {
  return app
    .derive(() => ({ user: "John Doe" }))
    .get("/whoami", ({ user }: { user: string }) => `You are ${user}`);
};

export const authGuard = <T extends Record<string, any>, D extends Record<string, any>>(
  app: Axiom<T, D>,
) => {
  return app.derive(({ headers }: Context<any, any, any>) => {
    const token = headers.get("Authorization");

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    return { userId: "123" };
  });
};

export const authRoutes = <T extends Record<string, any>, D extends Record<string, any>>(
  app: Axiom<T, D>,
) =>
  app.group("/auth", (group) =>
    group
      .use(authPlugin)
      .onRequest((ctx) => {
        (ctx as any).startTime = performance.now();
      })
      .onResponse((res: Response, ctx) => {
        const start = (ctx as any).startTime;
        const end = performance.now();
        const duration = (end - start).toFixed(2);

        console.log("Request duration:", duration, "ms");

        if (res instanceof Response) {
          res.headers.set("X-Response-Time", `${duration} ms`);
        }

        return res;
      })
      .onBeforeHandle(({ headers }) => {
        if (headers.get("x-admin-key") !== "secret") {
          return new Response("Admin Only", { status: 403 });
        }
      })
      .onAfterHandle(({ userId }: any) => {
        console.log("After handling request for user:", userId);
      })
      .post("/login", () => "OK LOGIN")
      .post("/register", () => "OK"),
  );
