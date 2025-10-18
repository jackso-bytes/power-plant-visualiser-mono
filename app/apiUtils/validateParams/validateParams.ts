import z from 'zod';

const COUNTRY_REGEX = /^[A-Za-z .'\-()&,]{2,60}$/u;
const PRIMARY_FUEL_REGEX = /^[A-Za-z0-9 _\-]{1,30}$/u;
const FIELDS_REGEX = /^[A-Za-z0-9_, ]{1,300}$/u;

const querySchema = z
  .object({
    country: z
      .string()
      .trim()
      .regex(COUNTRY_REGEX, 'Invalid country')
      .optional(),
    primaryFuel: z
      .string()
      .trim()
      .regex(PRIMARY_FUEL_REGEX, 'Invalid primary fuel')
      .optional(),
    fields: z
      .string()
      .trim()
      .regex(FIELDS_REGEX, 'Invalid formating on fields')
      .optional(),
  })
  .strict();

export const validateParams = (url: URL) => {
  const rawParams: Record<string, string> = {};

  url.searchParams.forEach((param, key) => {
    rawParams[key] = param;
  });

  return querySchema.safeParse(rawParams);
};
