import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import type Axiom from "@axiom/core";

export const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

export function staticPlugin<Prefix extends string>(prefix: Prefix, rootPath: string) {
  return <T extends Record<string, any>, D extends Record<string, any>>(app: Axiom<T, D>) =>
    app.get(`${prefix}/*` as any, async (ctx) => {
      try {
        const relativePath = ctx.request.url.split(prefix)[1];
        const filePath = join(rootPath, relativePath);

        const content = await readFile(filePath);
        const ext = extname(filePath).toLowerCase();

        return new Response(content, {
          headers: {
            "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
          },
        });
      } catch (_error) {
        return new Response("File not found", { status: 404 });
      }
    });
}
