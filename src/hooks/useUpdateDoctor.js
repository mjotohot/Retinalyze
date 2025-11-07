import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../api/supabaseClient'
import { useAuthStore } from '../stores/useAuthStore'

// Function to update doctor and profile data
async function updateDoctorData({ userId, profileFields, doctorFields }) {
  // Update profiles table
  const { data: profData, error: profError } = await supabase
    .from('profiles')
    .update(profileFields)
    .eq('user_id', userId)
    .select()
    .single()

  if (profError) throw profError
  if (!profData) throw new Error('No profile found for this user')

  // Update doctors table using profile.id
  const { data: docData, error: docErr } = await supabase
    .from('doctors')
    .update(doctorFields)
    .eq('user_id', profData.id)
    .select()
    .single()

  if (docErr) throw docErr
  if (!docData) throw new Error(`No doctor record found for user_id: ${userId}`)

  // Return updated data
  return { profData, docData }
}

// Hook to edit doctor data
export function useUpdateDoctorData(authUserId) {
  const queryClient = useQueryClient()
  const setProfile = useAuthStore((state) => state.setProfile)

  return useMutation({
    // Call our Supabase update function
    mutationFn: ({ profileFields, doctorFields }) =>
      updateDoctorData({ userId: authUserId, profileFields, doctorFields }),

    // When successful → refetch the fresh data
    onSuccess: (result) => {
      const { profData, docData } = result || {}

      // Force refresh the stale cached queries
      queryClient.invalidateQueries({ queryKey: ['doctor', authUserId] })
      queryClient.invalidateQueries({ queryKey: ['profile', authUserId] })

      // Immediately update zustand so UI shows new values
      if (profData) setProfile(profData)

      // Patch react-query cache directly to avoid waiting for refetch
      if (profData) queryClient.setQueryData(['profile', authUserId], profData)
      if (docData) queryClient.setQueryData(['doctor', authUserId], docData)
    },

    onError: (error) => {
      console.error('Error updating doctor profile:', error)
      // perhaps show toast or UI feedback
    },
  })
}
