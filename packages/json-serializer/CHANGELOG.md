# Change Log - @lambda-middleware/json-serializer

This log was last generated on Fri, 23 Oct 2020 15:23:13 GMT and should not be manually modified.

## 2.0.0
Fri, 23 Oct 2020 15:23:13 GMT

### Breaking changes

- Before, JsonSerializer middleware could be used for handler of all kinds of events. Now it can only be used for APIGatewayEvents. This should not cause much trouble, as the middleware already returned APIGatewayResponses only.

## 1.0.1
Thu, 13 Aug 2020 19:32:50 GMT

### Patches

- Add tslib dependency

## 1.0.0
Mon, 10 Aug 2020 17:15:19 GMT

### Breaking changes

- Add json-serializer middleware

