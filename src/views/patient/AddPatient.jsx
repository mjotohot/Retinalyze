import Sidebar from '../../components/navigations/Sidebar'
import { FaUpload } from 'react-icons/fa'
import { FaUserInjured } from 'react-icons/fa'
import { LuScanEye } from 'react-icons/lu'
import { useState, useRef, useEffect } from 'react'
import InputField from '../../components/commons/InputField'
import Modal from '../../components/commons/Modal'
import { addPatientInputs } from '../../lib/addPatientInputs'
import { useCreatePatientAccount } from '../../hooks/useCreatePatientAccount'

const AddPatient = () => {
  // Ref for the modal
  const modalRef = useRef(null)

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    age: '',
    sex: '',
    phone_number: '',
    address: '',
    diabetic: '',
    smoking: '',
    hypertension: '',
    stroke_history: '',
    bp_systolic: '',
    bp_diastolic: '',
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

  // Initialize mutation hook
  const { mutateAsync: createPatient, isPending } = useCreatePatientAccount({
    onSuccess: (data) => {
      // reset form
      setFormData({
        email: '',
        full_name: '',
        age: '',
        sex: '',
        phone_number: '',
        address: '',
        diabetic: '',
        smoking: '',
        hypertension: '',
        stroke_history: '',
        bp_systolic: '',
        bp_diastolic: '',
      })
      setModalData({
        isOpen: true,
        type: 'success',
        message: data?.message || 'Patient account created successfully.',
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { email, ...patientData } = formData
      await createPatient({ email, patientData })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-3 pt-20 lg:p-6 lg:pt-6 lg:ml-64">
        <div className="flex flex-col mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold">
            Add Patient
            <span className="block font-normal text-sm sm:text-base text-gray-600">
              Easily register new patients and begin tracking their care
              journey.
            </span>
          </h1>
          <div className="mt-6 space-y-6">
            <div className="card bg-white shadow-md rounded-md p-3">
              <form onSubmit={handleSubmit}>
                {/* Patient Information Section */}
                <div className="card-body space-y-4">
                  <div className="flex gap-3">
                    <FaUserInjured size={20} className="mt-1" />
                    <h2 className="font-bold flex flex-col text-xl">
                      Patient Information
                      <span className="text-sm text-gray-500 font-normal">
                        Basic patient details and medical history
                      </span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    {addPatientInputs.map((field) => (
                      <InputField
                        key={field.id}
                        {...field}
                        value={formData[field.id]}
                        onChange={handleChange}
                      />
                    ))}
                  </div>
                </div>

                {/* Retinal Image Upload Section */}
                <div className="card-body">
                  <div className="flex gap-3">
                    <LuScanEye className="mt-1" size={22} />
                    <h2 className="font-bold flex flex-col text-xl mb-5">
                      Retinal Image
                      <span className="text-sm text-gray-500 font-normal">
                        Upload the patient's retinal scan for analysis
                      </span>
                    </h2>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm font-medium text-gray-900">
                      Upload retinal image
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered mt-4 w-full max-w-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-5 mb-5">
                  <button
                    type="submit"
                    className="btn btn-neutral rounded-md"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span>Add Patient & Analyze</span>
                      </>
                    )}
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

export default AddPatient
