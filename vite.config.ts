import { defineConfig } from "vite";

const minify = "MINIFY" in process.env;

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "Eh",
      formats: ["umd"],
      fileName() {
        const mpfx = minify ? ".min" : "";
        return `eh${mpfx}.js`;
      },
    },
    target: "ES2015",
    minify,
    sourcemap: minify,
    emptyOutDir: false,
  },
});
