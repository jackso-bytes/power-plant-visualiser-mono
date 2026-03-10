export type AllCountriesResponse = string[];

export type PowerPlant = {
  id: number;
  name: string | null;
  latitude: number | null;
  longitude: number | null;
  primary_fuel: string | null;
};

export type GetPowerPlantsResponse = { plants: PowerPlant[] };

export type EnergyShareResponse = {
  country: string;
  year: number;
  totalGenerationGwh: number;
  renewableGenerationGwh: number;
  nonRenewableGenerationGwh: number;
  renewablePercentage: number;
  nonRenewablePercentage: number;
};
