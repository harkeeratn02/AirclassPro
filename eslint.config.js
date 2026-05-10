import js from "@eslint/js";
import tseslint from "typescript-eslint";
import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**/*', 'firestore.rules']
  },
  {
    files: ["**/*.rules"],
    plugins: {
      "@firebase/security-rules": firebaseRulesPlugin
    },
    rules: {
      ...firebaseRulesPlugin.configs.recommended.rules
    }
  },
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];
