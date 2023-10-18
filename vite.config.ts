import { defineConfig } from "vite";

const minify = "MINIFY" in process.env;

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "Eh",
      formats: ["es", "umd"],
      fileName(format) {
        const fpfx = format === "es" ? ".esm" : "";
        const mpfx = minify ? ".min" : "";
        return `eh${fpfx}${mpfx}.js`;
      },
    },
    target: "ES2015",
    minify,
    sourcemap: minify,
    emptyOutDir: false,
  },
});
