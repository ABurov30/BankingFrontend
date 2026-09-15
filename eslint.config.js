import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['coverage', 'dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['e2e/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'CallExpression[callee.property.name=/^(getByRole|getByText|getByLabel|getByPlaceholder|getByAltText|getByTitle|locator|waitForSelector)$/]',
          message:
            'E2E DOM selectors must use getByTestId(). Add a stable data-testid to the component.',
        },
        {
          selector:
            'CallExpression[callee.property.name="filter"] Property[key.name=/^(hasText|hasNotText)$/]',
          message: 'Filter E2E elements by data-testid, not visible text.',
        },
      ],
    },
  },
)
