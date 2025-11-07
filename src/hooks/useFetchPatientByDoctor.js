import { useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '../api/supabaseClient'

// page size
const PAGE_SIZE = 10

async function fetchPatientsByDoctor({ pageParam = 0, doctorId }) {
  const from = pageParam * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error } = await supabase
    .from('patients')
    .select(
      `
      *,
      profile:profiles (
        full_name,
        avatar_url
      )
    `
    )
    .eq('doctor_id', doctorId)
    .range(from, to)

  if (error) throw new Error(error.message)

  return { data, nextPage: pageParam + 1, hasMore: data.length === PAGE_SIZE }
}

export function useFetchPatientsByDoctor(doctorId) {
  return useInfiniteQuery({
    queryKey: ['patientsByDoctor', doctorId],
    queryFn: ({ pageParam = 0 }) =>
      fetchPatientsByDoctor({ pageParam, doctorId }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    enabled: !!doctorId, // prevents running if doctorId is null
  })
}
