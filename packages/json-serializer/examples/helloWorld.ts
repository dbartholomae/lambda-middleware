import { jsonSerializer } from "../";

interface Response {
  // Undefined values will be stripped out
  name?: string;
}

// This is your AWS handler
async function helloWorld(): Promise<Response> {
  return {};
}

// Wrap the handler with the middleware
export const handler = jsonSerializer()(helloWorld);
