import pkg from "./package.json" assert { type: "json" };

export default {
  input: "src/main.js",
  output: {
    name: "toolkit",
    file: pkg.browser,
    format: "umd",
  },
};
