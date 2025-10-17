import { validateParams } from './validateParams';

describe('test validate params', () => {
  test('it should return false for invalid params', () => {
    const url = new URL(
      'http://localhost:3000/api/getPowerPlants?country=United%20Kingdom&primaryFuel=Solar&malicious=<script>alert(1)</script>'
    );
    const result = validateParams(url);
    expect(result.success).toBe(false);
  });

  test('it should return true for valid params', () => {
    const url = new URL(
      'http://localhost:3000/api/getPowerPlants?country=United%20Kingdom&primaryFuel=Solar&fields=name,capacity'
    );
    const result = validateParams(url);
    expect(result.success).toBe(true);
  });
});
