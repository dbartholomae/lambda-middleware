const uppercase = new RegExp("([A-Z])", "g");
const underbar_prefix = new RegExp("^_");

function replaceAll(str, subStrs, by) {
  let result = str;
  for (const subStr of subStrs) {
    result = result.split(subStr).join(by);
  }
  return result;
}

function underscore(str) {
  return replaceAll(str.replace(uppercase, "_$1"), ["-", " "], "_");
}

module.exports = [
  {
    type: "input",
    name: "name",
    message: "How do you want to call the middleware?",
    result: (name) => underscore(name),
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
