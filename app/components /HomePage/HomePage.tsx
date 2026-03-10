import React from 'react';
import EnergyShareView from '../EnergyShareView/EnergyShareView';

export const HomePage = () => {
  return (
    <>
      <h1 className='text-4xl font-bold text-center sm:text-left'>
        Welcome to Power Plant Visualizer
      </h1>
      <h2>Search to begin</h2>
      <EnergyShareView />
    </>
  );
};

export default HomePage;
