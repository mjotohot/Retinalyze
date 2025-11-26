import { supabase } from '../api/supabaseClient'

export const deleteDoctor = async (doctorId) => {
  const { data, error } = await supabase.functions.invoke('deleteFunction', {
    body: JSON.stringify({
      doctorId,
    }),
  })

  if (error) throw error

  return data
}
