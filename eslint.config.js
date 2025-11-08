import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  react.configs.flat.recommended,
  globalIgnores(["dist/**", "node_modules/**", "playwright-report/**"]),
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "eqeqeq": "error",
      "no-var": "error",
      "prefer-const": ["error", { "destructuring": "all", "ignoreReadBeforeAssign": true }],
      "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": true, "argsIgnorePattern": "^_" }],
      "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
      "consistent-return": "error",
      "curly": ["error", "all"],
      "semi": ["error", "always"],
      "quotes": ["error", "double", { "avoidEscape": true }],
      "comma-dangle": ["error", "always-multiline"],
      "camelcase": ["warn", { "properties": "never", "ignoreDestructuring": true }],
      "no-implicit-coercion": ["warn", { "boolean": true, "number": true, "string": true }],
      "no-empty-function": ["warn", { "allow": ["arrowFunctions", "functions", "methods"] }],
      "no-shadow": ["warn", { "hoist": "all" }],
      "no-param-reassign": ["warn", { "props": false }],
      "max-params": ["warn", { "max": 4 }],
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-filename-extension": ["warn", { "extensions": [".jsx", ".js"] }],
      "react/prop-types": "off",
      "react/jsx-no-undef": "error",
      "react/jsx-no-useless-fragment": "warn",
      "react/jsx-key": "error",
    },
  },
]);
