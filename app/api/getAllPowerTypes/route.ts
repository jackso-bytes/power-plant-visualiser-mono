import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  const powerTypes = await prisma.powerPlant.findMany({
    select: {
      primary_fuel: true,
    },
    distinct: ['primary_fuel'],
  });

  const powerTypesAsStringArray = powerTypes.map((p) => p.primary_fuel);

  return Response.json({ powerTypes: powerTypesAsStringArray });
}
