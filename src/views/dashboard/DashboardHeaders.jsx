import { Link } from 'react-router'

// Dashboard header component with role-based content
const DashboardHeader = ({ name, role }) => {
  // Determine role flags
  const isSuperAdmin = role === 'super_admin'
  const isDoctor = role === 'doctor'

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold">
        Welcome back, <span>{name}</span>
        <span className="block font-normal text-sm sm:text-base text-gray-600">
          {isDoctor && "Here's what's happening with your patients today."}
          {isSuperAdmin && "Here's the current overview across all patients."}
        </span>
      </h1>

      {/* Action buttons based on role */}
      <div className="flex justify-around sm:justify-start gap-2 mt-1">
        {/* Buttons for doctors */}
        {isDoctor && (
          <>
            <Link to="/add">
              <button className="btn-neutral btn rounded-lg">
                + Add Patient
              </button>
            </Link>
            <Link to="/patients">
              <button className="btn bg-white rounded-lg border-none shadow-md">
                View All Patients
              </button>
            </Link>
          </>
        )}

        {/* Buttons for super admins */}
        {isSuperAdmin && (
          <>
            <Link to="/admin/add">
              <button className="btn-neutral btn rounded-lg">
                + Add Doctor
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default DashboardHeader
