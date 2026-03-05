import { EnergyShareResponse } from '@/app/types/responseTypes';
import { useQuery } from '@tanstack/react-query';

const fetchEnergyShare = async (
  country: string,
  year: number,
): Promise<EnergyShareResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getEnergyShare?country_long=${encodeURIComponent(country)}&year=${year}`,
  );
  return response.json();
};

const useGetEnergyShare = (country: string, year = 2017) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['energyShare', country, year],
    queryFn: () => fetchEnergyShare(country, year),
    enabled: !!country,
  });

  return { energyShare: data, error, isLoading };
};

export default useGetEnergyShare;
