import { logger } from "../logger";

export class CallbackListener {
  public callbackCalled = false;
  public callbackError: any;
  public callbackResponse: any;

  public callback = (error: unknown, result: unknown) => {
    logger("instance callback function called");
    this.callbackCalled = true;
    this.callbackError = error;
    this.callbackResponse = result;
  };

  public handleCallback = () => {
    logger("callback called in after or onError middleware");
    if (this.callbackError) {
      throw this.callbackError;
    }
    return this.callbackResponse;
  };
}
