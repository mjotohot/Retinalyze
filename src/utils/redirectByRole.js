import { useAuthStore } from '../stores/useAuthStore'

// Redirect users based on their roles
export const redirectByRole = (navigate) => {
  // Get role-checking functions from the auth store
  const { isSuperAdmin, isDoctor, isPatient } = useAuthStore.getState()

  // Redirect based on role
  if (isSuperAdmin()) {
    navigate('/admin/dashboard')
  } else if (isDoctor()) {
    navigate('/dashboard')
  } else if (isPatient()) {
    navigate('/user')
  } else {
    navigate('/')
  }
}
