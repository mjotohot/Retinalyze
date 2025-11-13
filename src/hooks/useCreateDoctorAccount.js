import { createDoctorAccount } from '../services/createDoctorAccount'
import { useMutation } from '@tanstack/react-query'

// Hook that uses React Query's useMutation to handle doctor account creation
export const useCreateDoctorAccount = (options = {}) => {
  return useMutation({
    mutationFn: ({ email, password, doctorData }) =>
      createDoctorAccount({ email, password, doctorData }),

    onSuccess: (data) => {
      console.log('Doctor account created successfully:', data)
      options?.onSuccess?.(data)
    },

    onError: (error) => {
      console.error('Error creating doctor account:', error)
      options?.onError?.(error)
    },
  })
}
