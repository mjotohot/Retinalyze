import { supabase } from '../api/supabaseClient'

//
export const createPatientAccount = async (payload) => {
  const { data, error } = await supabase.functions.invoke('addPatientAccount', {
    body: JSON.stringify(payload),
  })

  if (error) throw error

  return data
}
