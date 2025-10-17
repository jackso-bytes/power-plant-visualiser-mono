import { Prisma } from '@/app/generated/prisma';

type PowerPlantField = keyof typeof Prisma.PowerPlantScalarFieldEnum;

export const getValidFields = (
  fields: string
): PowerPlantField[] | undefined => {
  if (fields.length === 0) return undefined;

  /// split string and trim whitespace then dedup with set and convert back to array
  const fieldsArray = Array.from(
    new Set(fields.split(',').map((f) => f.trim()))
  );
  const validFieldsArray = fieldsArray.filter((f): f is PowerPlantField => {
    return f in Prisma.PowerPlantScalarFieldEnum;
  });

  return validFieldsArray.length > 0 ? validFieldsArray : undefined;
};
