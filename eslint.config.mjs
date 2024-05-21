// @ts-check

import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
    {
        languageOptions: {globals: globals.browser},
    },
    {
        files: ["**/*.ts"],
    },
    {
        ignores: ["**/*.js"]
    },
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
];
