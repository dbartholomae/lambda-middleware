const baseConfig = require("./jest.config");

module.exports = {
  ...baseConfig,
  roots: ["<rootDir>/examples"],
  testRegex: ".*int-test\\.(t|j)sx?$",
};
