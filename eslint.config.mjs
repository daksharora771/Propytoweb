import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Base configurations
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Override with custom rules (disable specific lints)
  {
    rules: {
      // Disable unused imports/variables rules
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      
      // Disable other common rules
      '@typescript-eslint/no-explicit-any': 'off',
      'react/no-unescaped-entities': 'off',
    }
  },
  
  // Global override for all files - set all rules to off
  {
    rules: 'off',
    ignorePatterns: ['**/*'],
  }
];

export default eslintConfig;
