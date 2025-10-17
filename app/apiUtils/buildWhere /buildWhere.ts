import { Prisma } from '@/app/generated/prisma';

export const buildWhere = (
  country: string | null | undefined,
  primaryFuel: string | null | undefined
): Prisma.PowerPlantWhereInput => {
  const whereClause: Prisma.PowerPlantWhereInput = {};
  if (country) {
    whereClause.country_long = country;
  }
  if (primaryFuel) {
    whereClause.primary_fuel = primaryFuel;
  }
  return whereClause;
};
