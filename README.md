<div align="center">
  <img src="apps/docs/public/images/icon-light.png" width="120" height="120" alt="Axeom Logo" />
  <h1>AXEOM</h1>
  <p><strong>The Backend for Frontend Web Framework.</strong></p>
  <p>
    <a href="https://axeom-docs.vercel.app">Documentation</a> • 
    <a href="https://github.com/Lymore01/axeom">GitHub</a> • 
    <a href="https://www.npmjs.com/package/@axeom/framework">NPM</a>
  </p>
</div>

---

### Zero-Code-Gen Type Safety

Axeom moves the heavy lifting to the initialization phase. By treating your API as a **Blueprint**, we achieve perfect End-to-End type safety from server to client without a single build step or generated file.

### Multi-Runtime by Default

Write your logic once and deploy it anywhere. Axeom provides a unified, high-performance experience across:

- **Bun** (Native)
- **Deno** (Native)
- **Node.js** (via @axeom/express)
- **Cloudflare Workers** (Edge)

### High Velocity Infrastructure

- **Radix Router**: Binary-fast routing with O(1) complexity.
- **Atomic Plugins**: Only install what you use (CORS, Auth, Swagger, etc).
- **Binary Handshakes**: Agnostic WebSocket and SSE implementations.

---

### Quick Start (Bun)

```typescript
import Axeom from "@axeom/framework";

const app = new Axeom()
  .get("/", () => "Weightless World.")
  .listen(3000, () => {
    console.log("Axeom Ignite: http://localhost:3000");
  });

export type AppType = typeof app;
```

---

<div align="center">
  <p>Architected by <strong>Kelly Limo</strong></p>
  <p>Licensed under <strong>MIT</strong></p>
</div>
