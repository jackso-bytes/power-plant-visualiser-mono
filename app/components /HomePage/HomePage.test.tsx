/**
 * @jest-environment jsdom
 */

import React from 'react';
import HomePage from './HomePage';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGetAllCountries from '../../../hooks/useGetAllCountries/useGetAllCountries';
import useGetPowerPlants from '../../../hooks/useGetPowerPlants/useGetPowerPlants';
import { PowerPlant } from '@/app/types/responseTypes';

jest.mock('../../../hooks/useGetAllCountries/useGetAllCountries');
jest.mock('../../../hooks/useGetPowerPlants/useGetPowerPlants');
jest.mock('../PowerPlantMapView/PowerPlantMapView', () => ({
  __esModule: true,
  default: ({ country }: { country: string }) => (
    <div data-testid='mock-map-view'>{country}</div>
  ),
}));

const mockUseGetAllCountries = useGetAllCountries as jest.MockedFunction<typeof useGetAllCountries>;
const mockUseGetPowerPlants = useGetPowerPlants as jest.MockedFunction<typeof useGetPowerPlants>;

const plants: PowerPlant[] = [
  { name: 'Plant A', latitude: 51.5, longitude: -0.1, primary_fuel: 'Wind' },
];

const renderHomePage = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <HomePage />
    </QueryClientProvider>,
  );

describe('HomePage test suite', () => {
  beforeEach(() => {
    mockUseGetAllCountries.mockReturnValue({ countries: ['Germany', 'France'], error: null, isLoading: false });
    mockUseGetPowerPlants.mockReturnValue({ plants, error: null, isLoading: false });
  });

  it('renders with correct headings', () => {
    const { container } = renderHomePage();
    expect(container.querySelector('h1')?.textContent).toBe('Welcome to Power Plant Visualizer');
    expect(container.querySelector('h2')?.textContent).toBe('Search to begin');
  });

  it('renders the map view', () => {
    const { getByTestId } = renderHomePage();
    expect(getByTestId('mock-map-view')).toBeDefined();
  });
});
