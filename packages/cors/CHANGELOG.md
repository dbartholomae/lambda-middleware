# Change Log - @lambda-middleware/cors

This log was last generated on Fri, 23 Oct 2020 15:23:13 GMT and should not be manually modified.

## 2.0.0
Fri, 23 Oct 2020 15:23:13 GMT

### Breaking changes

- Before, cors middleware could be used for handler of all kinds of events. Now it can only be used for APIGatewayEvents. This should not cause much trouble, as the middleware already returned APIGatewayResponses only.

