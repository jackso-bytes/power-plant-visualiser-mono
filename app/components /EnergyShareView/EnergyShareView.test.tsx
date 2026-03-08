/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import EnergyShareView from './EnergyShareView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGetEnergyShare from '../../../hooks/useGetEnergyShare/useGetEnergyShare';
import { EnergyShareResponse } from '@/app/types/responseTypes';

jest.mock('../../../hooks/useGetEnergyShare/useGetEnergyShare');
const mockUseGetEnergyShare = useGetEnergyShare as jest.MockedFunction<typeof useGetEnergyShare>;

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

const renderView = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <EnergyShareView />
    </QueryClientProvider>
  );

describe('EnergyShareView', () => {
  beforeEach(() => {
    mockUseGetEnergyShare.mockReturnValue({ energyShare: undefined, error: null, isLoading: false });
  });

  it('renders without crashing', () => {
    const { getByTestId } = renderView();
    expect(getByTestId('energy-share-view')).toBeDefined();
  });

  it('shows loading indicator while fetching', () => {
    mockUseGetEnergyShare.mockReturnValue({ energyShare: undefined, error: null, isLoading: true });
    renderView();
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('shows error message on failure', () => {
    mockUseGetEnergyShare.mockReturnValue({ energyShare: undefined, error: new Error('fail'), isLoading: false });
    renderView();
    expect(screen.getByText('Error loading energy data.')).toBeDefined();
  });

  it('renders the chart with country and year when data is available', () => {
    mockUseGetEnergyShare.mockReturnValue({ energyShare: mockEnergyShare, error: null, isLoading: false });
    renderView();
    expect(screen.getByText('Germany — 2017')).toBeDefined();
  });
});
