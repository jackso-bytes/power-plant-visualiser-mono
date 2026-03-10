/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGetPowerPlants from './useGetPowerPlants';
import { GetPowerPlantsResponse } from '@/app/types/responseTypes';

const mockedSuccess: GetPowerPlantsResponse = {
  plants: [
    { id: 1, name: 'Plant A', latitude: 51.5, longitude: -0.1, primary_fuel: 'Wind' },
    { id: 2, name: 'Plant B', latitude: 48.8, longitude: 2.3, primary_fuel: 'Solar' },
  ],
};

const makeQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderHookWithClient = (country?: string, primaryFuel?: string) => {
  const queryClient = makeQueryClient();
  return renderHook(() => useGetPowerPlants(country, primaryFuel), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('useGetPowerPlants', () => {
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

  it('returns loading state initially when country given', () => {
    const { result } = renderHookWithClient('Germany');
    expect(result.current.isLoading).toBe(true);
    expect(result.current.plants).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('returns data on success', async () => {
    const { result } = renderHookWithClient('Germany');
    await waitFor(() => {
      expect(result.current.plants).toEqual(mockedSuccess.plants);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('exposes error on rejection', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    const { result } = renderHookWithClient('Germany');
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });

  it('does not fetch when no country given', () => {
    renderHookWithClient();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('fetches with country_long param when country given', async () => {
    renderHookWithClient('Germany');
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
    const url = (globalThis.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain('country_long=Germany');
  });

  it('includes primary_fuel param when provided', async () => {
    renderHookWithClient('Germany', 'Wind');
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
    const url = (globalThis.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain('primary_fuel=Wind');
  });

  it('omits primary_fuel param when not provided', async () => {
    renderHookWithClient('Germany');
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
    const url = (globalThis.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(new URL(url).searchParams.has('primary_fuel')).toBe(false);
  });
});
