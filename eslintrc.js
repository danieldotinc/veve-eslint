module.exports = {
    env: {
      browser: true,
      es2022: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: ['../../../../tsconfig.json'],
      tsconfigRootDir: __dirname,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    extends: [
      "airbnb-base",
      "airbnb-typescript/base",
      "plugin:prettier/recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:import/typescript",
      "plugin:promise/recommended",
      "plugin:sonarjs/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
      "plugin:node/recommended"
    ],
    rules: {
      "linebreak-style": "off",
      "no-await-in-loop": "off",
      "no-undefined": "off",
      "no-eq-null": "error",
      "no-invalid-this": "error",
      "no-useless-call": "error",
      "no-dupe-else-if": "error",
      "callback-return": "error",
      "consistent-this": "error",
      "no-setter-return": "error",
      "no-import-assign": "error",
      "no-inline-comments": "error",
      "no-native-reassign": "error",
      "default-param-last": "error",
      "handle-callback-err": "error",
      "no-constructor-return": "error",
      "prefer-regex-literals": "error",
      "require-atomic-updates": "error",
      "newline-per-chained-call": "off",
      "node/no-process-env": "error",
      "no-return-assign": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "no-underscore-dangle": ["error", { allow: ["_id"] }],
      "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ForInStatement",
          message:
            "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
        },
        {
          selector: "LabeledStatement",
          message:
            "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
        },
        {
          selector: "WithStatement",
          message:
            "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
        },
      ],
      complexity: ["error", 7],
      "max-params": ["error", 3],
      "max-depth": ["error", 4],
      "max-statements": ["error", 20],
      "max-classes-per-file": ["error", 1],
      "max-nested-callbacks": ["error", 2],
      "max-statements-per-line": ["error", { max: 1 }],
      "max-lines-per-function": "off",
      "import/no-unresolved": "warn",
      "@typescript-eslint/no-unused-vars": ["error"],
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],
      "node/no-unsupported-features/es-syntax": "off",
      "node/no-missing-import": "off",
      "node/no-extraneous-import": "off",
      "promise/always-return": "off",
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };
  