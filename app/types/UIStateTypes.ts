type PowerPlantField =
  | 'id'
  | 'gppd_idnr'
  | 'name'
  | 'country'
  | 'country_long'
  | 'capacity_mw'
  | 'latitude'
  | 'longitude'
  | 'geolocation'
  | 'primary_fuel'
  | 'other_fuel1'
  | 'other_fuel2'
  | 'other_fuel3'
  | 'estimated_generation_gwh_2013'
  | 'estimated_generation_gwh_2014'
  | 'estimated_generation_gwh_2015'
  | 'estimated_generation_gwh_2016'
  | 'estimated_generation_gwh_2017';

export type SearchState = {
  selectedCountry?: string;
  selectedFuelType?: string;
  filtersApplied?: PowerPlantField[];
};
