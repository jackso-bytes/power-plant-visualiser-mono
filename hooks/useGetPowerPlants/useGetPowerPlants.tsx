import { GetPowerPlantsResponse } from '@/app/types/responseTypes';
import { useQuery } from '@tanstack/react-query';

const fetchPowerPlants = async (
  country?: string,
  primaryFuel?: string,
): Promise<GetPowerPlantsResponse> => {
  const params = new URLSearchParams({
    fields: 'id,name,latitude,longitude,primary_fuel',
  });
  if (country) params.append('country_long', country);
  if (primaryFuel) params.append('primary_fuel', primaryFuel);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getPowerPlants?${params.toString()}`,
  );
  return response.json();
};

const useGetPowerPlants = (country?: string, primaryFuel?: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['powerPlants', country, primaryFuel],
    queryFn: () => fetchPowerPlants(country, primaryFuel),
    enabled: !!country,
  });

  return { plants: data?.plants, error, isLoading };
};

export default useGetPowerPlants;
