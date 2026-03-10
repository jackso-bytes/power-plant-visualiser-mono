import { AllPrimaryFuelsResponse } from '@/app/types/responseTypes';
import { useQuery } from '@tanstack/react-query';

const fetchPrimaryFuels = async (): Promise<AllPrimaryFuelsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getAllPrimaryFuels`,
  );
  const data = await response.json();
  return data.primaryFuels;
};

const useGetAllPrimaryFuels = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['allPrimaryFuels'],
    queryFn: fetchPrimaryFuels,
  });

  return { primaryFuels: data, error, isLoading };
};

export default useGetAllPrimaryFuels;
