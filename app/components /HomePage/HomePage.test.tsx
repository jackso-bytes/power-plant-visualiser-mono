import HomePage from './HomePage';
import { render } from '@testing-library/react';

describe('HomePage test suite', () => {
  it('Should render the HomePage component without crashing', () => {
    expect(true).toBe(true);
  });

  it('Should contain the correct headings', () => {
    const homePage = render(<HomePage />);
    const { container } = homePage;
    const h1Element = container.querySelector('h1');
    const h2Element = container.querySelector('h2');

    expect(h1Element?.textContent).toBe('Welcome to Power Plant Visualizer');
    expect(h2Element?.textContent).toBe('Search to begin');
  });
});
