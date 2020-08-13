import debugFactory, { IDebugger } from "debug";

export const logger: IDebugger = debugFactory(
  "@lambda-middleware/http-header-normalizer"
);
