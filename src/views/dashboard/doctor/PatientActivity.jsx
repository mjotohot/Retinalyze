import ResultModal from '../../../components/commons/ResultModal'
import { useFetchPatientsByDoctor } from '../../../hooks/useFetchPatientByDoctor'
import { useAuthStore } from '../../../stores/useAuthStore'
import { useDoctorId } from '../../../hooks/useDoctorId'
import { timeStampFormatter } from '../../../utils/timeStampFormatter'
import { riskLevelStyles } from '../../../utils/riskLevelStyles'
import maleAvatar from '../../../assets/images/male.jpg'
import femaleAvatar from '../../../assets/images/female.jpg'
import { useRef, useState } from 'react'

// Component to display recent patient activities
const PatientActivity = () => {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const modalRef = useRef(null)

  const profile = useAuthStore((state) => state.profile)
  const { data: doctorId } = useDoctorId(profile?.id)

  // Fetch patients by doctor with infinite scrolling
  const { data: patients, isLoading } = useFetchPatientsByDoctor(doctorId)

  // Flatten the paginated data into a single array
  const patientData = patients?.pages.flatMap((page) => page.data) ?? []

  // Early Loading Guard
  if (isLoading && !patients) {
    return (
      <div className="bg-white p-4 sm:p-6 mt-8 rounded-lg shadow-md text-center py-4 text-gray-400 italic">
        Loading patients...
      </div>
    )
  }

  return (
    <div className="bg-white p-4 sm:p-6 mt-8 rounded-lg shadow-md">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-base-content mb-1">
          Recent Activity
        </h1>
        <p className="text-sm text-base-content/70">
          Latest patient analyses and results
        </p>
      </div>

      {/* Patient List */}
      <div className="space-y-4">
        {isLoading && patientData.length === 0 && (
          <div className="py-4 text-gray-400 text-center italic">
            Loading patients...
          </div>
        )}

        {patientData
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .slice(0, 5)
          .map((patient) => (
            <div
              key={patient.id}
              className="card border border-base-300 rounded-md"
            >
              <div className="card-body p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="rounded-full h-10 w-10 sm:h-12 sm:w-12">
                        <img
                          src={
                            patient.profile?.sex === 'Male'
                              ? maleAvatar
                              : femaleAvatar
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base-content text-sm sm:text-base">
                        {patient.profile?.full_name || 'unknown'}
                      </h3>
                      <p className="text-sm text-base-content/60">
                        Age: {patient.profile?.age || 'null'} &nbsp; • &nbsp;
                        Last Checkup:&nbsp;
                        {timeStampFormatter(patient.updated_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <span
                      className={`btn border-none cursor-auto ${
                        riskLevelStyles[patient.risk_level]
                      } btn-sm`}
                    >
                      {patient.risk_level || 'unknown'}
                    </span>
                    <button
                      className="btn btn-sm border-none"
                      onClick={() => {
                        setSelectedPatient(patient)
                        modalRef.current?.open()
                      }}
                    >
                      View Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Result Modal */}
      <ResultModal
        ref={modalRef}
        patient={selectedPatient}
        onClose={() => {}}
        isDoctor={profile?.role === 'doctor'}
      />
    </div>
  )
}

export default PatientActivity
