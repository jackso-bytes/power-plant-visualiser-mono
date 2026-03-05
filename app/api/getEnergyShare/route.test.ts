import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';

describe('getEnergyShare tests', () => {
  // Unhappy paths

  it('Should return 400 when country_long is missing', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getEnergyShare',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(400);
        const json = await response.json();
        expect(json).toEqual({ error: 'country_long is required' });
      },
    });
  });

  it('Should return 400 for malicious country_long', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getEnergyShare?country_long=<script>alert(1)</script>',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(400);
        const json = await response.json();
        expect(json.error).toBe('Invalid query parameters');
        expect(json.issues).toBeDefined();
      },
    });
  });

  it('Should return 400 for year above valid range', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getEnergyShare?country_long=Germany&year=2020',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(400);
        const json = await response.json();
        expect(json).toEqual({ error: 'Invalid year. Must be between 2013 and 2017' });
      },
    });
  });

  it('Should return 400 for year below valid range', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getEnergyShare?country_long=Germany&year=1999',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(400);
        const json = await response.json();
        expect(json).toEqual({ error: 'Invalid year. Must be between 2013 and 2017' });
      },
    });
  });

  it('Should return 400 when year is not a number', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getEnergyShare?country_long=Germany&year=abc',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(400);
        const json = await response.json();
        expect(json.error).toBe('Invalid query parameters');
        expect(json.issues).toBeDefined();
      },
    });
  });

  it('Should return 404 for a country with no plants', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getEnergyShare?country_long=Atlantis',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(404);
        const json = await response.json();
        expect(json).toEqual({ error: 'No data found for country: Atlantis' });
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
          },
        })),
      };
    });

    // eslint-disable-next-line
    const failingHandler = require('./route');

    await testApiHandler({
      appHandler: failingHandler,
      url: '/api/getEnergyShare?country_long=Germany',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(500);
        const json = await response.json();
        expect(json).toEqual({ error: 'Failed to fetch energy share' });
      },
    });

    jest.dontMock('../../generated/prisma');
  });

  // Happy paths

  it('Should return 200 with valid response shape for a known country', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getEnergyShare?country_long=Germany',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json.country).toBe('Germany');
        expect(json.year).toBe(2017);
        expect(typeof json.totalGenerationGwh).toBe('number');
        expect(typeof json.renewableGenerationGwh).toBe('number');
        expect(typeof json.nonRenewableGenerationGwh).toBe('number');
        expect(typeof json.renewablePercentage).toBe('number');
        expect(typeof json.nonRenewablePercentage).toBe('number');
      },
    });
  });

  it('Should return 200 with correct year when explicit year sent', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getEnergyShare?country_long=Germany&year=2015',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json.year).toBe(2015);
      },
    });
  });

  it('Percentages should sum to approximately 100', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getEnergyShare?country_long=Germany',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(200);
        const json = await response.json();
        expect(
          Math.abs(json.renewablePercentage + json.nonRenewablePercentage - 100)
        ).toBeLessThan(0.01);
      },
    });
  });

  it('totalGenerationGwh should equal sum of renewable and nonRenewable', async () => {
    await testApiHandler({
      appHandler,
      url: '/api/getEnergyShare?country_long=Germany',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        expect(response.status).toBe(200);
        const json = await response.json();
        expect(
          Math.abs(
            json.renewableGenerationGwh + json.nonRenewableGenerationGwh - json.totalGenerationGwh
          )
        ).toBeLessThan(0.01);
      },
    });
  });
});
