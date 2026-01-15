import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

/** @type {import('eslint').Linter.Config} */
export default tseslint.config(
    {
        ignores: [
            '**/dist/**',
            '**/node_modules/**',
            '**/coverage/**',
            '**/build/**',
            'eslint.config.mjs',
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },
            ],
            'no-console': 'warn',
            'prettier/prettier': ['error', { singleQuote: true }],
        },
    },
    prettierRecommended
)
