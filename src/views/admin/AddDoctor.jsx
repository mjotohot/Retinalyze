import { useState, useRef, useEffect } from 'react'
import Sidebar from '../../components/navigations/Sidebar'
import { createDoctorAccount } from '../../services/createDoctorAccount'
import InputField from '../../components/commons/InputField'
import { addDoctorInputs } from '../../lib/addDoctorInputs'
import Modal from '../../components/commons/Modal'

// Component for adding a new doctor account
const AddDoctor = () => {
  // Ref for the modal
  const modalRef = useRef(null)

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    address: '',
    phone_number: '',
    specialization: '',
    license_number: '',
    clinic_name: '',
    professional_title: '',
    years_experience: '',
  })

  // Modal state
  const [modalData, setModalData] = useState({
    // State for modal content
    isOpen: false,
    type: '',
    message: '',
  })

  // Loading and message state
  const [loading, setLoading] = useState(false)

  // Effect to open modal when modalData.isOpen changes
  useEffect(() => {
    if (modalData.isOpen) {
      modalRef.current?.showModal()
    }
  }, [modalData.isOpen])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Destructure email and password from formData
      const { email, password, ...doctorData } = formData
      // Call service to create doctor account
      const response = await createDoctorAccount(email, password, doctorData)
      // Show success modal
      setModalData({
        isOpen: true,
        type: 'success',
        message: response?.message || 'Doctor account created successfully.',
      })
      // Reset form data
      setFormData({
        email: '',
        password: '',
        full_name: '',
        address: '',
        phone_number: '',
        specialization: '',
        license_number: '',
        clinic_name: '',
        professional_title: '',
        years_experience: '',
      })
    } catch (error) {
      console.error(error)
      setModalData({
        isOpen: true,
        type: 'error',
        message: error.message || 'Account creation failed.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add Doctor Account
              </h1>
              <p className="text-gray-600 mt-1">
                Create a new doctor account and assign details
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Info Panel */}
            <div className="bg-white rounded-md shadow-md p-6">
              <h2 className="text-lg font-semibold mb-3">Doctor Overview</h2>
              <p className="text-sm text-gray-600 mb-4">
                Fill out the required information on the right to create a new
                doctor account. You can update details later as needed.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Email and password create the login credentials.</li>
                <li>• Profile details are saved in the database.</li>
                <li>• The doctor's specialization links to their profile.</li>
              </ul>
            </div>

            {/* Right Form Panel */}
            <div className="lg:col-span-2 bg-white rounded-md shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addDoctorInputs.map((field) => (
                    <InputField
                      key={field.id}
                      {...field}
                      value={formData[field.id]}
                      onChange={handleChange}
                    />
                  ))}
                </div>

                {/* Submit */}
                <div className="mt-5 flex justify-center">
                  <button
                    type="submit"
                    className="btn rounded-md border-none btn-neutral"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Modal for displaying message */}
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

export default AddDoctor
