/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import { SearchSelect, SearchSelectProps } from './SearchSelect';

const renderSearchSelect = ({ searchField, title }: SearchSelectProps) => {
  return render(SearchSelect({ searchField, title }));
};

describe('SearchSelect test suite', () => {
  it('Should display the correct title for given input', () => {
    renderSearchSelect({ searchField: 'country_long', title: 'Country' });
    const selectElement = document.querySelector('select');
    expect(selectElement?.textContent).toBe('Country');
  });

  it('Should return the correct options for given field input', () => {});

  it('Should set the selected option as searchState correctly', () => {});
});
