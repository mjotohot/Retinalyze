import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchAllPatient } from '../services/fetchPatient'

// Custom hook to fetch patient data with infinite scrolling
export function useFetchPatientData(selectedRisk) {
  return useInfiniteQuery({
    queryKey: ['all-patients', selectedRisk],
    queryFn: ({ pageParam = 0 }) =>
      fetchAllPatient({ pageParam, riskLevel: selectedRisk }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}
