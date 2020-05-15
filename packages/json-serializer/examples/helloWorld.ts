import { jsonSerializer } from '../'

// This is your AWS handler
async function helloWorld() {
  return {}
}

// Wrap the handler with the middleware
export const handler = jsonSerializer()(helloWorld)
