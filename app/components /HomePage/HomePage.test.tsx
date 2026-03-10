/**
 * @jest-environment jsdom
 */

import React from 'react';
import HomePage from './HomePage';
import { render, screen, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGetAllCountries from '../../../hooks/useGetAllCountries/useGetAllCountries';
import useGetAllPrimaryFuels from '../../../hooks/useGetAllPrimaryFuels/useGetAllPrimaryFuels';
import useGetPowerPlants from '../../../hooks/useGetPowerPlants/useGetPowerPlants';
import { PowerPlant } from '@/app/types/responseTypes';

globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
Element.prototype.scrollIntoView = jest.fn();

jest.mock('../../../hooks/useGetAllCountries/useGetAllCountries');
jest.mock('../../../hooks/useGetAllPrimaryFuels/useGetAllPrimaryFuels');
jest.mock('../../../hooks/useGetPowerPlants/useGetPowerPlants');
jest.mock('../PowerPlantMapView/PowerPlantMapView', () => ({
  __esModule: true,
  default: ({ country, primaryFuel }: { country: string; primaryFuel?: string }) => (
    <div data-testid='mock-map-view'>{country},{primaryFuel}</div>
  ),
}));

const mockUseGetAllCountries = useGetAllCountries as jest.MockedFunction<
  typeof useGetAllCountries
>;
const mockUseGetAllPrimaryFuels = useGetAllPrimaryFuels as jest.MockedFunction<
  typeof useGetAllPrimaryFuels
>;
const mockUseGetPowerPlants = useGetPowerPlants as jest.MockedFunction<
  typeof useGetPowerPlants
>;

const plants: PowerPlant[] = [
  {
    name: 'Plant A',
    latitude: 51.5,
    longitude: -0.1,
    primary_fuel: 'Wind',
    id: 1234,
  },
];

const renderHomePage = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <HomePage />
    </QueryClientProvider>,
  );

describe('HomePage test suite', () => {
  beforeEach(() => {
    mockUseGetAllCountries.mockReturnValue({
      countries: ['Germany', 'France'],
      error: null,
      isLoading: false,
    });
    mockUseGetAllPrimaryFuels.mockReturnValue({
      primaryFuels: ['Gas', 'Wind', 'Solar'],
      error: null,
      isLoading: false,
    });
    mockUseGetPowerPlants.mockReturnValue({
      plants,
      error: null,
      isLoading: false,
    });
  });

  it('renders with correct headings', () => {
    const { container } = renderHomePage();
    expect(container.querySelector('h1')?.textContent).toBe(
      'Welcome to Power Plant Visualizer',
    );
    expect(container.querySelector('h2')?.textContent).toBe('Search to begin');
  });

  it('renders the map view', () => {
    const { getByTestId } = renderHomePage();
    expect(getByTestId('mock-map-view')).toBeDefined();
  });

  it('renders a submit button', () => {
    renderHomePage();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDefined();
  });

  it('submit button is disabled when no country selected', () => {
    renderHomePage();
    expect(screen.getByRole('button', { name: /submit/i })).toHaveProperty('disabled', true);
  });

  it('map does not update until submit is clicked', () => {
    renderHomePage();
    const comboboxes = screen.getAllByRole('combobox');
    act(() => { comboboxes[0].click(); });
    const germanyOption = screen.getByText('Germany');
    act(() => { germanyOption.click(); });
    expect(screen.getByTestId('mock-map-view').textContent).toBe(',');
  });

  it('map updates with country and fuel after submit', () => {
    renderHomePage();
    const comboboxes = screen.getAllByRole('combobox');
    act(() => { comboboxes[0].click(); });
    act(() => { screen.getByText('Germany').click(); });
    act(() => { comboboxes[1].click(); });
    act(() => { screen.getByText('Wind').click(); });
    act(() => { screen.getByRole('button', { name: /submit/i }).click(); });
    expect(screen.getByTestId('mock-map-view').textContent).toBe('Germany,Wind');
  });
});
