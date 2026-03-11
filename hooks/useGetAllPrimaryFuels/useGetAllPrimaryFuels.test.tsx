/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGetAllPrimaryFuels from './useGetAllPrimaryFuels';

const mockedDataForSuccess = { primaryFuels: ['Gas', 'Wind', 'Solar'] };
const mockedDataForFailure = { message: 'Internal Server Error' };

const queryClient = new QueryClient();

const renderHookWithProvider = () =>
  renderHook(() => useGetAllPrimaryFuels(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

describe('useGetAllPrimaryFuels', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockedDataForSuccess),
      } as Response),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
    queryClient.clear();
  });

  it('returns default state initially', () => {
    const { result } = renderHookWithProvider();
    expect(result.current).toEqual({
      primaryFuels: undefined,
      isLoading: true,
      error: null,
    });
  });

  it('returns data on success', async () => {
    const { result } = renderHookWithProvider();
    await waitFor(() => {
      expect(result.current).toEqual({
        primaryFuels: mockedDataForSuccess.primaryFuels,
        isLoading: false,
        error: null,
      });
    });
  });

  it('exposes error state on failure', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(mockedDataForFailure);
    const { result } = renderHookWithProvider();
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
