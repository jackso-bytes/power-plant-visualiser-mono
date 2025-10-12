import { getValidFields } from '@/app/apiUtils/getValidFields';
import { PrismaClient, Prisma } from '../../generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);

  // query params
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
    console.log(whereClause, selectClause);
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
