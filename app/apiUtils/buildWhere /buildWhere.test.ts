import { buildWhere } from './buildWhere';

describe('test build where clause', () => {
  test('should build where clause correctly with country and primaryFuel', () => {
    const where = buildWhere('United Kingdom', 'Solar');
    expect(where).toEqual({
      country_long: 'United Kingdom',
      primary_fuel: 'Solar',
    });
  });
});
