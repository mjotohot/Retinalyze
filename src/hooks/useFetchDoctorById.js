import { useQuery } from '@tanstack/react-query'
import { supabase } from '../api/supabaseClient'

// Function to fetch doctor data by userId
async function fetchDoctorById(userId) {
  if (!userId) return null

  // Fetch doctor with related profile
  const { data, error } = await supabase
    .from('doctors')
    .select('*, profiles!inner(*)')
    .eq('profiles.user_id', userId)
    .maybeSingle()

  if (error) throw error

  return data
}

// Hook to fetch doctor data
export function useFetchDoctorById(userId) {
  return useQuery({
    queryKey: ['doctor', userId],
    queryFn: () => fetchDoctorById(userId),
    enabled: !!userId,
  })
}
