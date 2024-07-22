const globals = require('globals');
const pluginPromise = require('eslint-plugin-promise');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslintPluginReactHooks = require('eslint-plugin-react-hooks');
const fixupPluginRules = require('@eslint/compat');
const _import = require('eslint-plugin-import');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const react = require('eslint-plugin-react');
const sonarjs = require('eslint-plugin-sonarjs');
const FlatCompat = require('@eslint/eslintrc');
const tsParser = require('@typescript-eslint/parser');
const babelParser = require('@babel/eslint-parser');

const compat = new FlatCompat({
  baseDirectory: dirname
});

module.exports = [
  pluginPromise.configs['flat/recommended'],
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  sonarjs.configs.recommended,
  ...compat.extends('airbnb-base'),
  ...compat.extends('airbnb-typescript/base'),
  {
    plugins: {
      'react-hooks': fixupPluginRules(eslintPluginReactHooks),
      import: fixupPluginRules(_import),
      '@typescript-eslint': typescriptEslint,
      'jsx-a11y': jsxA11y,
      react,
      sonarjs,
    },
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: 111,
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      'import/prefer-default-export': 'off',
      'linebreak-style': 'off',
      'no-await-in-loop': 'off',
      'no-undefined': 'off',
      'no-eq-null': 'error',
      'no-invalid-this': 'error',
      'no-useless-call': 'error',
      'no-dupe-else-if': 'error',
      'callback-return': 'error',
      'consistent-this': 'error',
      'no-setter-return': 'error',
      'no-import-assign': 'error',
      'no-inline-comments': 'error',
      'no-native-reassign': 'error',
      'default-param-last': 'error',
      'handle-callback-err': 'error',
      'no-constructor-return': 'error',
      'prefer-regex-literals': 'error',
      'require-atomic-updates': 'error',
      'newline-per-chained-call': 'off',
      'no-return-assign': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],
      complexity: ['error', 10],
      'max-params': ['error', 3],
      'max-depth': ['error', 4],
      'max-statements': 'off',
      'max-classes-per-file': ['error', 1],
      'max-nested-callbacks': ['error', 2],
      'max-statements-per-line': ['error', { max: 1 }],
      'max-lines-per-function': 'off',
      'curly': ['error', 'multi-or-nest'],
      'import/no-unresolved': 'warn',
      'operator-linebreak': 'off',
      'react/forbid-prop-types': 'off',
      'linebreak-style': 'off',
      'class-methods-use-this': 'off',
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/href-no-hash': 'off',
      'jsx-a11y/label-has-for': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/accessible-emoji': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
      'no-underscore-dangle': [2, { allow: ['_id'] }],
      'global-require': 'off',
      'implicit-arrow-linebreak': 'off',
      'object-curly-newline': ['error', { consistent: true }],
      'no-await-in-loop': 'off',
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'react/destructuring-assignment': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/static-property-placement': 'off',
      'react/state-in-constructor': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-danger': 'off',
      'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx', 'spec.js', 'spec.ts'] }],
      'react/jsx-wrap-multilines': [
        'error',
        {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line',
          arrow: 'parens-new-line',
          condition: 'parens-new-line',
          logical: 'ignore',
          prop: 'parens-new-line',
        },
      ],
      'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
      'react/jsx-wrap-multilines': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      'promise/always-return': 'off',
    }
  },
];
