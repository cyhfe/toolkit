import pkg from "./package.json" assert { type: "json" };
import typescript from "@rollup/plugin-typescript";
export default [
  {
    input: "src/index.ts",
    output: {
      name: "toolkit",
      file: pkg.browser,
      format: "umd",
    },
    plugins: [typescript()],
  },
  {
    input: "src/index.ts",
    output: {
      file: pkg.main,
      format: "cjs",
    },
    plugins: [typescript()],
  },
  {
    input: "src/index.ts",
    output: {
      file: pkg.module,
      format: "es",
    },
    plugins: [typescript()],
  },
];
