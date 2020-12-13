# Change Log - @lambda-middleware/json-serializer

This log was last generated on Sun, 13 Dec 2020 00:23:19 GMT and should not be manually modified.

## 2.1.1
Sun, 13 Dec 2020 00:23:19 GMT

### Patches

- Allow null values

## 2.1.0
Tue, 01 Dec 2020 18:06:47 GMT

### Minor changes

- Handle undefined values by stripping the props out

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

