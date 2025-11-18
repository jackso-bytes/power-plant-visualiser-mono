'use client';
import useGetAllCountries from '@/hooks/useGetAllCountries/useGetAllCountries';
import { useState } from 'react';
import SearchSelect from '../shared/SearchSelect/SearchSelect';

const EnergyShareView = () => {
  const [searchState, setSearchState] = useState(''); // dummy state to be replaced with context later

  const {
    countries,
    error: countiresError,
    isLoading: countriesLoadingState,
  } = useGetAllCountries();

  return (
    <div data-testid='energy-share-view'>
      <SearchSelect
        title='Select a country'
        options={countries ?? []}
        setSearchState={setSearchState}
      />
    </div>
  );
};

export default EnergyShareView;
