import Sidebar from '../../components/navigations/Sidebar'
import { FaTrash } from 'react-icons/fa6'
import { CiSearch } from 'react-icons/ci'
import { useFetchDoctor } from '../../hooks/useFetchDoctor'
import { searchDoctor } from '../../services/fetchDoctor'
import { useSearch } from '../../hooks/useSearch'
import { useEffect, useRef, useState } from 'react'
import { useDeleteDoctor } from '../../hooks/useDeleteDoctor'
import Modal from '../../components/commons/Modal'
import maleAvatar from '../../assets/images/male.jpg'
import femaleAvatar from '../../assets/images/female.jpg'

const AllDoctors = () => {
  //
  const loadMoreRef = useRef(null)
  const deleteModalRef = useRef()

  const [deletingDoctorId, setDeletingDoctorId] = useState(null)
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '',
    color: '',
    onConfirm: null,
  })

  // Fetch patient data using the custom hook
  const {
    data: doctors,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchDoctor()

  const { mutate: deleteDoctorMutation, isLoading: isDeleting } =
    useDeleteDoctor({
      queryKey: ['all-doctors'],
    })

  //
  const { search, setSearch, results, isFetching, error } = useSearch({
    searchFn: searchDoctor,
    delay: 400,
  })

  // Flatten the paginated data into a single array
  const docData = doctors?.pages.flatMap((page) => page.data) ?? []

  //
  const displayedData = search ? results : docData

  // Handle delete with confirmation
  const handleDelete = (doctorId, doctorName) => {
    setModalData({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete Dr. ${doctorName}?`,
      confirmLabel: 'Delete',
      color: 'btn-error',
      onConfirm: () => {
        setDeletingDoctorId(doctorId)
        deleteDoctorMutation(doctorId, {
          onSettled: () => setDeletingDoctorId(null),
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
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-3 pt-20 lg:p-6 lg:pt-6 lg:ml-64">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  All Doctors
                </h1>
                <p className="text-gray-600 mt-1">
                  List of all registered doctors and their records
                </p>
              </div>
            </div>

            {/* List of Doctors Table */}
            <div className="overflow-x-auto p-6 bg-white mt-6 rounded-md shadow-md">
              <label className="flex input items-center gap-2 mb-5 border rounded-md border-none px-3 py-2 w-full sm:w-1/2">
                <CiSearch className="opacity-50 text-lg" />
                <input
                  type="search"
                  className="w-full outline-none"
                  placeholder="Search for a doctor name. . ."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>

              <table className="table table-sm">
                <thead>
                  <tr className="text-xs sm:text-sm tracking-wide">
                    <th>Doctor's Name</th>
                    <th>Age</th>
                    <th>Sex</th>
                    <th>Phone</th>
                    <th>Specialization</th>
                    <th>Clinic</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Initial loading state */}
                  {isLoading && docData.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="py-6 text-gray-400 text-center italic"
                      >
                        Loading doctors...
                      </td>
                    </tr>
                  )}

                  {/* if no data response */}
                  {!isLoading && docData.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-6 text-gray-400 italic"
                      >
                        No doctors found.
                      </td>
                    </tr>
                  )}

                  {/* if searching doctors */}
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

                  {/* if no doctors found */}
                  {!isFetching && !error && search && results.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-6 text-gray-400 italic"
                      >
                        No doctors found
                      </td>
                    </tr>
                  )}

                  {/* Data rows */}
                  {!isLoading &&
                    displayedData?.map((doctor) => (
                      <tr key={doctor.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                                <img
                                  src={
                                    doctor.profiles?.sex === 'Male'
                                      ? maleAvatar
                                      : femaleAvatar
                                  }
                                />
                              </div>
                            </div>
                            <div className="text-sm sm:text-base">
                              {doctor.profiles.full_name || 'null'}
                            </div>
                          </div>
                        </td>
                        <td className="text-sm">
                          {doctor.profiles?.age || 'null'}
                        </td>
                        <td className="text-sm">
                          {doctor.profiles?.sex || 'null'}
                        </td>
                        <td className="text-sm">
                          {doctor.profiles?.phone_number || 'null'}
                        </td>
                        <td className="text-sm">
                          {doctor.specialization || 'null'}
                        </td>
                        <td className="text-sm">
                          {doctor.clinic_name || 'null'}
                        </td>
                        <td className="text-sm">
                          {doctor.profiles?.address || 'null'}
                        </td>
                        <td>
                          <button
                            className="btn btn-ghost text-red-500 hover:bg-white border-none shadow-none btn-xs"
                            onClick={() =>
                              handleDelete(
                                doctor.id,
                                doctor.profiles?.full_name
                              )
                            }
                            disabled={
                              isDeleting || deletingDoctorId === doctor.id
                            }
                          >
                            {deletingDoctorId === doctor.id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <FaTrash size={14} />
                            )}
                          </button>
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
              {!search && !hasNextPage && docData.length > 0 && (
                <p className="text-center text-xs text-gray-400 mt-2 italic">
                  No more data to load
                </p>
              )}

              {/* Hint for horizontal scrolling on small screens */}
              <div className="text-xs text-gray-400 italic mt-2 sm:hidden">
                Scroll horizontally to view full table →
              </div>
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
    </>
  )
}

export default AllDoctors
