import Sidebar from '../../components/navigations/Sidebar'
import { CiSearch } from 'react-icons/ci'
import { FaTrash } from 'react-icons/fa6'
import { IoMdEye } from 'react-icons/io'
import { useRef, useEffect, useState } from 'react'
import { riskLevelStyles } from '../../utils/riskLevelStyles'
import { useFetchPatientsByDoctor } from '../../hooks/useFetchPatientByDoctor'
import { useAuthStore } from '../../stores/useAuthStore'
import { useSearch } from '../../hooks/useSearch'
import { searchPatient } from '../../services/fetchPatient'
import { useDoctorId } from '../../hooks/useDoctorId'
import { riskFilterOptions } from '../../lib/riskFilterOptions'
import SelectFilters from '../../components/commons/SelectFilters'
import maleAvatar from '../../assets/images/male.jpg'
import femaleAvatar from '../../assets/images/female.jpg'
import ResultModal from '../../components/commons/ResultModal'
import { useDeletePatient } from '../../hooks/useDeletePatient'
import Modal from '../../components/commons/Modal'

const PatientList = () => {
  const modalRef = useRef()
  const loadMoreRef = useRef(null)
  const deleteModalRef = useRef()

  const [selectedRisk, setSelectedRisk] = useState('')
  const [selectedPatient, setSelectedPatient] = useState('')
  const [deletingPatientId, setDeletingPatientId] = useState(null)
  const [modalData, setModalData] = useState({
    isOpen: false,
    type: '',
    message: '',
  })

  const profile = useAuthStore((state) => state.profile)
  const { data: doctorId } = useDoctorId(profile?.id)

  // Delete patient mutation
  const { mutate: deletePatientMutation, isLoading: isDeleting } =
    useDeletePatient(['patientsByDoctor', doctorId])

  // Fetch patients by doctor with infinite scrolling
  const {
    data: patients,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchPatientsByDoctor(doctorId, selectedRisk)

  // Search functionality
  const { search, setSearch, results, isFetching, error } = useSearch({
    searchFn: (query) => (doctorId ? searchPatient(query, doctorId) : []),
    delay: 400,
  })

  // Flatten the paginated data into a single array
  const patientData = patients?.pages.flatMap((page) => page.data) ?? []

  // Determine which data to display: search results or fetched patient data
  const displayedData = search ? results : patientData

  // Handle delete with confirmation
  const handleDelete = (patientId, patientName) => {
    setModalData({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${patientName}?`,
      confirmLabel: 'Delete',
      color: 'btn-error',
      onConfirm: () => {
        setDeletingPatientId(patientId)
        deletePatientMutation(patientId, {
          onSettled: () => setDeletingPatientId(null),
        })
      },
    })

    deleteModalRef.current?.showModal()
  }

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

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 pt-20 sm:p-6 lg:pt-6 lg:ml-64">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">
              Patient Management
              <span className="block font-normal text-sm sm:text-base text-gray-600">
                Manage your patient records and analysis.
              </span>
            </h1>
          </div>
          <div className="overflow-x-auto p-6 bg-white mt-6 rounded-md shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <label className="flex input items-center gap-2 border rounded-md border-none px-3 py-2 w-full sm:w-1/2">
                <CiSearch className="opacity-50 text-lg" />
                <input
                  type="search"
                  className="w-full outline-none"
                  placeholder="Search for a patient name. . ."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <SelectFilters
                options={riskFilterOptions}
                selectedValue={selectedRisk}
                onChange={setSelectedRisk}
              />
            </div>
            <table className="table table-sm">
              <thead>
                <tr className="text-xs sm:text-sm tracking-wider">
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>Risk Level</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Initial loading state */}
                {isLoading && patientData.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-6 text-gray-400 text-center italic"
                    >
                      Loading patients...
                    </td>
                  </tr>
                )}

                {/* if no data response */}
                {!isLoading && patientData.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-6 text-gray-400 italic"
                    >
                      No patient found.
                    </td>
                  </tr>
                )}

                {/* if searching patient */}
                {isFetching && (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-6 text-gray-400 italic"
                    >
                      Searching result...
                    </td>
                  </tr>
                )}

                {/* if no patients found */}
                {!isFetching && !error && search && results.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-6 text-gray-400 italic"
                    >
                      No patient found
                    </td>
                  </tr>
                )}

                {/* Display patient data */}
                {!isLoading &&
                  displayedData.map((patient) => (
                    <tr
                      key={patient.id}
                      className={
                        deletingPatientId === patient.id
                          ? 'opacity-50 pointer-events-none'
                          : ''
                      }
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                              <img
                                src={
                                  patient.profile?.sex === '0'
                                    ? maleAvatar
                                    : femaleAvatar
                                }
                              />
                            </div>
                          </div>
                          <div className="text-sm sm:text-base">
                            {patient.profile?.full_name || 'null'}
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">
                        {patient.profile?.age || 'null'}
                      </td>
                      <td className="text-sm">
                        {patient.profile?.sex === '0'
                          ? 'Male'
                          : patient.profile?.sex === '1'
                            ? 'Female'
                            : 'null'}
                      </td>
                      <td>
                        <span
                          className={`btn border-none cursor-auto ${
                            riskLevelStyles[patient.risk_level]
                          } btn-xs`}
                        >
                          {patient.risk_level || 'unknown'}
                        </span>
                      </td>
                      <td className="text-sm">
                        {patient.profile?.address || 'null'}
                      </td>
                      <td className="text-sm">
                        {patient.profile?.phone_number || 'null'}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            className="btn btn-ghost hover:bg-white border-none shadow-none btn-xs"
                            onClick={() => {
                              setSelectedPatient(patient)
                              modalRef.current?.open()
                            }}
                            disabled={deletingPatientId === patient.id}
                          >
                            <IoMdEye size={18} />
                          </button>
                          <button
                            className="btn btn-ghost text-red-500 hover:bg-white border-none shadow-none btn-xs"
                            onClick={() =>
                              handleDelete(
                                patient.id,
                                patient.profile?.full_name
                              )
                            }
                            disabled={
                              isDeleting || deletingPatientId === patient.id
                            }
                          >
                            {deletingPatientId === patient.id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <FaTrash size={14} />
                            )}
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
              <p className="text-center text-sm text-gray-400 mt-2 italic">
                Loading more...
              </p>
            )}

            {/* No more data indicator */}
            {!search && !hasNextPage && patientData.length > 0 && (
              <p className="text-center text-xs text-gray-400 mt-2 italic">
                No more data to load
              </p>
            )}

            <div className="text-xs text-gray-500 mt-2 sm:hidden">
              Scroll horizontally to view full table →
            </div>
          </div>
        </main>
      </div>

      <Modal
        ref={deleteModalRef}
        title={modalData.title}
        message={modalData.message}
        confirmLabel={modalData.confirmLabel}
        onConfirm={modalData.onConfirm}
        color={modalData.color}
      />

      <ResultModal
        ref={modalRef}
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        isDoctor={profile?.role === 'doctor'}
      />
    </>
  )
}

export default PatientList
