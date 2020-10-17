module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    // https://github.com/prettier/eslint-plugin-prettier
    // https://zhuanlan.zhihu.com/p/80574300
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2021,
  },
  rules: {
    'node/no-missing-import': 'off',
    'node/no-missing-require': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/shebang': 'off',
  },
}
