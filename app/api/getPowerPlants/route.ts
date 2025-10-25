import { buildWhere } from '@/app/apiUtils/buildWhere /buildWhere';
import { PrismaClient } from '../../generated/prisma';
import { validateParams } from '@/app/apiUtils/validateParams/validateParams';
import { getValidFields } from '@/app/apiUtils/getValidFields/getValidFields';
import { buildSelect } from '@/app/apiUtils/buildSelect/buildSelect';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // validate params obj against zod schema
  const url = new URL(request.url);
  const parsedParams = validateParams(url);

  // early return for invalid/malicious params
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

  const country = url.searchParams.get('country_long');
  const primaryFuel = url.searchParams.get('primary_fuel');
  // add additional filters here for where when required
  const fields = url.searchParams.get('fields');

  // Build queries
  const whereClause = buildWhere(country, primaryFuel);
  const validFields = fields ? getValidFields(fields) : undefined;
  const selectClause = buildSelect(validFields);

  // if fields were requested but none are valid, return explicit error to client instead of all fields
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
