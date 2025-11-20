import { supabase } from '../api/supabaseClient'

// Define page size
const PAGE_SIZE = 10

// Fetch patients with related doctor and profile data
export async function fetchAllPatient({ pageParam = 0, riskLevel }) {
  const from = pageParam * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('patients')
    .select(
      ` 
        *,
        doctor:doctor_id (
          id,
          profile:profiles (
            full_name
          )
        ),
        profile:profiles (
          full_name,
          age,
          sex,
          address,
          phone_number
        )
      `,
      { count: 'exact' }
    )
    .range(from, to)

  // Apply risk level filter if provided
  if (riskLevel) {
    query = query.eq('risk_level', riskLevel)
  }

  // Execute the query
  const { data, error } = await query
  if (error) throw error
  return {
    data,
    nextPage: data.length === PAGE_SIZE ? pageParam + 1 : null,
    page: pageParam,
  }
}

// Fetch patients assigned to a specific doctor with optional risk level filter
export async function fetchPatientsByDoctor({
  pageParam = 0,
  doctorId,
  riskLevel,
}) {
  const from = pageParam * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('patients')
    .select(
      `
      *,
      profile:profiles (
        full_name,
        age,
        sex,
        address,
        phone_number,
        updated_at
      )
    `
    )
    .eq('doctor_id', doctorId)
    .range(from, to)

  // Apply risk level filter if provided
  if (riskLevel) {
    query = query.eq('risk_level', riskLevel)
  }

  // Execute the query
  const { data, error } = await query

  if (error) throw new Error(error.message)

  return {
    data,
    nextPage: data.length === PAGE_SIZE ? pageParam + 1 : null,
    hasMore: data.length === PAGE_SIZE,
  }
}

// Function to search patient
export async function searchPatient(query, doctorId) {
  const { data, error } = await supabase
    .from('patients')
    .select('*, profile:profiles!inner(*)')
    .ilike('profiles.full_name', `%${query}%`)
    .eq('doctor_id', doctorId)

  if (error) throw error
  return data
}

// Function to fetch patient counts by risk levels and time frame
export async function fetchPatientCounts(doctorId) {
  const base = supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('doctor_id', doctorId)

  const total = await base
  const monitored = await base.eq('risk_level', 'Moderate')
  const highRisk = await base.eq('risk_level', 'High')
  const thisWeek = await base.gte(
    // need fixing
    'created_at',
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  )

  return {
    total: total.count,
    monitored: monitored.count,
    highRisk: highRisk.count,
    thisWeek: thisWeek.count,
  }
}

// Function to save doctor's recommendation for a patient
export async function savePatientRecommendation(patientId, recommendation) {
  const { data, error } = await supabase
    .from('patients')
    .update({ recommendation })
    .eq('id', patientId)
    .select()

  if (error) throw error
  return data
}
