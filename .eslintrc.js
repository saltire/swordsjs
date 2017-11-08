module.exports = {
  extends: 'airbnb',
  parserOptions: {
    sourceType: 'script',
  },
  rules: {
    'brace-style': [2, 'stroustrup'],
    'jsx-quotes': [2, 'prefer-single'],
    'no-console': 0,
    'no-multi-assign': 0,
    'no-nested-ternary': 0,
    'no-underscore-dangle': [2, { allow: ['_id'] }],
    'react/prop-types': 0,
    'strict': [2, 'global'],
  },
};
