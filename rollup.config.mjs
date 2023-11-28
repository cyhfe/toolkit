import { readFileSync } from "fs";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

import typescript from "@rollup/plugin-typescript";

export default [
  // umd
  {
    input: "src/index.ts",
    output: {
      name: "toolkit",
      file: pkg.browser,
      format: "umd",
      sourcemap: true,
    },

    plugins: [typescript()],
  },

  //cjs
  {
    input: "src/index.ts",
    output: {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    plugins: [typescript()],
  },

  // esm
  {
    input: "src/index.ts",
    output: {
      file: pkg.module,
      format: "es",
      sourcemap: true,
    },
    plugins: [typescript()],
  },
];
