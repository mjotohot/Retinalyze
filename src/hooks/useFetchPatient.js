import { useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '../api/supabaseClient'

// Define page size
const PAGE_SIZE = 10

async function fetchAllPatient({ pageParam = 0 }) {
  const from = pageParam * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  // Fetch patients with related doctor and profile data
  const { data, error } = await supabase
    .from('patients')
    .select(
      ` 
        *,
        doctor:doctor_id (
          id,
          profile:profiles (
            full_name
          )
        ),
        profile:profiles (
          full_name,
          avatar_url
        )
      `,
      { count: 'exact' }
    )
    .range(from, to)

  if (error) throw error

  // return shape: data array and whether there's next page
  return {
    data,
    nextPage: data.length === PAGE_SIZE ? pageParam + 1 : null,
    page: pageParam,
  }
}

// Custom hook to fetch patient data with infinite scrolling
export function useFetchPatientData() {
  return useInfiniteQuery({
    queryKey: ['all-patients'],
    queryFn: fetchAllPatient,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}
