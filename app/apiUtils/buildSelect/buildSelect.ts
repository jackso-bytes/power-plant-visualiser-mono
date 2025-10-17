import { Prisma } from '../generated/prisma';

export const buildSelect = (
  validFields: Prisma.PowerPlantScalarFieldEnum[] | undefined
): Prisma.PowerPlantSelect | undefined => {
  if (!validFields || validFields.length === 0) return undefined;
  return validFields
    ? validFields.reduce<Prisma.PowerPlantSelect>((acc, field) => {
        acc[field] = true;
        return acc;
      }, {})
    : undefined;
};
