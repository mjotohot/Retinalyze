import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePatient } from '../services/deletePatient'
import { toast } from 'react-hot-toast'

/**
 * Custom hook for deleting a patient
 * @returns {Object} Mutation object with mutate, isLoading, etc.
 */
export const useDeletePatient = ({ queryKey }) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patientId) => deletePatient(patientId),
    onMutate: async (patientId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey })

      // Snapshot the previous value
      const previousPatients = queryClient.getQueryData(queryKey)

      // Optimistically update to remove the patient from cache
      queryClient.setQueriesData({ queryKey }, (old) => {
        if (!old?.pages) return old

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((patient) => patient.id !== patientId),
          })),
        }
      })

      // Return context object with the snapshotted value
      return { previousPatients }
    },
    onSuccess: (response) => {
      if (response.error) {
        toast.error('Failed to delete patient')
        return
      }

      toast.success('Patient deleted successfully')
    },
    onError: (error, patientId, context) => {
      // Rollback to the previous value on error
      if (context?.previousPatients) {
        queryClient.setQueryData(queryKey, context.previousPatients)
      }
      console.error('Delete patient error:', error)
    },
    onSettled: () => {
      // Invalidate infinite patient lists
      queryClient.invalidateQueries({
        queryKey,
        exact: false,
      })

      // Invalidate all search results
      queryClient.invalidateQueries({
        queryKey: ['search'],
        exact: false,
      })

      // ✅ Invalidate the dashboard counts so DashCard refetches
      queryClient.invalidateQueries({
        queryKey: ['dashboardCounts'],
        exact: false,
      })
    },
  })
}
