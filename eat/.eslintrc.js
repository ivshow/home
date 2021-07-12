module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  rules: {},
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint'
  }
};
