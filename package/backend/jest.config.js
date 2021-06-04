module.exports = () => {
  return {
    rootDir: ".",
    // globalSetup: "package/test/jest.setup.cjs",
    setupFilesAfterEnv: ["../lib/test/jest.setupFilesAfterEnv.cjs"],
    coverageReporters: [
      // "text",
      "text-summary",
    ],
    collectCoverage: true,
    collectCoverageFrom: [
      "**/*.{cjs,js,mjs}",
      "!**/node_modules/**",
      "!**/build/**",
      "!**/coverage/**",
      "!jest.config.js",
    ],
    transform: {},
  };
};
