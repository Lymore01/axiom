<div align="center">
  <img src="https://raw.githubusercontent.com/Lymore01/axeom/main/apps/docs/public/images/icon-light.png" width="80" height="80" alt="Axeom Logo" />
  <h1>@axeom/framework</h1>
  <p><strong>The heart of the weightless engine.</strong></p>
</div>

---

`@axeom/framework` is the primary entry point for the Axeom ecosystem. It provides the high-performance core engine, the standard schema validator (`s`), and the core logging utilities.

### Features

- **Binary-Fast Routing**: Radix-tree implementation for O(1) matching.
- **Blueprint Lifecycle**: Pure-fetch request handling with zero runtime bloat.
- **Native Multi-Runtime**: Built-in support for Bun and Deno.
- **Type-Safe validation**: Zero-dependency schema inference with `s`.

### Installation

```bash
npm install @axeom/framework
```

### Quick Start

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
  <p>Part of the <strong>Axeom</strong> Ecosystem</p>
  <p>Architected by <strong>Kelly Limo</strong></p>
</div>
