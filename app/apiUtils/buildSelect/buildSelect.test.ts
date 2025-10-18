import { buildSelect } from './buildSelect';

describe('test build select clause', () => {
  test('should build select correctly if valid fields provided', () => {
    expect(buildSelect(['name', 'country_long', 'primary_fuel'])).toEqual({
      name: true,
      country_long: true,
      primary_fuel: true,
    });
  });
  test('should return undefined if no valid fields provided', () => {
    expect(buildSelect([])).toBeUndefined();
  });
  test('should return undefined if undefined provided', () => {
    expect(buildSelect(undefined)).toBeUndefined();
  });
});
