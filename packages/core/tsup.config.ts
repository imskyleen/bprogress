import { defineConfig } from "tsup";
import { copyFileSync, mkdirSync } from "fs";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs", "iife"],
  globalName: "BProgressJS",
  dts: true,
  outDir: "dist",
  esbuildPlugins: [
    {
      name: "copy-css",
      setup(build) {
        build.onEnd(() => {
          // tsup writes dist/ after esbuild finishes, so it may not exist yet
          mkdirSync("./dist", { recursive: true });
          copyFileSync("./src/index.css", "./dist/index.css");
        });
      },
    },
  ],
});
