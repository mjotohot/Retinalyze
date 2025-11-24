import { useAuthStore } from '../../../stores/useAuthStore'
import { useFetchPatientById } from '../../../hooks/useFetchPatientById'
import { timeStampFormatter } from '../../../utils/timeStampFormatter'
import Sidebar from '../../../components/navigations/Sidebar'
import InputField from '../../../components/commons/InputField'
import { getProbabilityRange } from '../../../utils/probabilityRange'
import { riskLevelStyles } from '../../../utils/riskLevelStyles'
import { genderFormatter } from '../../../utils/genderFormatter'
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

  const avatarSrc =
    genderFormatter(patient.profile?.sex) === 'Male' ? maleAvatar : femaleAvatar

  // Patient info fields config
  const infoFields = [
    { label: 'Full Name', id: 'full_name', value: patient.profile?.full_name },
    { label: 'Age', id: 'age', value: patient.profile?.age },
    {
      label: 'Sex',
      id: 'sex',
      value: genderFormatter(patient.profile?.sex),
    },
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
                {genderFormatter(patient.profile?.sex || 'N/A')}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Patient ID: {patient.id}
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex gap-3">
            <span
              className={`badge border-none p-4 cursor-auto ${
                riskLevelStyles[patient?.risk_level]
              } btn-xs`}
            >
              {patient?.risk_level || 'Unknown'}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">Risk Level</p>
              <span
                className={`badge border-none cursor-auto ${
                  riskLevelStyles[patient?.risk_level]
                } btn-xs`}
              >
                {patient?.risk_level || 'Unknown'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Probability Range</p>
              {patient?.combined_score ? (
                <p className="font-semibold text-gray-800 mt-1">
                  {getProbabilityRange(patient.combined_score)}
                </p>
              ) : (
                <p className="font-semibold text-gray-800 mt-1">N/A</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Risk Probability</p>

              {patient?.combined_score ? (
                <div className="relative w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  {/* Filled bar */}
                  <div
                    className={`h-full flex items-center justify-center text-xs font-semibold text-white transition-all duration-500 ${
                      patient.combined_score >= 0.7
                        ? 'bg-red-500'
                        : patient.combined_score >= 0.4
                          ? 'bg-yellow-400 text-gray-800'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${patient.combined_score * 100}%` }}
                  >
                    {/* Label inside the bar */}
                    {(patient.combined_score * 100).toFixed(1)}%
                  </div>

                  {/* Optional transparent overlay for label visibility if bar is small */}
                  {patient.combined_score < 0.15 && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                      {(patient.combined_score * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              ) : (
                <p className="font-semibold text-gray-800 mt-1">N/A</p>
              )}
            </div>
          </div>
          <textarea
            id="recommendations"
            className="textarea textarea-bordered rounded-md w-full min-h-32 text-sm mt-5"
            value={patient.recommendation || 'No recommendations yet.'}
            disabled
          ></textarea>
        </div>
      </main>
    </div>
  )
}

export default PatientPage
