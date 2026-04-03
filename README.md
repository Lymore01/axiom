# Axiom

**Axiom** is a high-performance, TypeScript-first web engine designed for extreme modularity and platform-independence. Build once, deploy anywhere (Node.js, Bun, Deno, Cloudflare Workers, etc.).

## Features

- **Secure by Default**: Built-in plugins for **CORS** and **Security Headers**.
- **Structured Logging**: High-performance **Pino** logging integrated directly into the core.
- **Modern Error Handling**: Custom error types (`NotFoundError`, `UnauthorizedError`) with automatic JSON responses and status codes.
- **Plugin Architecture**: Highly extendable via `.use()` (Auth, Static Assets, etc.).
- **Monorepo Design**: Cleanly separated core, adapters, and plugins for maximum reusability.

## Quick Start

Ensure you have [pnpm](https://pnpm.io/) installed.

```bash
# Install all dependencies
pnpm install

# Run the Node/Express example
pnpm --filter node-express-example dev
```

## Core Stack

- **`@axiom/core`**: The platform-agnostic routing engine.
- **`@axiom/express`**: High-performance Express adapter for Node.js.
- **`@axiom/auth`**: Modular authentication plugin & guards.
- **`@axiom/cors`**: Global CORS & Pre-flight handler.
- **`@axiom/security`**: Defensive security headers (HSTS, No-Sniff, XSS-Protection).

---

and more...

_Designed for the next generation of TypeScript web applications._
