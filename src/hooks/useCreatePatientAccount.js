import { useMutation } from '@tanstack/react-query'
import { createPatientAccount } from '../services/createPatientAccount'
import { useAuthStore } from '../stores/useAuthStore'

// Hook that uses React Query's useMutation to handle patient account creation
export const useCreatePatientAccount = (options = {}) => {
  const profile = useAuthStore((state) => state.profile)
  const account_id = useAuthStore((state) => state.account_id)
  console.log("profile", profile)
  console.log("account_id", account_id)

  return useMutation({
    mutationFn: async ({ email, patientData }) => {
      if (!profile?.id) {
        throw new Error('Doctor profile not loaded. Please try again.')
      }

      const payload = {
        email,
        patientData: {
          ...patientData,
          doctor_id: account_id.id,
          age: Number(patientData.age),
          bp_systolic: Number(patientData.bp_systolic),
          bp_diastolic: Number(patientData.bp_diastolic),
          diabetic: patientData.diabetic === 'yes',
          hypertension: patientData.hypertension === 'yes',
          smoking: patientData.smoking === 'yes',
          stroke_history: patientData.stroke_history === 'yes',
        },
      }

      return await createPatientAccount(payload)
    },

    onSuccess: (data) => {
      console.log('Patient account created successfully:', data)
      options?.onSuccess?.(data)
    },

    onError: (error) => {
      console.error('Error creating patient account:', error)
      options?.onError?.(error)
    },
  })
}
