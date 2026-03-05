import { PrismaClient } from '../../generated/prisma';
import {
  getYearField,
  VALID_YEARS,
} from '@/app/apiUtils/getYearField/getYearField';
import { classifyGeneration } from '@/app/apiUtils/classifyGeneration/classifyGeneration';
import { EnergyShareResponse } from '@/app/types/responseTypes';

const prisma = new PrismaClient();

const COUNTRY_REGEX = /^[A-Za-z .'\-()&,]{2,60}$/u;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const countryParam = url.searchParams.get('country_long');
  const yearParam = url.searchParams.get('year');

  if (!countryParam) {
    return Response.json(
      { error: 'country_long is required' },
      { status: 400 },
    );
  }

  if (!COUNTRY_REGEX.test(countryParam)) {
    return Response.json(
      {
        error: 'Invalid query parameters',
        issues: [{ path: 'country_long', message: 'Invalid country' }],
      },
      { status: 400 },
    );
  }

  let year = 2017;
  if (yearParam !== null) {
    const parsed = Number(yearParam);
    if (
      !Number.isInteger(parsed) ||
      Number.isNaN(parsed) ||
      String(parsed) !== yearParam.trim()
    ) {
      return Response.json(
        {
          error: 'Invalid query parameters',
          issues: [{ path: 'year', message: 'year must be a number' }],
        },
        { status: 400 },
      );
    }
    if (!VALID_YEARS.includes(parsed as (typeof VALID_YEARS)[number])) {
      return Response.json(
        { error: 'Invalid year. Must be between 2013 and 2017' },
        { status: 400 },
      );
    }
    year = parsed;
  }

  const yearField = getYearField(year)!;

  try {
    const rawPlants = await prisma.powerPlant.findMany({
      where: { country_long: countryParam },
      select: {
        primary_fuel: true,
        [yearField]: true,
      },
    });

    if (rawPlants.length === 0) {
      return Response.json(
        { error: `No data found for country: ${countryParam}` },
        { status: 404 },
      );
    }

    const plants = rawPlants.map((p) => ({
      primary_fuel: p.primary_fuel,
      generation: (p as Record<string, unknown>)[yearField] as number | null,
    }));

    const { renewable, nonRenewable, total } = classifyGeneration(plants);

    const renewablePercentage =
      total > 0 ? Math.round((renewable / total) * 100) : 0;
    const nonRenewablePercentage =
      total > 0 ? Math.round((nonRenewable / total) * 100) : 0;

    const response: EnergyShareResponse = {
      country: countryParam,
      year,
      totalGenerationGwh: total,
      renewableGenerationGwh: renewable,
      nonRenewableGenerationGwh: nonRenewable,
      renewablePercentage,
      nonRenewablePercentage,
    };

    return Response.json(response);
  } catch (err) {
    console.error('[getEnergyShare] error', err);
    return Response.json(
      { error: 'Failed to fetch energy share' },
      { status: 500 },
    );
  }
}
