module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    indent: 'off',
    quoted: 'off',
    quotes: 'off',
    semi: 'off',
    'space-before-function-paren': 'off',
    'dot-notation': 'off',
    'vue/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'no-void': 'off'
  }
}
