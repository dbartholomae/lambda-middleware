const baseConfig = require("./jest.config");

module.exports = {
  ...baseConfig,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testRegex: ".*(test|spec)\\.(t|j)sx?$",
};
