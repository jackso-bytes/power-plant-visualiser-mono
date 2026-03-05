export const RENEWABLE_FUELS = [
  'Solar',
  'Wind',
  'Hydro',
  'Geothermal',
  'Wave and Tidal',
  'Biomass',
] as const;

const RENEWABLE_SET = new Set<string>(RENEWABLE_FUELS);

type PlantRecord = { primary_fuel: string | null; generation: number | null };

export function classifyGeneration(plants: PlantRecord[]): {
  renewable: number;
  nonRenewable: number;
  total: number;
} {
  let renewable = 0;
  let nonRenewable = 0;

  for (const plant of plants) {
    if (plant.generation === null) continue;
    if (plant.primary_fuel && RENEWABLE_SET.has(plant.primary_fuel)) {
      renewable += plant.generation;
    } else {
      nonRenewable += plant.generation;
    }
  }

  return { renewable, nonRenewable, total: renewable + nonRenewable };
}
