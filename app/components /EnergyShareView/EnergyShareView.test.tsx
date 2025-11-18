import React from 'react';
import { render } from '@testing-library/react';
import EnergyShareView from './EnergyShareView';

describe('EnergyShareView', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<EnergyShareView />);
    expect(getByTestId('energy-share-view')).toBeDefined();
  });
});
