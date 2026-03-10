'use client';
import useGetEnergyShare from '@/hooks/useGetEnergyShare/useGetEnergyShare';
import EnergyPieChart from './EnergyPieChart';

type Props = { country: string };

const EnergyShareView = ({ country }: Props) => {
  const {
    energyShare,
    error: energyShareError,
    isLoading: energyShareLoading,
  } = useGetEnergyShare(country);

  return (
    <div data-testid='energy-share-view' className='w-full'>
      <div className='mt-2'>
        {energyShareLoading && <p>Loading...</p>}
        {energyShareError && <p>Error loading energy data.</p>}
        {energyShare && <EnergyPieChart energyShare={energyShare} />}
      </div>
    </div>
  );
};

export default EnergyShareView;
