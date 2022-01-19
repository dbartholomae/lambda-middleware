---
inject: true
to: rush.json
after: projects
---
    {
      "packageName": "@lambda-middleware/<%= h.inflection.dasherize(name.toLowerCase()) %>",
      "projectFolder": "packages/<%= h.inflection.dasherize(name.toLowerCase()) %>",
      "shouldPublish": true
    },