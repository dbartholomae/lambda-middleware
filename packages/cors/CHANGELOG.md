# Change Log - @lambda-middleware/cors

This log was last generated on Mon, 26 May 2025 14:57:52 GMT and should not be manually modified.

## 2.1.0
Mon, 26 May 2025 14:57:52 GMT

### Minor changes

- Handle v2 events correctly

## 2.0.0
Fri, 23 Oct 2020 15:23:13 GMT

### Breaking changes

- Before, cors middleware could be used for handler of all kinds of events. Now it can only be used for APIGatewayEvents. This should not cause much trouble, as the middleware already returned APIGatewayResponses only.

