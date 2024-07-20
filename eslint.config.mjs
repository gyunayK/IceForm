import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['**/*.ts', '**/*.vue', '**/*.js', '**/*.mjs'],
  rules: {
    'no-console': 'off',
    '@stylistic/semi': ['error', 'never'],
    '@typescript-eslint/semi': ['error', 'never'],
    '@stylistic/no-trailing-spaces': 'error',
    '@typescript-eslint/comma-dangle': ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    quotes: ['error', 'single'],
    'prettier/prettier': [
      'error',
      {
        semi: false,
        trailingComma: 'none',
        singleQuote: true,
        printWidth: 80,
        proseWrap: 'preserve'
      }
    ]
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
  plugins: ['vue', 'prettier']
})
