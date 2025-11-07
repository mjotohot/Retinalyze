import Sidebar from '../../components/navigations/Sidebar'
import { CiSearch } from 'react-icons/ci'
import { FaRegTrashCan } from 'react-icons/fa6'
import { IoEyeOutline } from 'react-icons/io5'
import ResultModal from '../../components/commons/ResultModal'
import { useState, useRef } from 'react'
import { riskLevelStyles } from '../../utils/riskLevelStyles'
import { patients } from '../../lib/data'

const PatientList = () => {
  const modalRef = useRef()
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)

  const filteredPatients = patients.filter((p) => {
    const search = searchTerm.toLowerCase()
    const matchesNameOrAge =
      p.patient.toLowerCase().includes(search) ||
      p.age.toString().includes(search)
    const matchesRisk = riskFilter === '' || p.riskLevel === riskFilter
    return matchesNameOrAge && matchesRisk
  })

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
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                className="select rounded-md bg-white w-full sm:w-1/2"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low Risk</option>
              </select>
              <label className="input rounded-md bg-white flex items-center gap-2">
                <CiSearch className="opacity-50" />
                <input
                  type="search"
                  className="w-full"
                  required
                  placeholder="Search name or age"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="overflow-x-auto p-6 bg-white mt-6 rounded-md shadow-md">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs sm:text-sm">
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Risk Level</th>
                  <th>Last Checkup</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                            <img src={patient.image} alt="Avatar" />
                          </div>
                        </div>
                        <div className="text-sm sm:text-base">
                          {patient.patient}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{patient.age}</td>
                    <td>
                      <span
                        className={`btn border-none cursor-auto ${
                          riskLevelStyles[patient.riskLevel]
                        } btn-xs`}
                      >
                        {patient.riskLevel}
                      </span>
                    </td>
                    <td className="text-sm">{patient.lastCheckup}</td>
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
                        <button className="btn btn-ghost text-red-500 hover:bg-white border-none shadow-none btn-xs">
                          <FaRegTrashCan size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mt-2 sm:hidden">
              Scroll horizontally to view full table →
            </div>
          </div>
        </main>
      </div>
      <ResultModal
        ref={modalRef}
        patient={selectedPatient}
        onClose={() => {}}
      />
    </>
  )
}

export default PatientList
