import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  const primaryFuels = await prisma.powerPlant.findMany({
    select: {
      primary_fuel: true,
    },
    distinct: ['primary_fuel'],
  });

  const primaryFuelsStringArray = primaryFuels.map((p) => p.primary_fuel);

  return Response.json({ primaryFuels: primaryFuelsStringArray });
}
