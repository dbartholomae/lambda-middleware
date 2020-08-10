module.exports = [
  {
    type: "input",
    name: "name",
    message:
      "How do you want to call the middleware? Please separate with spaces, e. g. 'no sniff'",
    result: (name) => name.toLowerCase(),
  },
  {
    type: "input",
    name: "description",
    message: "Which description should we use in README and package.json?",
  },
  {
    type: "input",
    name: "keywords",
    message:
      "Which keywords to add? Please comma-separate, e. g. 'foo,bar'. 'aws', 'lambda' and 'middleware' are added automatically",
  },
];
