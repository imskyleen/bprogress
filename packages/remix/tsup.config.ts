import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['esm', 'cjs'],
  external: ['react', 'react-dom', '@remix-run/react', '@bprogress/core'],
});
