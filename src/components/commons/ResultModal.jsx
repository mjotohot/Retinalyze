import { MdPerson, MdCalendarToday, MdWarning } from 'react-icons/md'
import { AiOutlineFileText } from 'react-icons/ai'
import { riskLevelStyles } from '../../utils/riskLevelStyles'
import { timeStampFormatter } from '../../utils/timeStampFormatter'
import { savePatientRecommendation } from '../../services/fetchPatient'
import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react'

const ResultModal = forwardRef(
  ({ patient, onClose, isDoctor = false }, ref) => {
    const dialogRef = useRef(null)
    const [recommendation, setRecommendation] = useState(
      patient?.recommendation || ''
    )

    // Update recommendation state when patient prop changes
    useEffect(() => {
      setRecommendation(patient?.recommendation || '')
    }, [patient])

    useImperativeHandle(ref, () => ({
      open: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }))

    const handleClose = () => {
      dialogRef.current?.close()
      onClose?.()
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        await savePatientRecommendation(patient.id, recommendation)
        alert('Recommendation saved successfully!')
        handleClose()
      } catch (err) {
        alert('Error saving recommendation: ' + err.message)
      }
    }

    const getProbabilityRange = (score) => {
      if (score < 0.4) return 'Low (0–39%)'
      if (score < 0.7) return 'Moderate (40–69%)'
      return 'High (70–100%)'
    }

    return (
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box w-full max-w-5xl p-0 sm:p-4">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
            onClick={handleClose}
          >
            ✕
          </button>
          <div className="p-4 sm:p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Patient Analysis Results
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Detailed stroke risk assessment and recommendations
              </p>
            </div>
            {patient ? (
              <div className="card border rounded-md">
                <div className="card-body p-4">
                  <h2 className="card-title text-base sm:text-lg flex items-center gap-2">
                    <MdPerson className="text-xl" />
                    Patient Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Patient Name</p>
                      <p className="font-semibold text-base">
                        {patient.profile?.full_name || 'unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-semibold">
                        {patient.profile?.age || 'null'} years old
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Checkup</p>
                      <p className="font-semibold flex items-center gap-1">
                        <MdCalendarToday className="h-4 w-4" />
                        {timeStampFormatter(patient.updated_at || 'null')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sex</p>
                      <p className="font-semibold">
                        {patient.profile?.sex || 'null'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No patient data available.
              </p>
            )}

            <div className="card rounded-md border">
              <div className="card-body p-4">
                <h2 className="card-title text-base sm:text-lg flex items-center gap-2">
                  <MdWarning className="text-xl" />
                  Retinal & Health Prediction Summary
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
                    <p className="text-sm text-gray-500 mb-1">
                      Risk Probability
                    </p>

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
              </div>
            </div>

            <div className="card rounded-md border">
              <div className="card-body p-4">
                <h2 className="card-title text-base sm:text-lg flex items-center gap-2">
                  <AiOutlineFileText className="text-xl" />
                  Clinical Recommendations
                </h2>
                <p className="text-sm text-gray-600">
                  Add your professional assessment and treatment plan
                </p>

                <label className="label mt-4" htmlFor="recommendations">
                  <span className="label-text font-medium text-sm">
                    Doctor's Notes & Recommendations
                  </span>
                </label>
                <textarea
                  id="recommendations"
                  className="textarea textarea-bordered rounded-md w-full min-h-32 text-sm"
                  placeholder="Enter your clinical assessment, recommended treatments, follow-up schedule, and any additional notes..."
                  disabled={!isDoctor}
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                ></textarea>

                {isDoctor && (
                  <div className="flex justify-center mt-5">
                    <button
                      className="btn btn-neutral rounded-md btn-sm sm:btn-md"
                      onClick={handleSubmit}
                    >
                      Submit Recommendations
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    )
  }
)

export default ResultModal
