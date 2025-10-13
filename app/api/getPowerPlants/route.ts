import { getValidFields } from '@/app/apiUtils/getValidFields';
import { PrismaClient, Prisma } from '../../generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

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

export async function GET(request: Request) {
  // validate params obj against zod schema
  const url = new URL(request.url);

  const rawParams: Record<string, string> = {};

  url.searchParams.forEach((param, key) => {
    rawParams[key] = param;
  });

  const parsedParams = querySchema.safeParse(rawParams);
  if (!parsedParams.success) {
    console.error('getPowerPlants invalid query params', parsedParams.error);
    return Response.json(
      {
        error: 'Invalid query parameters',
        issues: parsedParams.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }
  const country = url.searchParams.get('country');
  const primaryFuel = url.searchParams.get('primaryFuel');
  // add additional filters for where when required
  const fields = url.searchParams.get('fields');

  // Build where query
  const whereClause: Prisma.PowerPlantWhereInput = {};
  if (country) {
    whereClause.country_long = country;
  }
  if (primaryFuel) {
    whereClause.primary_fuel = primaryFuel;
  }

  // build select query
  const validFields = fields ? getValidFields(fields) : undefined;

  const selectClause: Prisma.PowerPlantSelect | undefined = validFields
    ? validFields.reduce<Prisma.PowerPlantSelect>((acc, field) => {
        acc[field] = true;
        return acc;
      }, {})
    : undefined;

  // if fields were requested but none valid, return explicit error to client instead of all fields
  if (fields?.length && selectClause === undefined) {
    return Response.json(
      {
        error: 'No valid fields supplied',
        requested: fields.split(',').map((s) => s.trim()),
      },
      { status: 400 }
    );
  }

  try {
    const plants = await prisma.powerPlant.findMany({
      where: whereClause,
      select: selectClause,
    });
    return Response.json({ plants });
  } catch (err) {
    console.error('[getPowerPlants] error', err);
    return Response.json(
      { error: 'Failed to fetch power plants' },
      { status: 500 }
    );
  }
}
