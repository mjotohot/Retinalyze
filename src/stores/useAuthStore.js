import { create } from 'zustand'
import { supabase } from '../api/supabaseClient'

// Listen to auth state changes and update the store accordingly
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({ user: session?.user ?? null })
})

export const useAuthStore = create((set, get) => ({
  user: null,
  userRole: null,
  profile: null,
  isLoading: true,

  // Setter for profile so components/hooks can update the store
  setProfile: (profileData) => set({ profile: profileData }),

  // Initialize method to fetch user and role
  initialize: async () => {
    set({ isLoading: true })
    try {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        // Fetch the user's role and profile from the profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*, role')
          .eq('user_id', data.user.id)
          .single()
        // Update the store with user and role
        set({
          user: data.user,
          userRole: profileData?.role,
          profile: profileData,
          isLoading: false,
        })
      } else {
        // No user logged in
        set({ user: null, userRole: null, profile: null, isLoading: false })
      }
    } catch (error) {
      console.error('Initialize error:', error)
      set({ user: null, userRole: null, profile: null, isLoading: false })
    }
  },

  // login method with role fetching
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    // Fetch role after login
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*, role')
      .eq('user_id', data.user.id)
      .single()
    // Update the store with user and role
    set({
      user: data.user,
      userRole: profileData?.role,
      profile: profileData,
    })
    return data
  },

  // logout method
  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    // Clear the store on logout
    set({ user: null, userRole: null, profile: null })
  },

  // Helper functions for role checking
  isSuperAdmin: () => get().userRole === 'super_admin',
  isDoctor: () => get().userRole === 'doctor',
  isPatient: () => get().userRole === 'patient',
}))
