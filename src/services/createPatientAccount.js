import { supabase } from '../api/supabaseClient'

// Create a new patient account and link to a doctor
export const createPatientAccount = async (
  email,
  password,
  patientData,
  doctorId
) => {
  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) throw error

  // Insert into profiles and patients tables
  await supabase.from('profiles').insert({
    user_id: data.user.id,
    role: 'patient',
    full_name: patientData.full_name,
  })

  // Insert into patients table
  await supabase.from('patients').insert({
    user_id: data.user.id,
    doctor_id: doctorId,
    // ... other fields
  })

  return data
}
