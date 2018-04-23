import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

export default [
  {
    input: "src/index.js",
    output: {
      file: pkg.browser,
      name: pkg.name,
      format: "umd",
      globals: { react: "React" },
    },
    external: ["react"],
    plugins: [
      resolve(),
      babel({
        babelrc: false,
        exclude: "**/node_modules/**",
        presets: [["es2015", { modules: false }], "stage-0", "react"],
        plugins: ["external-helpers"],
      }),
      commonjs(),
    ],
  },
  {
    input: "src/index.js",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    external: ["react"],
    plugins: [
      babel({
        babelrc: false,
        exclude: "**/node_modules/**",
        presets: [["es2015", { modules: false }], "stage-0", "react"],
        plugins: ["external-helpers"],
      }),
    ],
  },
];
