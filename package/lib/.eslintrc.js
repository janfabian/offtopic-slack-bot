module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:sonarjs/recommended",
  ],
  env: {
    node: true,
    es6: true,
  },
  rules: {},
  overrides: [
    {
      files: ["**/*.mjs"],
      parserOptions: {
        sourceType: "module",
      },
    },
    {
      files: ["**/*.test.js", "**/jest.*", "test/**"],
      env: {
        jest: true,
      },
      extends: ["plugin:jest/recommended"],
    },
  ],
};
