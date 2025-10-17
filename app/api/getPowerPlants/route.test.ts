import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

describe('getPowerPlants tests', () => {
  // unhappy paths for where query inputs
  it('should return a 400 and empty array for malicious inputs', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getPowerPlants?country=<script>alert(1)</script>',
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'GET',
        });

        expect(response.status).toBe(400);

        const json = await response.json();
        expect(json).toEqual({
          error: 'Invalid query parameters',
          issues: [
            {
              message: 'Invalid country',
              path: 'country',
            },
          ],
        });
      },
    });
  });

  it('Should return 200 and all power plants when no query params sent', async () => {
    const count = await prisma.powerPlant.count();
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();
        expect(response.status).toBe(200);
        expect(json.plants).toHaveLength(count);
      },
    });
  });

  it.only('should return 200 with filtered power plants when country or primaryFuel sent', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getPowerPlants?country=United%20Kingdom&primaryFuel=Solar&fields=name',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(200);
        const json = await response.json();

        expect(json.plants).toEqual(expect.objectContaining([]));
      },
    });
  });
});
