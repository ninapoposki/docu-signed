const eslintPluginNode = require("eslint-plugin-node");

/** @type {import("eslint").Linter.FlatConfig} */
module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    plugins: {
      node: eslintPluginNode,
    },
    rules: {
      "no-unused-vars": "warn",
      semi: ["error", "always"],
      "no-console": "off",
      "node/no-missing-import": "warn",
    },
  },
];
