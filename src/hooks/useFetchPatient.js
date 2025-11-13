import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchAllPatient } from '../services/fetchAllPatient'

// Custom hook to fetch patient data with infinite scrolling
export function useFetchPatientData() {
  return useInfiniteQuery({
    queryKey: ['all-patients'],
    queryFn: fetchAllPatient,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}
