module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:prettier/recommended",
    "plugin:sonarjs/recommended",
  ],
  env: {
    node: true,
  },
  rules: {
    "import/order": "error",
  },
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
