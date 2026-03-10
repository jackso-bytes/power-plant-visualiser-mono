'use client';
import dynamic from 'next/dynamic';
import useGetPowerPlants from '@/hooks/useGetPowerPlants/useGetPowerPlants';

const PowerPlantMap = dynamic(() => import('./PowerPlantMap'), { ssr: false });

type Props = { country: string };

const PowerPlantMapView = ({ country }: Props) => {
  const { plants, error, isLoading } = useGetPowerPlants(country || undefined);

  if (!country) {
    return (
      <div data-testid='power-plant-map-view' className='h-[60vh] w-full flex items-center justify-center'>
        <p>Select a country to view power plants</p>
      </div>
    );
  }

  return (
    <div data-testid='power-plant-map-view' className='h-[60vh] w-full'>
      {isLoading && <p>Loading map...</p>}
      {error && <p>Error loading plants.</p>}
      {!isLoading && !error && <PowerPlantMap plants={plants ?? []} />}
    </div>
  );
};

export default PowerPlantMapView;
