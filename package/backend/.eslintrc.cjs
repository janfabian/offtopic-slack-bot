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
  },
  rules: {},
  overrides: [
    {
      files: ["**/*.test.js"],
      env: {
        jest: true,
      },
      extends: ["plugin:jest/recommended"],
    },
  ],
};
