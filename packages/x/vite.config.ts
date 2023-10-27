import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "ehx",
      formats: ["umd"],
      fileName: () => "x.js",
    },
    target: "ES2015",
    minify: false,
    sourcemap: true,
  },
});
