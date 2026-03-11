/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import EnergyShareView from './EnergyShareView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('EnergyShareView', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <QueryClientProvider client={new QueryClient()}>
        <EnergyShareView country='United Kingdom' />
      </QueryClientProvider>,
    );
    expect(getByTestId('energy-share-view')).toBeDefined();
  });
});
