import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchPatientsByDoctor } from '../services/fetchPatient'

//
export function useFetchPatientsByDoctor(doctorId, selectedRisk) {
  return useInfiniteQuery({
    queryKey: ['patientsByDoctor', doctorId, selectedRisk],
    queryFn: ({ pageParam = 0 }) =>
      fetchPatientsByDoctor({ pageParam, doctorId, riskLevel: selectedRisk }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    enabled: !!doctorId, // prevents running if doctorId is null
  })
}
