import { supabase } from '../api/supabaseClient'

//
export const createDoctorAccount = async (payload) => {
  const { data, error } = await supabase.functions.invoke('addDoctorAccount', {
    body: JSON.stringify(payload),
  })

  if (error) throw error

  return data
}
