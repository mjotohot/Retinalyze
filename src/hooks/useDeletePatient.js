import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePatient } from '../services/deletePatient'

/**
 * Custom hook for deleting a patient
 * @returns {Object} Mutation object with mutate, isLoading, etc.
 */
export const useDeletePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patientId) => deletePatient(patientId),
    onMutate: async (patientId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['patients'] })

      // Snapshot the previous value
      const previousPatients = queryClient.getQueryData(['patients'])

      // Optimistically update to remove the patient from cache
      queryClient.setQueriesData({ queryKey: ['patients'] }, (old) => {
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
        queryClient.setQueryData(['patients'], context.previousPatients)
      }
      console.error('Delete patient error:', error)
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}