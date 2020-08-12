import { http-header-normalizer } from "./http-header-normalizer";

describe("http-header-normalizer", () => {
  it("returns the handler's response", async () => {
    const response = {
      statusCode: 200,
      body: "",
    };
    const handler = jest.fn().mockResolvedValue(response);
    expect(await noSniff()(handler)({} as any, {} as any)).toMatchObject(
      response
    );
  });
});
