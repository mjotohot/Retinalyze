import { supabase } from '../api/supabaseClient'

// Define page size
const PAGE_SIZE = 10

// Function to fetch all doctors data
export async function fetchAllDoctors({ pageParam = 0 }) {
  const from = pageParam * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error } = await supabase
    .from('doctors')
    .select('*, profiles!inner(*)', { count: 'exact' })
    .range(from, to)

  if (error) throw error

  // return shape: data array and whether there's next page
  return {
    data,
    nextPage: data.length === PAGE_SIZE ? pageParam + 1 : null,
    page: pageParam,
  }
}

// Function to update doctor and profile data
export async function updateDoctorData({
  userId,
  profileFields,
  doctorFields,
}) {
  // Update profiles table
  const { data: profData, error: profError } = await supabase
    .from('profiles')
    .update(profileFields)
    .eq('user_id', userId)
    .select()
    .single()

  if (profError) throw profError
  if (!profData) throw new Error('No profile found for this user')

  // Update doctors table using profile.id
  const { data: docData, error: docErr } = await supabase
    .from('doctors')
    .update(doctorFields)
    .eq('user_id', profData.id)
    .select()
    .single()

  if (docErr) throw docErr
  if (!docData) throw new Error(`No doctor record found for user_id: ${userId}`)

  // Return updated data
  return { profData, docData }
}

// Function to fetch doctor data by userId
export async function fetchDoctorById(userId) {
  if (!userId) return null

  // Fetch doctor with related profile
  const { data, error } = await supabase
    .from('doctors')
    .select('*, profiles!inner(*)')
    .eq('profiles.user_id', userId)
    .maybeSingle()

  if (error) throw error

  return data
}

// Function to search doctor data
export async function searchDoctor(query) {
  const { data, error } = await supabase
    .from('doctors')
    .select('*, profiles!inner(*)')
    .ilike('profiles.full_name', `%${query}%`)

  if (error) throw error
  return data
}
