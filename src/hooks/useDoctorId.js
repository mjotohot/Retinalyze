import { useQuery } from '@tanstack/react-query'
import { supabase } from '../api/supabaseClient'

export function useDoctorId(profileId) {
  return useQuery({
    queryKey: ['doctorId', profileId],
    queryFn: async () => {
      if (!profileId) return null

      const { data, error } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', profileId)
        .maybeSingle()

      if (error) throw error
      return data?.id ?? null
    },
    enabled: !!profileId,
  })
}
