import { useAuthStore } from '../../stores/useAuthStore'
import { redirectByRole } from '../../utils/redirectByRole'
import InputField from '../../components/commons/InputField'
import Modal from '../../components/commons/Modal'
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { loginInputs } from '../../lib/loginInputs'

const Login = () => {
  const login = useAuthStore((state) => state.login) // get the login method from the store
  const modalRef = useRef(null) // Ref for the modal
  const navigate = useNavigate() // For navigation after login
  const [showPassword, setShowPassword] = useState(false) // State to toggle password visibility
  const [loading, setLoading] = useState(false) // Loading state for the form submission
  const [modalData, setModalData] = useState({
    // State for modal content
    isOpen: false,
    type: '',
    message: '',
  })
  const [formData, setFormData] = useState({
    // State for form inputs
    email: '',
    password: '',
  })

  // Effect to open modal when modalData.isOpen changes
  useEffect(() => {
    if (modalData.isOpen) {
      modalRef.current?.showModal()
    }
  }, [modalData.isOpen])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission
    setLoading(true)
    const { email, password } = formData // Destructure email and password from formData
    try {
      await login(email, password) // Call the login method from the store
      redirectByRole(navigate) // On successful login, redirect based on user role
    } catch (error) {
      // Handle login errors
      setModalData({
        isOpen: true,
        type: 'error',
        message: error.message || 'Login failed.',
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target // Destructure id and value from the event target
    setFormData({ ...formData, [id]: value }) // Update the corresponding field in formData
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Welcome!</h2>
        <p className="text-gray-600">Sign in your personal account</p>
      </div>

      {/* Login form  */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {loginInputs.map((field) => (
          <InputField
            key={field.id}
            {...field}
            type={
              field.id === 'password'
                ? showPassword
                  ? 'text'
                  : 'password'
                : field.type
            }
            value={formData[field.id]}
            onChange={handleChange}
          />
        ))}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showPassword"
            className="h-4 w-4 text-blue-500 border-gray-300 rounded"
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          <label htmlFor="showPassword" className="text-sm">
            Show password
          </label>
        </div>
        <button
          type="submit"
          className="btn bg-blue-500 hover:bg-blue-400 text-white border-none rounded-md w-full"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {/* Forgot password link */}
      <div className="mt-5 flex justify-center text-sm">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot password?
        </Link>
      </div>

      {/* Modal for displaying error messages */}
      {modalData.isOpen && (
        <Modal
          ref={modalRef}
          title={modalData.type === 'success' ? 'Success' : 'Error'}
          message={modalData.message}
          confirmLabel="OK"
          color={
            modalData.type === 'success'
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-red-500 hover:bg-red-600'
          }
          onConfirm={() => {
            setModalData({ ...modalData, isOpen: false })
          }}
        />
      )}
    </div>
  )
}

export default Login
