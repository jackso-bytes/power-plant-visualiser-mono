/**
 * @jest-environment jsdom
 */
import { screen, render } from '@testing-library/react';
import { SearchSelect, SearchSelectProps } from './SearchSelect';

const renderSearchSelect = ({ title, options }: SearchSelectProps) => {
  return render(SearchSelect({ title, options, setSearchState: jest.fn() }));
};

describe('SearchSelect test suite', () => {
  it('Should display the correct title for given input', () => {
    renderSearchSelect({
      title: 'Country',
      options: ['USA', 'UK'],
      setSearchState: jest.fn(),
    });
    expect(
      screen.getByRole('combobox', { name: 'Select a Country' })
    ).toBeDefined();
  });

  it('Should render the correct options for given input', () => {
    const options = ['UK', 'USA', 'Mexico'];
    renderSearchSelect({
      title: 'Country',
      options,
      setSearchState: jest.fn(),
    });

    expect(screen.getByText('UK')).toBeDefined();
    expect(screen.getByText('USA')).toBeDefined();
    expect(screen.getByText('Mexico')).toBeDefined();
  });

  it('Should set the selected option as searchState correctly', () => {
    renderSearchSelect({
      title: 'Country',
      options: ['UK', 'USA', 'Mexico'],
      setSearchState: jest.fn(),
    });
    // Simulate user selecting option expect setSearchState to have been called with correct value
  });
});
