'use client';
import React, { useState } from 'react';
import useGetAllCountries from '@/hooks/useGetAllCountries/useGetAllCountries';
import SearchSelect from '../shared/SearchSelect/SearchSelect';
import PowerPlantMapView from '../PowerPlantMapView/PowerPlantMapView';

export const HomePage = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const { countries } = useGetAllCountries();

  return (
    <>
      <h1 className='text-4xl font-bold text-center sm:text-left'>
        Welcome to Power Plant Visualizer
      </h1>
      <h2>Search to begin</h2>
      <SearchSelect
        title='Select a country'
        options={countries ?? []}
        setSearchState={setSelectedCountry}
      />
      <div className='isolate h-[60vh] w-full mt-2'>
        <PowerPlantMapView country={selectedCountry} />
      </div>
    </>
  );
};

export default HomePage;
