import { useQuery } from '@tanstack/react-query'
import { supabase } from '../api/supabaseClient'

export const useFetchPatientById = (userId) => {
  return useQuery({
    queryKey: ['patient', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select(
          `
          *,
          profile:profiles(*),
          doctor:doctors(
            id,
            profile:profiles(*)
          )
        `
        )
        .eq('user_id', userId)
        .maybeSingle()

      console.log('Fetched patient data:', data)

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}
