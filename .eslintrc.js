module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-unused-vars': 1,
    'prefer-destructuring': 1,
    'comma-dangle': 1,
    'space-before-blocks': 1,
    'eol-last': 1,
    'arrow-parens': 0,
    'import/no-dynamic-require': 0,
    'global-require': 0,
    'import/prefer-default-export': 1,
    'import/no-extraneous-dependencies': [
      "error",
      {
        "devDependencies": true,
      },
    ]
  },
};
