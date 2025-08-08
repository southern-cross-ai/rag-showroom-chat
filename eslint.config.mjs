import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ❗️This object must contain ONLY the ignores property
  {
    ignores: ['**/node_modules/**', '.next/**', 'out/**', '**/*.config.js'],
  },
  ...compat.extends("next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ),
];

export default eslintConfig;
