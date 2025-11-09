import js from '@eslint/js'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import reactHooks from 'eslint-plugin-react-hooks'

const browserGlobals = {
  document: 'readonly',
  window: 'readonly',
  localStorage: 'readonly',
  fetch: 'readonly',
  atob: 'readonly',
  navigator: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  MessageChannel: 'readonly'
}

export default [
  { ignores: ['dist/**', 'node_modules/**', '.eslintrc.cjs'] },
  js.configs.recommended,
  reactRecommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: browserGlobals
    },
    settings: { react: { version: 'detect' } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
]
