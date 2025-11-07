import { redirectByRole } from '../utils/redirectByRole'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../stores/useAuthStore'
import { useEffect, useState } from 'react'

const HomeRedirect = () => {
  const { user, isLoading } = useAuthStore() // Access user and loading state from the auth store
  const navigate = useNavigate() // Hook for programmatic navigation
  const [loadingMessage, setLoadingMessage] = useState(
    // Initial loading message
    'Checking your session...'
  )

  // Update loading message dynamically
  useEffect(() => {
    if (isLoading) {
      setLoadingMessage('Checking your session...')
    } else if (!user) {
      setLoadingMessage('Redirecting to login...')
    } else if (user) {
      setLoadingMessage('Redirecting to your dashboard...')
    }
  }, [isLoading, user])

  // Redirects *after* render
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login')
      } else {
        redirectByRole(navigate)
      }
    }
  }, [isLoading, user, navigate])

  // Show loading spinner and message while checking authentication status
  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">{loadingMessage}</p>
        </div>
      </div>
    )

  // Render nothing while redirecting
  return null
}

export default HomeRedirect
