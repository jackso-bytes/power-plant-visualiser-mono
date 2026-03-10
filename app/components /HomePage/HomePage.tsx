'use client';
import React, { useState } from 'react';
import useGetAllCountries from '@/hooks/useGetAllCountries/useGetAllCountries';
import useGetAllPrimaryFuels from '@/hooks/useGetAllPrimaryFuels/useGetAllPrimaryFuels';
import SearchSelect from '../shared/SearchSelect/SearchSelect';
import PowerPlantMapView from '../PowerPlantMapView/PowerPlantMapView';
import { Button } from '@/components/ui/button';

export const HomePage = () => {
  const [pendingCountry, setPendingCountry] = useState('');
  const [pendingFuel, setPendingFuel] = useState('');
  const [appliedCountry, setAppliedCountry] = useState('');
  const [appliedFuel, setAppliedFuel] = useState('');

  const { countries } = useGetAllCountries();
  const { primaryFuels } = useGetAllPrimaryFuels();

  const handleSubmit = () => {
    setAppliedCountry(pendingCountry);
    setAppliedFuel(pendingFuel);
  };

  return (
    <>
      <h1 className='text-4xl font-bold text-center sm:text-left'>
        Welcome to Power Plant Visualizer
      </h1>
      <h2>Search to begin</h2>
      <div className='flex gap-2 items-center'>
        <SearchSelect
          title='Select a country'
          options={countries ?? []}
          setSearchState={setPendingCountry}
        />
        <SearchSelect
          title='Select a fuel type'
          options={(primaryFuels ?? []).filter((f): f is string => f !== null)}
          setSearchState={setPendingFuel}
        />
        <Button onClick={handleSubmit} disabled={!pendingCountry}>
          Submit
        </Button>
      </div>
      <div className='isolate h-[60vh] w-full mt-2'>
        <PowerPlantMapView country={appliedCountry} primaryFuel={appliedFuel || undefined} />
      </div>
    </>
  );
};

export default HomePage;
