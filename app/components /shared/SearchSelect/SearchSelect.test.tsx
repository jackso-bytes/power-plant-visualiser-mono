/**
 * @jest-environment jsdom
 */
import { screen, render, waitFor } from '@testing-library/react';
import { SearchSelect, SearchSelectProps } from './SearchSelect';
import { act } from 'react';

// Mock ResizeObserver for cmdk
globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock scrollIntoView for cmdk
Element.prototype.scrollIntoView = jest.fn();

const renderSearchSelect = ({
  title,
  options,
  setSearchState,
}: SearchSelectProps) => {
  return render(
    <SearchSelect
      title={title}
      options={options}
      setSearchState={setSearchState}
    />
  );
};

describe('SearchSelect test suite', () => {
  it('Should display the correct title for given input', () => {
    act(() => {
      renderSearchSelect({
        title: 'Country',
        options: ['USA', 'UK'],
        setSearchState: jest.fn(),
      });
    });
    expect(screen.getByRole('combobox', { name: 'Country' })).toBeDefined();
  });

  it('Should render the correct options for given input', async () => {
    act(() => {
      renderSearchSelect({
        title: 'Country',
        options: ['UK', 'USA', 'Mexico'],
        setSearchState: jest.fn(),
      });
    });

    act(() => {
      screen.getByRole('combobox').click();
    });
    expect(await screen.findByText('UK')).toBeDefined();
    expect(await screen.findByText('USA')).toBeDefined();
    expect(await screen.findByText('Mexico')).toBeDefined();
  });

  it('Should set the selected option as searchState correctly', async () => {
    const mockSetSearchState = jest.fn();
    act(() => {
      renderSearchSelect({
        title: 'Country',
        options: ['UK', 'USA', 'Mexico'],
        setSearchState: mockSetSearchState,
      });
    });
    expect(screen.getByRole('combobox', { name: 'Country' })).toBeDefined();

    act(() => {
      screen.getByRole('combobox').click();
    });

    const ukOption = await screen.findByText('UK');
    act(() => {
      ukOption.click();
    });

    await waitFor(() => {
      expect(screen.findByText('UK')).toBeDefined();
      expect(mockSetSearchState).toHaveBeenCalledWith('UK');
    });
  });
});
