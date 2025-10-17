import { getValidFields } from './getValidFields';

describe('getValidFields tests', () => {
  // unhappy paths
  it('should return undefined for empty string or invalid fields', () => {
    expect(getValidFields('')).toBeUndefined();
    expect(getValidFields('invalidField')).toBeUndefined();
    expect(getValidFields('invalidField,anotherInvalid')).toBeUndefined();
  });

  it('should return undefined for whitespace only input', () => {
    expect(getValidFields('   ')).toBeUndefined();
    expect(getValidFields(' , , ')).toBeUndefined();
  });

  // happy paths
  it('should filter out invalid fields when mixed with valid ones', () => {
    expect(
      getValidFields('invalidField, primary_fuel, anotherInvalid')
    ).toEqual(['primary_fuel']);
  });

  it('should deduplicate fields', () => {
    expect(getValidFields('country_long, country_long, primary_fuel')).toEqual([
      'country_long',
      'primary_fuel',
    ]);
  });

  it('should return valid fields when string has whitespace', () => {
    expect(getValidFields(' country_long   ,     primary_fuel  ')).toEqual([
      'country_long',
      'primary_fuel',
    ]);
  });

  it('should return valid fields array when has valid inputs', () => {
    expect(getValidFields('country_long')).toEqual(['country_long']);
    expect(getValidFields('country_long, primary_fuel')).toEqual([
      'country_long',
      'primary_fuel',
    ]);
  });
});
