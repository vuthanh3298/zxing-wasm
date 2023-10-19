/// <reference types="vitest" />
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    target: ["es5", "edge88", "firefox68", "chrome75", "safari13"],
    lib: {
      entry: {
        "reader/index": "src/reader/index.ts",
        "writer/index": "src/writer/index.ts",
        "full/index": "src/full/index.ts",
      },
      formats: ["es"],
      fileName: (format, entryName) =>
        format === "es" ? `${entryName}.js` : `${entryName}.${format}.js`,
    },
    modulePreload: { polyfill: false },
    rollupOptions: {
      plugins: [
        getBabelOutputPlugin({
          allowAllFormats: true,
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "> 0.25%, not dead, IE 11",
                useBuiltIns: false, // Default：false
                // // https://babeljs.io/docs/en/babel-preset-env#modules
                modules: false,
              },
            ],
          ],
          plugins: ["babel-plugin-transform-import-meta"],
        }),
      ],
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "./src/full/*.d.ts",
          dest: "./full",
        },
        {
          src: "./src/reader/*.d.ts",
          dest: "./reader",
        },
        {
          src: "./src/writer/*.d.ts",
          dest: "./writer",
        },
      ],
    }),
  ],
  define: {
    NPM_PACKAGE_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  test: {
    passWithNoTests: true,
    browser: {
      enabled: true,
      headless: true,
      name: "chromium",
      provider: "playwright",
    },
    coverage: {
      provider: "istanbul",
    },
  },
});
