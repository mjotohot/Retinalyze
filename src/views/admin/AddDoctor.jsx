import { useState, useRef, useEffect } from 'react'
import Sidebar from '../../components/navigations/Sidebar'
import { useCreateDoctorAccount } from '../../hooks/useCreateDoctorAccount'
import InputField from '../../components/commons/InputField'
import { addDoctorInputs } from '../../lib/addDoctorInputs'
import { useLoadingStore } from '../../stores/useLoadingStore'
import Modal from '../../components/commons/Modal'
import { IoPersonAdd } from 'react-icons/io5'

const AddDoctor = () => {
  // Ref for the modal
  const modalRef = useRef(null)

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    address: '',
    age: '',
    sex: '',
    phone_number: '',
    specialization: '',
    license_number: '',
    clinic_name: '',
    professional_title: '',
    years_experience: '',
  })

  // Modal state
  const [modalData, setModalData] = useState({
    isOpen: false,
    type: '',
    message: '',
  })

  useEffect(() => {
    if (modalData.isOpen) {
      modalRef.current?.showModal()
    }
  }, [modalData.isOpen])

  const { showLoading, hideLoading } = useLoadingStore()

  // Initialize mutation hook
  const { mutateAsync: createDoctor, isPending } = useCreateDoctorAccount({
    onSuccess: (data) => {
      // reset form
      setFormData({
        email: '',
        password: '',
        full_name: '',
        address: '',
        age: '',
        sex: '',
        phone_number: '',
        specialization: '',
        license_number: '',
        clinic_name: '',
        professional_title: '',
        years_experience: '',
      })
      setModalData({
        isOpen: true,
        type: 'success',
        message: data?.message || 'Doctor account created successfully.',
      })
      modalRef.current?.showModal()
    },
    onError: (error) => {
      setModalData({
        isOpen: true,
        type: 'error',
        message: error.message || 'Account creation failed.',
      })
      modalRef.current?.showModal()
    },
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      showLoading('Creating doctor...')

      const { email, password, ...doctorData } = formData
      await createDoctor({ email, password, doctorData })
    } catch (error) {
      console.error('Form submission error:', error)
      // Error will be handled by onError callback
    } finally {
      hideLoading() // always hide loader even if error occurs
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
                <div className="mt-10 flex justify-center">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn rounded-md border-none btn-neutral"
                  >
                    <IoPersonAdd size={15} />
                    <span>Create Account</span>
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
            modalRef.current?.close()
            setModalData({ ...modalData, isOpen: false })
          }}
        />
      )}
    </div>
  )
}

export default AddDoctor
