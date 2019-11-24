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
  'settings': {
    'import/resolver': {
      'alias': {
        map: [
          [ 'api', './src/api'],
          [ 'db', './src/db' ],
          [ 'utils', './utils' ],
          [ 'helpers', './helpers' ],
        ]
      }
    }
  },
  rules: {
    'no-unused-vars': 1,
    'prefer-destructuring': 1,
    'comma-dangle': [
      1,
      {
        "functions": "never",
        "objects": "always-multiline",
        "exports": "always-multiline",
      },
    ],
    'space-before-blocks': 1,
    'eol-last': 1,
    'arrow-parens': 0,
    'import/no-dynamic-require': 0,
    'global-require': 0,
    'import/prefer-default-export': 1,
    'newline-after-var': 1,
    'spaced-comment': 1,
    'newline-before-return': 1,
    'no-trailing-spaces': 1,
    'indent': 1,
    'max-len': [
      1,
      {
        'code': 100,
      },
    ],
    'padding-line-between-statements': [
      1,
      {
        blankLine: 'always', prev: 'if', next: '*',
      }
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        'devDependencies': true,
      },
    ],
    'max-lines': [
			2,
			{
				'max': 200,
			},
		],
		'quotes': [
			1,
			'single',
		],
    'quote-props': 1,
    'no-multiple-empty-lines': 1,
    'no-multi-str': 0,
    'space-infix-ops': 1,
    'function-paren-newline': [1, 'multiline'],
    'arrow-parens': [1, 'as-needed'],
    'prefer-arrow-callback': 0,
    'space-before-function-paren': [0, 'always'],
    'prefer-rest-params': 1,
  },
};
