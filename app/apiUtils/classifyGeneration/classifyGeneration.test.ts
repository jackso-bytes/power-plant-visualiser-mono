import { classifyGeneration, RENEWABLE_FUELS } from './classifyGeneration';

describe('classifyGeneration', () => {
  it('returns zeros for an empty array', () => {
    expect(classifyGeneration([])).toEqual({ renewable: 0, nonRenewable: 0, total: 0 });
  });

  it('correctly sums renewable generation', () => {
    const plants = RENEWABLE_FUELS.map((fuel) => ({ primary_fuel: fuel, generation: 100 }));
    const { renewable, nonRenewable, total } = classifyGeneration(plants);
    expect(renewable).toBe(RENEWABLE_FUELS.length * 100);
    expect(nonRenewable).toBe(0);
    expect(total).toBe(RENEWABLE_FUELS.length * 100);
  });

  it('correctly sums non-renewable generation', () => {
    const plants = [
      { primary_fuel: 'Gas', generation: 200 },
      { primary_fuel: 'Coal', generation: 300 },
    ];
    const { renewable, nonRenewable, total } = classifyGeneration(plants);
    expect(renewable).toBe(0);
    expect(nonRenewable).toBe(500);
    expect(total).toBe(500);
  });

  it('correctly splits mixed renewable and non-renewable plants', () => {
    const plants = [
      { primary_fuel: 'Solar', generation: 400 },
      { primary_fuel: 'Wind', generation: 600 },
      { primary_fuel: 'Gas', generation: 800 },
      { primary_fuel: 'Coal', generation: 200 },
    ];
    const { renewable, nonRenewable, total } = classifyGeneration(plants);
    expect(renewable).toBe(1000);
    expect(nonRenewable).toBe(1000);
    expect(total).toBe(2000);
  });

  it('skips plants where generation is null', () => {
    const plants = [
      { primary_fuel: 'Solar', generation: null },
      { primary_fuel: 'Gas', generation: 500 },
    ];
    const { renewable, nonRenewable, total } = classifyGeneration(plants);
    expect(renewable).toBe(0);
    expect(nonRenewable).toBe(500);
    expect(total).toBe(500);
  });

  it('treats null primary_fuel as non-renewable', () => {
    const plants = [{ primary_fuel: null, generation: 300 }];
    const { renewable, nonRenewable, total } = classifyGeneration(plants);
    expect(renewable).toBe(0);
    expect(nonRenewable).toBe(300);
    expect(total).toBe(300);
  });

  it('total equals renewable plus nonRenewable', () => {
    const plants = [
      { primary_fuel: 'Hydro', generation: 150 },
      { primary_fuel: 'Coal', generation: 250 },
      { primary_fuel: 'Wind', generation: null },
    ];
    const { renewable, nonRenewable, total } = classifyGeneration(plants);
    expect(total).toBe(renewable + nonRenewable);
  });
});
