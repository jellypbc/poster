module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jsx-a11y',
    'react-hooks'
  ],
  extends: [
    // 'eslint:recommended', uncomment this when ready
    'plugin:@typescript-eslint/recommended',
  ],
  'rules': {
    'jsx-a11y/no-autofocus': [ 2, {
      'ignoreNonDOM': true
    }],
    'react-hooks/exhaustive-deps': 'warn'
  }
};