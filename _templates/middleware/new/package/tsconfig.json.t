---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/tsconfig.json
---
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": "."
  },
  "include": ["**/*"]
}
