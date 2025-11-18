import { AllCountriesResponse } from '@/app/types/responseTypes';
import { useQuery } from '@tanstack/react-query';

const fetchCountries = async (): Promise<AllCountriesResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getAllCountries`
  );
  const countries = await response.json();
  return countries;
};

const useGetAllCountries = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['allCountries'],
    queryFn: () => fetchCountries(),
  });

  return { countries: data, error, isLoading };
};

export default useGetAllCountries;
