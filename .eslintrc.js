module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'no-console': 'off',
    'import/extensions': [
      'never',
      {
        pattern: {
          js: 'never',
          ts: 'never',
        },
      },
    ],
  },
};
