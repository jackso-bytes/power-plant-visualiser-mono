/**
 * @jest-environment jsdom
 */

import HomePage from './HomePage';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const renderHomePage = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <HomePage />
    </QueryClientProvider>,
  );

describe('HomePage test suite', () => {
  it('It should rneder and contain the correct headings', () => {
    const homePage = renderHomePage();
    const { container } = homePage;
    const h1Element = container.querySelector('h1');
    const h2Element = container.querySelector('h2');

    expect(h1Element?.textContent).toBe('Welcome to Power Plant Visualizer');
    expect(h2Element?.textContent).toBe('Search to begin');
  });
});
