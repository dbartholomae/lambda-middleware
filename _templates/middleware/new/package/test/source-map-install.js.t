---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/test/source-map-install.js
---
require("source-map-support").install();
