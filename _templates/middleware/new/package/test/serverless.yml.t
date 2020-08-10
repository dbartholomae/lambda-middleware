---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/test/serverless.yml
---
service:
  name: test-microservice

plugins:
  - serverless-webpack
  - serverless-offline

provider:
  name: aws
  runtime: nodejs8.10

functions:
  hello:
    handler: handler.fullExample
    events:
      - http:
          method: get
          path: hello

  status:
    handler: handler.status
    events:
      - http:
          method: get
          path: status
