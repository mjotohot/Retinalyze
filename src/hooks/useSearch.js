import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

export const useSearch = ({ searchFn, delay = 300, enabled = true }) => {
  const [search, setSearch] = useState('') // stores the user's input
  const [debouncedSearch, setDebouncedSearch] = useState('') // delayed version of query

  // Prevents too many API calls.
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), delay)
    return () => clearTimeout(handler)
  }, [search, delay])

  const { data, error, isLoading, isFetching } = useQuery({
    // unique cache key — includes search term so results are stored separately
    queryKey: ['search', debouncedSearch],

    // the function to actually fetch data
    queryFn: () => searchFn(debouncedSearch),

    // prevents running query when search is empty or disabled
    enabled: enabled && !!debouncedSearch,
  })

  return {
    search,
    setSearch,
    results: data || [],
    isLoading,
    isFetching,
    error,
  }
}
