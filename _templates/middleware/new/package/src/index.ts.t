---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/src/index.ts
---
/* istanbul ignore next */
export * from "./<%=h.inflection.camelize(name, true) %>";
