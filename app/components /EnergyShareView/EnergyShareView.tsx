'use client';
import useGetAllCountries from '@/hooks/useGetAllCountries/useGetAllCountries';
import useGetEnergyShare from '@/hooks/useGetEnergyShare/useGetEnergyShare';
import { useState } from 'react';
import SearchSelect from '../shared/SearchSelect/SearchSelect';
import EnergyPieChart from './EnergyPieChart';

const EnergyShareView = () => {
  const [searchState, setSearchState] = useState(''); // dummy state to be replaced with context later

  const {
    countries,
    error: countiresError,
    isLoading: countriesLoadingState,
  } = useGetAllCountries();

  const {
    energyShare,
    error: energyShareError,
    isLoading: energyShareLoading,
  } = useGetEnergyShare(searchState);

  return (
    <div data-testid='energy-share-view' className='w-full'>
      {countiresError && (
        <p>Sorry there seems to be an issue with loading the countries</p>
      )}
      {countriesLoadingState && <p>countries is loading</p>}
      <SearchSelect
        title='Select a country'
        options={countries ?? []}
        setSearchState={setSearchState}
      />
      <div className='mt-2'>
        {energyShareLoading && <p>Loading...</p>}
        {energyShareError && <p>Error loading energy data.</p>}
        {energyShare && <EnergyPieChart energyShare={energyShare} />}
      </div>
    </div>
  );
};

export default EnergyShareView;
