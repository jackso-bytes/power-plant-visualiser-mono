export const setupGlobalResponse = () => {
  global.Response = {
    json: (data: unknown): Response =>
      ({
        json: (): Promise<unknown> => Promise.resolve(data),
        status: 200,
        ok: true,
        statusText: 'OK',
      } as Response),
  } as typeof Response;
};
