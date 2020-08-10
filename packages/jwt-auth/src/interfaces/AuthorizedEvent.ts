/** An event that can be checked for authorization with middly-middleware-jwt-auth */
export interface AuthorizedEvent<TokenPayload = any> {
  /** Authorization information added by this middleware from a JWT. Has to be undefined before hitting the middleware. */
  auth: {
    payload: TokenPayload;
    token: string;
  };
}

export function isAuthorizedEvent<P>(
  event: any,
  isTokenPayload?: (payload: any) => payload is P
): event is AuthorizedEvent<P> {
  return (
    event != null &&
    event.auth != null &&
    typeof event.auth.token === "string" &&
    (isTokenPayload == null || isTokenPayload(event.auth.payload))
  );
}
