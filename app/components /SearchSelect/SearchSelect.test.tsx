/**
 * @jest-environment jsdom
 */
import { screen, render } from '@testing-library/react';
import { SearchSelect, SearchSelectProps } from './SearchSelect';

const renderSearchSelect = ({ searchField, title }: SearchSelectProps) => {
  return render(SearchSelect({ searchField, title }));
};

describe('SearchSelect test suite', () => {
  it('Should display the correct title for given input', () => {
    renderSearchSelect({ searchField: 'country_long', title: 'Country' });
    expect(
      screen.getByRole('combobox', { name: 'Select a Country' })
    ).toBeDefined();
  });

  it('Should return the correct options for given field input', () => {});

  it('Should set the selected option as searchState correctly', () => {});
});
