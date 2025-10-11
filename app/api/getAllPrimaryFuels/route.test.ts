import { GET } from './route';
import { setupGlobalResponse } from '../../testUtils/globalResponse';

setupGlobalResponse();

describe('getAllPrimaryFuels', () => {
  it('it should return correct power types', async () => {
    const res = await GET();
    const data = await res.json();

    expect(data).toEqual(
      expect.objectContaining({
        primaryFuels: expect.arrayContaining([
          'Hydro',
          'Solar',
          'Gas',
          'Other',
          'Oil',
          'Wind',
          'Nuclear',
          'Coal',
          'Waste',
          'Biomass',
          'Wave and Tidal',
          'Petcoke',
          'Geothermal',
          'Storage',
          'Cogeneration',
        ]),
      })
    );
  });
});
