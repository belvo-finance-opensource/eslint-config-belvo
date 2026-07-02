import belvoConfig from './index.js';

export default [
  ...belvoConfig,
  {
    name: 'app/eslint-custom-rules-exemption',
    files: ['eslint-custom-rules/**/*.js'],
    rules: {
      'func-style': 'off',
      'prefer-arrow-callback': 'off',
      'no-restricted-syntax': 'off'
    }
  }
];
