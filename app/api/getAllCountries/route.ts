import { PrismaClient } from '../../generated/prisma';

const Prisma = new PrismaClient();

export async function GET() {
  const countries = await Prisma.powerPlant.findMany({
    select: {
      country_long: true,
    },
    distinct: ['country_long'],
  });
  const countryNames = countries.map((c) => c.country_long);
  return Response.json(countryNames);
}
