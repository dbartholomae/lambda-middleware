import { Context } from "aws-lambda";

export function createContext(): Context {
  return {
    awsRequestId: "",
    callbackWaitsForEmptyEventLoop: true,
    functionName: "",
    functionVersion: "",
    invokedFunctionArn: "",
    logGroupName: "",
    logStreamName: "",
    memoryLimitInMB: "",
    done: {} as any,
    fail: {} as any,
    getRemainingTimeInMillis: {} as any,
    succeed: {} as any,
  };
}
