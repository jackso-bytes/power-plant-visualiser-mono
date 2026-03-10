'use client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { PowerPlant } from '@/app/types/responseTypes';
import { useEffect } from 'react';
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

type Props = { plants: PowerPlant[] };

const validPlants = (plants: PowerPlant[]) =>
  plants.filter(
    (p): p is PowerPlant & { latitude: number; longitude: number } =>
      p.latitude !== null && p.longitude !== null,
  );

const FitBounds = ({ plants }: Props) => {
  const map = useMap();
  useEffect(() => {
    const valid = validPlants(plants);
    if (valid.length === 0) return;
    const bounds = L.latLngBounds(valid.map((p) => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [plants, map]);
  return null;
};

const PowerPlantMap = ({ plants }: Props) => {
  const valid = validPlants(plants);
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      data-testid='map-container'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <FitBounds plants={plants} />
      {valid.map((plant) => (
        <Marker key={plant.name} position={[plant.latitude, plant.longitude]}>
          <Popup>
            <strong>{plant.name}</strong>
            <br />
            {plant.primary_fuel}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default PowerPlantMap;
