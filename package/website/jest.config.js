module.exports = () => {
  return {
    preset: "jest-preset-preact",
    setupFiles: [
      "<rootDir>/tests/__mocks__/browserMocks.js",
      "<rootDir>/tests/__mocks__/setupTests.js",
    ],
  };
};
