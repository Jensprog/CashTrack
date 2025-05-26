import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "no-unused-vars": ["error", { 
        "vars": "all", 
        "args": "after-used", 
        "ignoreRestSiblings": true 
      }],
      "no-undef": "error",
      "prefer-const": "error",
      "no-var": "error",
      "no-console": ["warn", {
        "allow": ["error", "warn"]
      }],
      "react-hooks/exhaustive-deps": "warn"
  }
}
];

export default eslintConfig;