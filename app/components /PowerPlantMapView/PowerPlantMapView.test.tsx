/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import PowerPlantMapView from './PowerPlantMapView';
import useGetPowerPlants from '../../../hooks/useGetPowerPlants/useGetPowerPlants';
import { PowerPlant } from '@/app/types/responseTypes';

jest.mock('../../../hooks/useGetPowerPlants/useGetPowerPlants');
const mockUseGetPowerPlants = useGetPowerPlants as jest.MockedFunction<
  typeof useGetPowerPlants
>;

jest.mock('./PowerPlantMap', () => ({
  __esModule: true,
  default: ({ plants }: { plants: PowerPlant[] }) => (
    <div data-testid='mock-power-plant-map'>plants: {plants.length}</div>
  ),
}));

jest.mock(
  'next/dynamic',
  () =>
    (
      fn: () => Promise<{
        default: React.ComponentType<Record<string, unknown>>;
      }>,
    ) => {
      let Component: React.ComponentType<Record<string, unknown>> | null = null;
      fn().then((mod) => {
        Component = mod.default;
      });
      function DynamicComponent(props: Record<string, unknown>) {
        return Component ? <Component {...props} /> : null;
      }
      return DynamicComponent;
    },
);

const plants: PowerPlant[] = [
  {
    name: 'Plant A',
    latitude: 51.5,
    longitude: -0.1,
    primary_fuel: 'Wind',
    id: 1234,
  },
];

describe('PowerPlantMapView', () => {
  it('renders without crash', () => {
    mockUseGetPowerPlants.mockReturnValue({
      plants: undefined,
      error: null,
      isLoading: false,
    });
    render(<PowerPlantMapView country='' />);
    expect(screen.getByTestId('power-plant-map-view')).toBeDefined();
  });

  it('shows prompt when no country selected', () => {
    mockUseGetPowerPlants.mockReturnValue({
      plants: undefined,
      error: null,
      isLoading: false,
    });
    render(<PowerPlantMapView country='' />);
    expect(
      screen.getByText('Select a country to view power plants'),
    ).toBeDefined();
  });

  it('shows loading state when country given', () => {
    mockUseGetPowerPlants.mockReturnValue({
      plants: undefined,
      error: null,
      isLoading: true,
    });
    render(<PowerPlantMapView country='Germany' />);
    expect(screen.getByText('Loading map...')).toBeDefined();
  });

  it('shows error state', () => {
    mockUseGetPowerPlants.mockReturnValue({
      plants: undefined,
      error: new Error('fail'),
      isLoading: false,
    });
    render(<PowerPlantMapView country='Germany' />);
    expect(screen.getByText('Error loading plants.')).toBeDefined();
  });

  it('renders map with data', async () => {
    mockUseGetPowerPlants.mockReturnValue({
      plants,
      error: null,
      isLoading: false,
    });
    render(<PowerPlantMapView country='Germany' />);
    expect(screen.getByTestId('power-plant-map-view')).toBeDefined();
    expect(mockUseGetPowerPlants).toHaveBeenCalledWith('Germany');
  });
});
