import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteDoctor } from '../services/deleteDoctor'
import { toast } from 'react-hot-toast'

export const useDeleteDoctor = ({ queryKey = ['all-doctors'] }) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (doctorId) => deleteDoctor(doctorId),
    onMutate: async (doctorId) => {
      await queryClient.cancelQueries({ queryKey })
      const previousDoctors = queryClient.getQueryData(queryKey)

      // Optimistic update
      queryClient.setQueryData(queryKey, (old) => {
        if (!old?.pages) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((doc) => doc.id !== doctorId),
          })),
        }
      })

      return { previousDoctors }
    },
    onSuccess: (response) => {
      if (response.error) {
        toast.error(`Failed to delete doctor: ${response.error}`)
        return
      }
      toast.success('Doctor deleted successfully')
    },

    onError: (error, doctorId, context) => {
      if (context?.previousDoctors) {
        queryClient.setQueryData(queryKey, context.previousDoctors)
      }
      toast.error('Failed to delete doctor')
      console.error('Delete doctor error:', error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey, exact: false })
      queryClient.invalidateQueries({ queryKey: ['search'], exact: false })
    },
  })
}
