/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import EnergyPieChart from './EnergyPieChart';
import { EnergyShareResponse } from '@/app/types/responseTypes';

globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const mockEnergyShare: EnergyShareResponse = {
  country: 'Germany',
  year: 2017,
  totalGenerationGwh: 1000,
  renewableGenerationGwh: 400,
  nonRenewableGenerationGwh: 600,
  renewablePercentage: 40,
  nonRenewablePercentage: 60,
};

describe('EnergyPieChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<EnergyPieChart energyShare={mockEnergyShare} />);
    expect(container).toBeDefined();
  });

  it('displays the country name and year', () => {
    render(<EnergyPieChart energyShare={mockEnergyShare} />);
    expect(screen.getByText('Germany — 2017')).toBeDefined();
  });
});
