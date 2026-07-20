//Dependiendo de las reglas, marcará errores o advertencias.
// @ts-check
import eslint from '@eslint/js'; // reglas para js
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'; // Para que eslint y prettier trabajen juntos
import globals from 'globals';
import tseslint from 'typescript-eslint'; // reglas para ts

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // No molestar si usa any
      '@typescript-eslint/no-floating-promises': 'warn', // advierte si se usa una función que retorna un promise sin el await
      '@typescript-eslint/no-unsafe-argument': 'warn', // Advierte si se pasa un any a una función tipada
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);
