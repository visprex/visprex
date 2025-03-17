/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    es2023: true,
    node: true,
    browser: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: "latest",
    sourceType: "module",
    jsxPragma: "react-jsx"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "react-refresh"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-loss-of-precision": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "vite.config.ts",
    ".eslintrc.cjs",
    "tsconfig.eslint.json"
  ]
};
