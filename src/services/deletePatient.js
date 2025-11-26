import { supabase } from "../api/supabaseClient"

/**
 * Delete a patient record
 * @param {string} patientId - The ID of the patient to delete
 * @returns {Promise<Object>} The deleted patient data or error
 */
export const deletePatient = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .delete()
      .eq('id', patientId)
      .select()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error deleting patient:', error)
    return { data: null, error }
  }
}