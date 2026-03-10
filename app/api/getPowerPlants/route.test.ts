import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

describe('getPowerPlants tests', () => {
  // unhappy paths for where query inputs
  it('Should return a 400 and empty array for malicious inputs', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getPowerPlants?country_long=<script>alert(1)</script>',
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
              path: 'country_long',
            },
          ],
        });
      },
    });
  });

  it('Should return explicit 400 error when fields param has no valid fields', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getPowerPlants?fields=invalidField,anotherInvalid',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(400);
        const json = await response.json();
        expect(json).toEqual({
          error: 'No valid fields supplied',
          requested: ['invalidField', 'anotherInvalid'],
        });
      },
    });
  });

  it('Should return 500 if database query fails', async () => {
    jest.resetModules();

    jest.doMock('../../generated/prisma', () => {
      return {
        PrismaClient: jest.fn().mockImplementation(() => ({
          powerPlant: {
            findMany: jest.fn().mockRejectedValue(new Error('Database error')),
            count: jest.fn(),
          },
        })),
      };
    });

    // eslint-disable-next-line
    const failingHandler = require('./route');

    await testApiHandler({
      appHandler: failingHandler,
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(500);
        const json = await response.json();
        expect(json).toEqual({ error: 'Failed to fetch power plants' });
      },
    });

    jest.dontMock('../../generated/prisma');
  });

  // Happy paths

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

  it('Should return 200 with filtered power plants when country or primaryFuel sent', async () => {
    const prisma = new PrismaClient();
    const expectedPlants = await prisma.powerPlant.findMany({
      where: {
        country_long: 'United Kingdom',
        primary_fuel: 'Solar',
      },
    });

    await testApiHandler({
      appHandler,
      url: '/api/getPowerPlants?country_long=United%20Kingdom&primary_fuel=Solar',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(200);
        const json = await response.json();

        expect(json.plants).toEqual(expectedPlants);
      },
    });
  });

  it('Should return 200 with only selected fields when fields param sent', async () => {
    const plants = await prisma.powerPlant.findMany({
      select: {
        name: true,
      },
    });

    await testApiHandler({
      appHandler,
      url: 'api/getPowerPlants?fields=name',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json.plants).toEqual(plants);
      },
    });
  });
});
