import type Axiom from "@axiom/core";
import express, { type Express } from "express";
import { WebSocketServer } from "ws";

export interface ExpressAdapterOptions {
  port?: number;
  onListen?: () => void;
}

export function createExpressAdapter(
  axiom: Axiom<any, any>,
  app: Express = express(),
) {
  const wss = new WebSocketServer({ noServer: true });
  app.use(async (req, res) => {
    const protocol = req.protocol;
    const host = req.get("host");
    const fullUrl = `${protocol}://${host}${req.originalUrl}`;

    try {
      const webRequest = new Request(fullUrl, {
        method: req.method,
        headers: new Headers(req.headers as any),
        body: ["GET", "HEAD"].includes(req.method) ? null : (req as any),
        // @ts-ignore - Required for Node.js Fetch with a stream body
        duplex: "half",
      });

      const webResponse = await axiom.handle(webRequest);

      webResponse.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      res.status(webResponse.status);

      if (webResponse.body) {
        const reader = webResponse.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      }
      res.end();
    } catch (error) {
      console.error("Adapter Error:", error);
      res.status(500).json({ error: "Internal Adapter Error" });
    }
  });

  return {
    listen: (port: number, cb?: () => void) => {
      const server = app.listen(port, cb);

      server.on("upgrade", (request, socket, head) => {
        const url = new URL(
          request.url || "",
          `http://${request.headers.host}`,
        );
        const matched = axiom.router.match(
          request.method || "GET",
          url.pathname,
        );

        if (matched && matched.route.metadata?.ws) {
          wss.handleUpgrade(request, socket, head, (ws: any) => {
            const handlers = matched.route.metadata?.ws;

            // Map standard WS events to Axiom handlers
            handlers.open?.(ws);
            ws.on("message", (data: any) => handlers.message?.(ws, data));
            ws.on("close", (code: number, reason: Buffer) =>
              handlers.close?.(ws, code, reason.toString()),
            );
            ws.on("error", (err: any) => handlers.error?.(ws, err));
          });
        } else {
          socket.destroy();
        }
      });

      return server;
    },
  };
}
