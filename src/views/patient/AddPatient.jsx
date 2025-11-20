import Sidebar from '../../components/navigations/Sidebar'
import { FaUpload } from 'react-icons/fa'
import { FaUserInjured } from 'react-icons/fa'
import { LuScanEye } from 'react-icons/lu'
import { useState, useRef, useEffect } from 'react'
import InputField from '../../components/commons/InputField'
import Modal from '../../components/commons/Modal'
import { addPatientInputs } from '../../lib/addPatientInputs'
import { useCreatePatientAccount } from '../../hooks/useCreatePatientAccount'
import { useRetinalImagePrediction } from '../../hooks/useRetinalImagePrediction'

const AddPatient = () => {
  // Ref for the modal
  const modalRef = useRef(null)

  // State for form data
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

  // State for retinal image
  const [retinalImage, setRetinalImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // Modal state
  const [modalData, setModalData] = useState({
    isOpen: false,
    type: '',
    message: '',
  })

  // Effect to open modal when modalData.isOpen changes
  useEffect(() => {
    if (modalData.isOpen) {
      modalRef.current?.showModal()
    }
  }, [modalData.isOpen])

  // Initialize retinal image prediction hook
  const { mutateAsync: predictImage, isPending: isImagePredicting } =
    useRetinalImagePrediction({
      onSuccess: (data) => {
        console.log('Retinal image prediction result:', data)
      },
      onError: (error) => {
        console.error('Image prediction error:', error)
      },
    })

  // Initialize patient account creation hook
  const { mutateAsync: createPatient, isPending: isCreatingPatient } =
    useCreatePatientAccount({
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
        setRetinalImage(null)
        setImagePreview(null)
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setRetinalImage(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let imagePredictionResult = null
      // Step 1: Predict retinal image if uploaded
      if (retinalImage) {
        imagePredictionResult = await predictImage(retinalImage)
        console.log('Image prediction completed:', imagePredictionResult)
        console.log(
          'Image prediction label:',
          imagePredictionResult?.[0]?.label
        )
      } else {
        console.log('No retinal image uploaded, skipping image prediction')
      }
      // Step 2: Create patient account (this will run health prediction, upload image, and combine predictions)
      const { email, ...patientData } = formData
      await createPatient({
        email,
        patientData,
        imagePrediction: imagePredictionResult, // Pass image prediction to be combined
        retinalImageFile: retinalImage, // Pass the image file to be uploaded
      })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  // Determine if any async operation is pending
  const isPending = isImagePredicting || isCreatingPatient

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

                  {/* Image Preview */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors relative">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Retinal scan preview"
                          className="max-w-md rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setRetinalImage(null)
                            setImagePreview(null)
                          }}
                          className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm font-medium text-gray-900">
                          Upload retinal image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 10MB
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          className="file-input file-input-bordered mt-4 w-full max-w-xs"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
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
                        <span>
                          {isImagePredicting
                            ? 'Analyzing Image...'
                            : 'Creating...'}
                        </span>
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
