import { useState } from 'react'
import { supabase } from '../../api/supabaseClient'
import { Link } from 'react-router'

const ForgotPassword = () => {
  const [email, setEmail] = useState('') // State for email input
  const [message, setMessage] = useState('') // State for success message
  const [error, setError] = useState('') // State for error message
  const [loading, setLoading] = useState(false) // State for loading indicator

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)
    // Request password reset via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // environment variable for base URL
      redirectTo: `${import.meta.env.VITE_APP_BASE_URL}/auth/reset-password`,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Password reset link sent! Please check your email.')
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {/* forgot password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer tracking-tight bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Login link */}
        <Link to="/login">
          <div className="mt-5 border-t pt-4 border-gray-300">
            <button className="w-full tracking-tight cursor-pointer bg-gray-700 text-white rounded-md py-2 hover:bg-gray-600 disabled:opacity-50">
              Back to login
            </button>
          </div>
        </Link>

        {message && <p className="text-green-600 text-sm mt-4">{message}</p>}
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </div>
    </div>
  )
}

export default ForgotPassword
