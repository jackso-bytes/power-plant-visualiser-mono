/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGetAllCountries from './useGetAllCountries';

const mockedDataForSuccess = ['USA', 'UK', 'Mexico'];
const mockedDataForFailure = {
  message: 'Internal Server Error',
};

const queryClient = new QueryClient();

const renderUseGetAllCountriesHook = () =>
  renderHook(() => useGetAllCountries(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

describe('useGetAllCountries test suite', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockedDataForSuccess),
      } as Response);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should return default state initially', () => {
    const { result } = renderUseGetAllCountriesHook();

    expect(result.current).toEqual({
      countries: undefined,
      isLoading: true,
      error: null,
    });
  });

  it('Should return data when called successfully', async () => {
    const { result } = renderUseGetAllCountriesHook();

    await waitFor(() => {
      expect(result.current).toEqual({
        countries: mockedDataForSuccess,
        isLoading: false,
        error: null,
      });
    });
  });

  it('exposes error state on failure', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(mockedDataForFailure);

    const { result } = renderUseGetAllCountriesHook();

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
