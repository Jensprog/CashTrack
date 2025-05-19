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
    "no-unsued-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": true}],
    "no-undef": "error",
    "no-unused-vars": "error",
    "no-array-constructor": "error",
    "no-use-before-define": ["error", { "functions": false, "classes": true, "variables": true}],
    "spellcheck/spell-checker": ["warn", {
      "skipWords": [
        "axios", "charset", "coords", "fullscreen", "jsx", "lang",
        "nums", "mins", "prev", "rect", "redux", "rgba", "src", "stdout", 
        "tsx", "unmount", "params", "formatter"
      ]
    }],
    "unused-imports/no-unused-imports": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
];

export default eslintConfig;
