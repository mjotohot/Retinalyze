import { useAuthStore } from '../../../stores/useAuthStore'
import { useFetchPatientById } from '../../../hooks/useFetchPatientById'
import { timeStampFormatter } from '../../../utils/timeStampFormatter'
import Sidebar from '../../../components/navigations/Sidebar'
import InputField from '../../../components/commons/InputField'
import maleAvatar from '../../../assets/images/male.jpg'
import femaleAvatar from '../../../assets/images/female.jpg'

const PatientPage = () => {
  const profile = useAuthStore((state) => state.profile)
  const { data: patient, isLoading, error } = useFetchPatientById(profile?.id)

  if (isLoading)
    return <p className="text-center py-6">Loading patient data...</p>
  if (error)
    return <p className="text-center py-6 text-red-500">Error loading data.</p>
  if (!patient)
    return <p className="text-center py-6">No patient data available.</p>

  const avatarSrc = patient.profile?.sex === 'Male' ? maleAvatar : femaleAvatar

  // Patient info fields config
  const infoFields = [
    { label: 'Full Name', id: 'full_name', value: patient.profile?.full_name },
    { label: 'Age', id: 'age', value: patient.profile?.age },
    { label: 'Sex', id: 'sex', value: patient.profile?.sex },
    { label: 'Phone', id: 'phone', value: patient.profile?.phone_number },
    { label: 'Address', id: 'address', value: patient.profile?.address },
    {
      label: 'Assigned Doctor',
      id: 'doctor',
      value: patient.doctor?.profile?.full_name
        ? `Dr. ${patient.doctor.profile.full_name}`
        : 'Unassigned',
    },
    {
      label: 'Diabeties',
      id: 'diabeties',
      value: patient.diabetic,
    },

    {
      label: 'Hypertension',
      id: 'hypertension',
      value: patient.hypertension,
    },
    {
      label: 'BP Diastolic',
      id: 'bp_diastolic',
      value: patient.bp_diastolic,
    },
    {
      label: 'BP Systolic',
      id: 'bp_systolic',
      value: patient.bp_systolic,
    },
  ]

  // Analysis fields config
  const analysisFields = [
    {
      label: 'Percetage Range',
      id: 'percentage_range',
      value: patient.percentage_range || 'Unknown',
    },
    {
      label: 'Probability Range',
      id: 'probability_range',
      value: patient.probability_range || 'Unknown',
    },
  ]

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <img
              src={avatarSrc}
              alt="Patient Avatar"
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-xl font-bold">
                {patient.profile?.full_name || 'No Name'}
              </h1>
              <p className="text-gray-600 text-sm">
                Age: {patient.profile?.age || 'N/A'} | Sex:{' '}
                {patient.profile?.sex || 'N/A'}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Patient ID: {patient.id}
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex gap-3">
            <span
              className={`px-3 py-1 rounded-full text-white font-semibold ${
                patient?.risk_level === 'High'
                  ? 'bg-red-500'
                  : patient?.risk_level === 'Moderate'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}
            >
              {patient?.risk_level || 'Unknown'} Risk
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm">
              Last Checkup: {timeStampFormatter(patient.updated_at || 'N/A')}
            </span>
          </div>
        </div>

        {/* Info + Retina */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Patient Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {infoFields.map(({ label, id, value }) => (
                  <InputField
                    key={id}
                    label={label}
                    id={id}
                    value={value || 'N/A'}
                    readOnly
                    disabled
                  />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Retinal Image</h2>
              <div className="flex justify-center">
                <img
                  src={patient.retinal_img || 'https://placehold.co/600x400'}
                  alt="Retinal Scan"
                  className="max-w-full max-h-[400px] object-contain border rounded-md shadow"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Analysis & Recommendations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analysisFields.map(({ label, id, value }) => (
              <InputField
                key={id}
                label={label}
                id={id}
                value={value}
                readOnly
                disabled
              />
            ))}
          </div>
          <textarea
            id="recommendations"
            className="textarea textarea-bordered rounded-md w-full min-h-32 text-sm mt-5"
            placeholder="Enter your clinical assessment, recommended treatments, follow-up schedule, and any additional notes..."
            value={patient.recommendation || 'No recommendations yet.'}
          ></textarea>
        </div>
      </main>
    </div>
  )
}

export default PatientPage
