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
  account_id: null,
  roleData: null,
  isLoading: true,

  // Setter for profile so components/hooks can update the store
  setProfile: (profileData) => set({ profile: profileData }),

  // Fetch role-specific data
  fetchRoleData: async () => {
    const { profile, userRole } = get()
    if (!profile || !userRole) return null

    try {
      let tableName = ''
      
      // Map role to table name
      switch (userRole) {
        case 'doctor':
          tableName = 'doctors'
          break
        case 'patient':
          tableName = 'patients'
          break
        case 'super_admin':
          tableName = 'super_admins'
          break
        default:
          console.warn(`No table mapping for role: ${userRole}`)
          return null
      }

      // Fetch data from the role-specific table using profile.user_id
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', profile.id)
        .single()
      
      if (error) throw error
      
      // Update the store with role-specific data
      set({ account_id: data })
      return data
    } catch (error) {
      console.error('Error fetching role data:', error)
      set({ account_id: null })
      return null
    }
  },

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

        // Fetch role-specific data after setting the role
        await get().fetchRoleData()
      } else {
        // No user logged in
        set({ user: null, userRole: null, profile: null, account_id: null, isLoading: false })
      }
    } catch (error) {
      console.error('Initialize error:', error)
      set({ user: null, userRole: null, profile: null, account_id: null, isLoading: false })
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

    // Fetch role-specific data after login
    await get().fetchRoleData()
    
    return data
  },

  // logout method
  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    // Clear the store on logout
    set({ user: null, userRole: null, profile: null, account_id: null })
  },

  // Helper functions for role checking
  isSuperAdmin: () => get().userRole === 'super_admin',
  isDoctor: () => get().userRole === 'doctor',
  isPatient: () => get().userRole === 'patient',
}))