import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDoctorData } from '../services/fetchDoctor'
import { useAuthStore } from '../stores/useAuthStore'

// Hook to edit doctor data
export function useUpdateDoctorData(authUserId) {
  const queryClient = useQueryClient()
  const setProfile = useAuthStore((state) => state.setProfile)

  return useMutation({
    // Call supabase update function
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
