module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    // https://github.com/prettier/eslint-plugin-prettier
    // https://zhuanlan.zhihu.com/p/80574300
    'plugin:prettier/recommended',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2021,
  },
}
