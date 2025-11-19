import { useAuthStore } from '../../stores/useAuthStore'
import { redirectByRole } from '../../utils/redirectByRole'
import InputField from '../../components/commons/InputField'
import Modal from '../../components/commons/Modal'
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { loginInputs } from '../../lib/loginInputs'

const Login = () => {
  const login = useAuthStore((state) => state.login)
  const modalRef = useRef(null)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modalData, setModalData] = useState({
    isOpen: false,
    type: '',
    message: '',
  })
  const [formData, setFormData] = useState({
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
    e.preventDefault()
    setLoading(true)
    const { email, password } = formData
    try {
      await login(email, password)
      redirectByRole(navigate)
    } catch (error) {
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
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
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
          className="btn rounded-md border-none btn-info text-white w-full"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
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
