import { useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '../api/supabaseClient'

// Define page size
const PAGE_SIZE = 10

// Function to fetch all doctors data
async function fetchDoctor({ pageParam = 0 }) {
  const from = pageParam * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error } = await supabase
    .from('doctors')
    .select('*, profiles!inner(*)', { count: 'exact' })
    .range(from, to)

  if (error) throw error

  // return shape: data array and whether there's next page
  return {
    data,
    nextPage: data.length === PAGE_SIZE ? pageParam + 1 : null,
    page: pageParam,
  }
}

// Hook to fetch all doctors data with infinite scrolling
export function useFetchDoctor() {
  return useInfiniteQuery({
    queryKey: ['all-doctors'],
    queryFn: fetchDoctor,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}
