// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/*", "lib/*", "node_modules/*"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);
