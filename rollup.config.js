import pkg from "./package.json";
import serve from "rollup-plugin-serve";
import typescript from "rollup-plugin-typescript";

const plugins = [
  typescript(),
  serve({ open: true, contentBase: "./example", port: 4000 })
];

export default [
  {
    input: "src/index.umd.ts",
    output: {
      format: "umd",
      name: "Animated",
      file: pkg.browser
    },
    plugins
  },
  {
    input: "src/index.es.ts",
    output: {
      format: "es",
      name: "animated",
      file: pkg.module
    },
    plugins
  }
];
