import Sidebar from '../../components/navigations/Sidebar'
import { FaUpload } from 'react-icons/fa'
import { FaUserInjured } from 'react-icons/fa'
import { LuScanEye } from 'react-icons/lu'
import { useState } from 'react'
import InputField from '../../components/commons/InputField'
import { addPatientInputs } from '../../lib/addPatientInputs'

const AddPatient = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    sex: '',
    isDiabetic: '',
    familyDiabetic: '',
    familyStroke: '',
    lifestyleFactors: '',
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
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
                <button className="btn btn-neutral rounded-md">
                  Add Patient & Analyze
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AddPatient
