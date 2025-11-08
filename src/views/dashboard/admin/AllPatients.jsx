import { CiSearch } from 'react-icons/ci'
import { FaRegTrashCan } from 'react-icons/fa6'
import { FaRegEdit } from 'react-icons/fa'
import { IoEyeOutline } from 'react-icons/io5'
import ResultModal from '../../../components/commons/ResultModal'
import { useState, useRef, useEffect } from 'react'
import { riskLevelStyles } from '../../../utils/riskLevelStyles'
import { useFetchPatientData } from '../../../hooks/useFetchPatient'

const AllPatients = () => {
  const modalRef = useRef()
  const loadMoreRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  // Fetch patient data using the custom hook
  const {
    data: patients,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchPatientData()

  // Flatten the paginated data into a single array
  const patientData = patients?.pages.flatMap((page) => page.data) ?? []

  // Observe when the sentinel div (loadMoreRef) comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isLoading &&
          !isFetchingNextPage
        ) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    // Attach observer to the sentinel div
    const currentRef = loadMoreRef.current
    if (currentRef) observer.observe(currentRef)
    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [hasNextPage, fetchNextPage, isLoading, isFetchingNextPage])

  // Filter patients based on search term and risk level
  // const filteredPatients = patients.filter((p) => {
  //   const search = searchTerm.toLowerCase()
  //   const matchesNameOrAge =
  //     p.profile?.full_name?.toLowerCase().includes(search) ||
  //     p.age?.toString().includes(search)
  //   const matchesRisk = riskFilter === '' || p.riskLevel === riskFilter
  //   return matchesNameOrAge && matchesRisk
  // })

  return (
    <>
      <div className="overflow-x-auto p-6 bg-white mt-6 rounded-md shadow-md">
        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <label className="flex input items-center gap-2 border rounded-md border-none px-3 py-2 w-full sm:w-1/2">
            <CiSearch className="opacity-50 text-lg" />
            <input
              type="search"
              className="w-full outline-none"
              placeholder="Search for a patient name. . ."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
          <select
            className="select border-none rounded-md w-full sm:w-1/3"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>

        {/* Patients Table */}
        <table className="table table-sm">
          <thead>
            <tr className="text-xs sm:text-sm">
              <th>Patient Name</th>
              <th>Age</th>
              <th>Risk Level</th>
              <th>Last Checkup</th>
              <th>Assigned Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Initial loading state */}
            {isLoading && patientData.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-400 italic"
                >
                  Loading patients...
                </td>
              </tr>
            )}

            {/* if no data response */}
            {!isLoading && patientData.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-400 italic"
                >
                  No patients found.
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading &&
              patientData.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                          <img
                            src={
                              patient.profile?.avatar_url ||
                              'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                            }
                            alt="Avatar"
                          />
                        </div>
                      </div>
                      <div className="text-sm sm:text-base">
                        {patient.profile?.full_name || 'No name provided'}
                      </div>
                    </div>
                  </td>
                  <td className="text-sm">
                    {patient.age || 'No age provided'}
                  </td>
                  <td>
                    <span
                      className={`btn border-none cursor-auto ${
                        riskLevelStyles[patient.riskLevel]
                      } btn-xs`}
                    >
                      {patient.riskLevel || 'Unknown'}
                    </span>
                  </td>
                  <td className="text-sm">
                    {patient.lastCheckup || 'No checkup records'}
                  </td>
                  <td className="text-sm">
                    {patient.doctor?.profile?.full_name || 'Unassigned'}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        className="btn btn-ghost hover:bg-white border-none shadow-none btn-xs"
                        onClick={() => {
                          setSelectedPatient(patient)
                          modalRef.current?.open()
                        }}
                      >
                        <IoEyeOutline size={18} />
                      </button>
                      <button className="btn btn-ghost hover:bg-white border-none shadow-none btn-xs">
                        <FaRegEdit size={16} />
                      </button>
                      <button className="btn btn-ghost text-red-500 hover:bg-white border-none shadow-none btn-xs">
                        <FaRegTrashCan size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Sentinel div for infinite scrolling */}
        <div ref={loadMoreRef} className="h-6"></div>

        {/* Loading indicator for infinite scroll */}
        {isFetchingNextPage && (
          <p className="text-center text-sm text-gray-400 flex justify-center italic">
            Loading more...
          </p>
        )}

        {/* No more data indicator */}
        {!hasNextPage && patientData.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-2 italic">
            No more data to load
          </p>
        )}

        {/* Hint for horizontal scrolling on small screens */}
        <div className="text-xs text-gray-400 mt-2 sm:hidden italic">
          Scroll horizontally to view full table →
        </div>
      </div>

      {/* Result Modal for viewing patient assessment results */}
      <ResultModal
        ref={modalRef}
        patient={selectedPatient}
        onClose={() => {}}
      />
    </>
  )
}

export default AllPatients
