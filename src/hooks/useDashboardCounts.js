import { useQuery } from '@tanstack/react-query'
import { fetchPatientCounts } from '../services/fetchPatient'

export function useDashboardCounts(doctorId) {
  return useQuery({
    queryKey: ['dashboardCounts', doctorId],
    queryFn: () => fetchPatientCounts(doctorId),
    enabled: !!doctorId,
  })
}
