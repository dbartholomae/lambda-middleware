---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/src/logger.ts
---
import debugFactory, { IDebugger } from "debug";

export const logger: IDebugger = debugFactory("@lambda-middleware/<%= h.inflection.dasherize(name.toLowerCase()) %>");
