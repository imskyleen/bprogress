import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/app.ts", "src/pages.ts"],
  sourcemap: true,
  clean: true,
  dts: true,
  splitting: false,
  format: ["esm", "cjs"],
  external: [
    "react",
    "react-dom",
    "next/router",
    "next/navigation",
    "@bprogress/react",
    "@bprogress/core",
  ],
});
