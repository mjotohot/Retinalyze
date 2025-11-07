import { useAuthStore } from '../../stores/useAuthStore'
import { useState, useEffect } from 'react'
import { supabase } from '../../api/supabaseClient'
import { useNavigate } from 'react-router'

const ResetPassword = () => {
  const { user } = useAuthStore() // Access the authenticated user from the store
  const navigate = useNavigate() // Hook for navigation
  const [newPassword, setNewPassword] = useState('') //  State for new password
  const [confirmPassword, setConfirmPassword] = useState('') // State for confirm password
  const [message, setMessage] = useState('') // State for success message
  const [error, setError] = useState('') // State for error message
  const [loading, setLoading] = useState(false) // State for loading indicator

  // On component mount, check for access_token in URL and set session
  useEffect(() => {
    // Parse URL to get access_token
    const url = new URL(window.location.href)
    const accessToken = url.searchParams.get('access_token')
    // If access_token exists, set the Supabase session
    if (accessToken) {
      supabase.auth.setSession({ access_token: accessToken }).catch((err) => {
        console.error('Failed to set session from token:', err)
      })
    }
  }, [])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    // Ensure user is authenticated
    if (!user) {
      setError(
        'Your session has expired or is invalid. Please request a new password reset.'
      )
      return
    }
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    // Update password using Supabase
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Password updated successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your new password below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset disabled={loading || !user} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </fieldset>
        </form>
        {message && <p className="text-green-600 text-sm mt-4">{message}</p>}
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </div>
    </div>
  )
}

export default ResetPassword
