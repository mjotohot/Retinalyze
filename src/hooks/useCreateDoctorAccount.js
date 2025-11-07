import { supabase } from '../api/supabaseClient'
import { useMutation } from '@tanstack/react-query'

// Custom hook to create a doctor account
const createDoctorAccount = async (payload) => {
  const data = await supabase.functions.invoke('addDoctorAccount', {
    body: JSON.stringify(payload),
  })

  return data
}

// Hook that uses React Query's useMutation to handle doctor account creation
export const useCreateDoctorAccount = () => {
  return useMutation({
    mutationFn: ({ email, password, doctorData }) => {
      createDoctorAccount({ email, password, doctorData })
    },
    onError: (error) => {
      console.error('Error creating doctor account:', error)
    },
    onSuccess: (data) => {
      console.log('Doctor account created successfully:', data)
    },
  })
}
