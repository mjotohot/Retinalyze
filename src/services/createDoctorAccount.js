import { supabase } from '../api/supabaseClient'

// Function to create a new doctor account via Supabase Edge Function
export const createDoctorAccount = async (email, password, doctorData) => {
  const { data, error } = await supabase.functions.invoke('addDoctorAccount', {
    // Use POST method to send data securely
    body: JSON.stringify({
      email,
      password,
      doctorData,
    }),
  })

  // Handle any errors that occur during the function invocation
  if (error) throw error

  return data
}
