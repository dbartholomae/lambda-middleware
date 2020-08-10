---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/jest.integration.config.js
---
const baseConfig = require("../../jest.integration.config");
module.exports = baseConfig;
