import { getYearField, VALID_YEARS } from './getYearField';

describe('getYearField', () => {
  it.each(VALID_YEARS)(
    'returns correct field name for year %i',
    (year) => {
      expect(getYearField(year)).toBe(`estimated_generation_gwh_${year}`);
    }
  );

  it('returns null for a year below the valid range', () => {
    expect(getYearField(2012)).toBeNull();
  });

  it('returns null for a year above the valid range', () => {
    expect(getYearField(2018)).toBeNull();
  });

  it('returns null for a non-integer year', () => {
    expect(getYearField(2015.5)).toBeNull();
  });
});
