import type Axiom from "@axiom/core";

export interface BunAdapterOptions {
  port?: number;
  hostname?: string;
  development?: boolean;
}

/**
 * Creates a high-performance Bun entry point for Axiom.
 *
 * Unlike the Express adapter, this connects Axiom directly to the
 * Zig-level HTTP server in Bun, bypassing multiple layers of middleware.
 */
export function createBunAdapter(
  axiom: Axiom<any, any>,
  options: BunAdapterOptions = {},
) {
  // Check if we are running in Bun
  // @ts-ignore
  if (typeof Bun === "undefined") {
    console.warn(
      "\x1b[33m[Axiom Warning]\x1b[0m createBunAdapter is designed for the Bun runtime.",
    );
  }

  return {
    port: options.port || 3000,
    hostname: options.hostname || "0.0.0.0",
    development: options.development ?? process.env.NODE_ENV === "development",

    fetch: async (request: Request, server: any) => {
      const response = await axiom.handle(request);

      if (response.status === 101) {
        const url = new URL(request.url);
        const matched = axiom.router.match(request.method, url.pathname);

        if (matched && matched.route.metadata?.ws) {
          const success = server.upgrade(request, {
            data: matched.route.metadata.ws,
          });
          if (success) return undefined;
        }
      }

      return response;
    },

    websocket: {
      open: (ws: any) => ws.data.open?.(ws),
      message: (ws: any, message: any) => ws.data.message?.(ws, message),
      close: (ws: any, code: number, reason: string) =>
        ws.data.close?.(ws, code, reason),
      error: (ws: any, error: any) => ws.data.error?.(ws, error),
    },

    error(error: Error) {
      return new Response(`<pre>${error.message}\n${error.stack}</pre>`, {
        headers: { "Content-Type": "text/html" },
        status: 500,
      });
    },
  };
}

export default createBunAdapter;
