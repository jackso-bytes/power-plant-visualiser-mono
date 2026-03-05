export const VALID_YEARS = [2013, 2014, 2015, 2016, 2017] as const;
export type ValidYear = (typeof VALID_YEARS)[number];

const yearFieldMap: Record<ValidYear, string> = {
  2013: 'estimated_generation_gwh_2013',
  2014: 'estimated_generation_gwh_2014',
  2015: 'estimated_generation_gwh_2015',
  2016: 'estimated_generation_gwh_2016',
  2017: 'estimated_generation_gwh_2017',
};

export function getYearField(year: number): string | null {
  if (!VALID_YEARS.includes(year as ValidYear)) return null;
  return yearFieldMap[year as ValidYear];
}
