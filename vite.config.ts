import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "Eh",
      formats: ["umd"],
      fileName: () => "eh.js",
    },
    target: "ES2015",
    minify: false,
    sourcemap: true,
  },
});
