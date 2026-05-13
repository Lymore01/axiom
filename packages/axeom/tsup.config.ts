import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/adapters/web.ts', 'src/adapters/express.ts', 'src/client.ts', 'src/plugins/swagger.ts', 'src/plugins/ws.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
});
