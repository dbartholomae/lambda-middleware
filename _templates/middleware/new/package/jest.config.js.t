---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/jest.config.js
---
const baseConfig = require("../../jest.unit.config");
module.exports = baseConfig;
