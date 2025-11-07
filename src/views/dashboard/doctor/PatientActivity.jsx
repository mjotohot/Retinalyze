import ResultModal from '../../../components/commons/ResultModal'
import { riskLevelStyles } from '../../../utils/riskLevelStyles'
import { useRef, useState } from 'react'
import { patients } from '../../../lib/data'

// Component to display recent patient activities
const PatientActivity = () => {
  // State to manage the selected patient for the modal
  const [selectedPatient, setSelectedPatient] = useState(null)
  // Ref for the ResultModal component
  const modalRef = useRef(null)

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
        {patients
          .sort((a, b) => new Date(b.lastCheckup) - new Date(a.lastCheckup))
          .slice(0, 3)
          .map((patient) => (
            <div
              key={patient.id}
              className="card border border-base-300 rounded-md"
            >
              <div className="card-body p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      className="w-12 h-12 rounded-full object-cover"
                      src={patient.image}
                      alt="user"
                    />
                    <div>
                      <h3 className="font-semibold text-base-content text-sm sm:text-base">
                        {patient.patient}
                      </h3>
                      <p className="text-sm text-base-content/60">
                        Age: {patient.age} &nbsp; • &nbsp; Last Checkup:
                        {patient.lastCheckup}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <span
                      className={`btn border-none cursor-auto ${
                        riskLevelStyles[patient.riskLevel]
                      } btn-sm`}
                    >
                      {patient.riskLevel}
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
      />
    </div>
  )
}

export default PatientActivity
