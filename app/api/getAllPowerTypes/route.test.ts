import { GET } from './route';
import { setupGlobalResponse } from '../../testUtils/globalResponse';

setupGlobalResponse();

describe('getAllPowerTypes', () => {
  it('it should return correct power types', async () => {
    const res = await GET();
    const data = await res.json();

    expect(data).toEqual(
      expect.objectContaining({
        powerTypes: expect.arrayContaining(['oil', 'gas', 'coal']),
      })
    );
  });
});
