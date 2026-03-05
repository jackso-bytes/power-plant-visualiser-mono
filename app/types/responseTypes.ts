export type AllCountriesResponse = string[];

export type EnergyShareResponse = {
  country: string;
  year: number;
  totalGenerationGwh: number;
  renewableGenerationGwh: number;
  nonRenewableGenerationGwh: number;
  renewablePercentage: number;
  nonRenewablePercentage: number;
};
