import { useQuery } from '@tanstack/react-query'
import { fetchDoctorById } from '../services/fetchDoctor'

// Hook to fetch doctor data
export function useFetchDoctorById(userId) {
  return useQuery({
    queryKey: ['doctor', userId],
    queryFn: () => fetchDoctorById(userId),
    enabled: !!userId,
  })
}
