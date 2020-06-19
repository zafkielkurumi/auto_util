module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.jsx',
          '.tsx',
          '.ts',
        ],
      },
    },
  },
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
    'import/no-unresolved': 2,
    'import/extensions': [
      'warn',
      {
        pattern: {
          js: 'never',
          ts: 'never',
        },
      },
    ],
  },
};
