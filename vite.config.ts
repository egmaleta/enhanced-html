import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "eh",
      formats: ["umd"],
      fileName: () => "eh.js",
    },
    target: "ES2015",
    minify: false,
    sourcemap: true,
  },
});
