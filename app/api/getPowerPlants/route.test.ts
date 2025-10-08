import { GET } from './route';

global.Response = {
  json: (data: unknown): Response =>
    ({
      json: (): Promise<unknown> => Promise.resolve(data),
      status: 200,
      ok: true,
      statusText: 'OK',
    } as Response),
} as typeof Response;

describe('getPowerPlants tests', () => {
  it('should return correct list of power plants', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.plants).toHaveLength(50);
    expect(data.plants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          country_long: 'United Kingdom',
          primary_fuel: 'Wind',
        }),
      ])
    );
  });
});
