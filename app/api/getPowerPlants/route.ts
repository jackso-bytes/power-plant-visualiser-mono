import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  const plants = await prisma.powerPlant.findMany({
    where: {
      country_long: 'United Kingdom',
      primary_fuel: 'Wind',
    },
    take: 50, // limit for safety
  });
  return Response.json({ plants });
}
