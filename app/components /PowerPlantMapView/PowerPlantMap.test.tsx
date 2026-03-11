/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import PowerPlantMap from './PowerPlantMap';
import { PowerPlant } from '@/app/types/responseTypes';

jest.mock('leaflet/dist/leaflet.css', () => {});
jest.mock('leaflet', () => {
  const actual = jest.requireActual('leaflet');
  return {
    ...actual,
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: jest.fn(),
      },
    },
    latLngBounds: jest.fn(() => ({
      extend: jest.fn(),
    })),
  };
});
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='map-container'>{children}</div>
  ),
  TileLayer: () => <div data-testid='tile-layer' />,
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='marker'>{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='popup'>{children}</div>
  ),
  useMap: () => ({ fitBounds: jest.fn() }),
}));

const plants: PowerPlant[] = [
  {
    name: 'Plant A',
    latitude: 51.5,
    longitude: -0.1,
    primary_fuel: 'Wind',
    id: 1234,
  },
  {
    name: 'Plant B',
    latitude: 48.8,
    longitude: 2.3,
    primary_fuel: 'Solar',
    id: 1234,
  },
  {
    name: 'No Coords',
    latitude: null,
    longitude: null,
    primary_fuel: 'Gas',
    id: 1234,
  },
];

describe('PowerPlantMap', () => {
  it('renders map container', () => {
    render(<PowerPlantMap plants={[]} />);
    expect(screen.getByTestId('map-container')).toBeDefined();
  });

  it('renders a marker per plant with valid coords', () => {
    render(<PowerPlantMap plants={plants} />);
    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(2);
  });

  it('skips plants with null lat/lng', () => {
    const nullPlants: PowerPlant[] = [
      {
        name: 'No Coords',
        latitude: null,
        longitude: null,
        primary_fuel: 'Gas',
        id: 1234,
      },
    ];
    render(<PowerPlantMap plants={nullPlants} />);
    expect(screen.queryAllByTestId('marker')).toHaveLength(0);
  });

  it('popup shows name and primary_fuel', () => {
    render(<PowerPlantMap plants={plants} />);
    expect(screen.getByText('Plant A')).toBeDefined();
    expect(screen.getByText('Wind')).toBeDefined();
    expect(screen.getByText('Plant B')).toBeDefined();
    expect(screen.getByText('Solar')).toBeDefined();
  });
});
