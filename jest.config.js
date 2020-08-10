module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
  testRegex: ".*(int-)?test\\.(t|j)sx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
