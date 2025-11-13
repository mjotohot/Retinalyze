import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchAllDoctors } from '../services/fetchDoctor'

// Hook to fetch all doctors data with infinite scrolling
export function useFetchDoctor() {
  return useInfiniteQuery({
    queryKey: ['all-doctors'],
    queryFn: fetchAllDoctors,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}
