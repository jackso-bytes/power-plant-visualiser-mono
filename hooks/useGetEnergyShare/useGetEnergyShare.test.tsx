/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGetEnergyShare from './useGetEnergyShare';
import { EnergyShareResponse } from '@/app/types/responseTypes';

const mockedSuccess: EnergyShareResponse = {
  country: 'Germany',
  year: 2017,
  totalGenerationGwh: 16667,
  renewableGenerationGwh: 6667,
  nonRenewableGenerationGwh: 10000,
  renewablePercentage: 40,
  nonRenewablePercentage: 60,
};

const makeQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderUseGetEnergyShareHook = (country: string, year?: number) => {
  const queryClient = makeQueryClient();
  return renderHook(() => useGetEnergyShare(country, year), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('useGetEnergyShare test suite', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockedSuccess),
      } as Response),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should return default state initially', () => {
    const { result } = renderUseGetEnergyShareHook('Germany');

    expect(result.current).toEqual({
      energyShare: undefined,
      isLoading: true,
      error: null,
    });
  });

  it('Should return data on success', async () => {
    const { result } = renderUseGetEnergyShareHook('Germany');

    await waitFor(() => {
      expect(result.current).toEqual({
        energyShare: mockedSuccess,
        isLoading: false,
        error: null,
      });
    });
  });

  it('Exposes error on failure', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderUseGetEnergyShareHook('Germany');

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
