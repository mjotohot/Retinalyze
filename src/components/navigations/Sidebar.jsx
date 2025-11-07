import { useAuthStore } from '../../stores/useAuthStore'
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, NavLink } from 'react-router'
import { FiMenu, FiX } from 'react-icons/fi'
import { RiLogoutCircleLine } from 'react-icons/ri'
import Modal from '../commons/Modal'
import UserInfo from './UserInfo'
import {
  adminNavItems,
  doctorsNavItems,
  patientsNavItems,
} from '../../lib/sidebarNavigations'

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout) // Access the logout function from the store
  const { userRole } = useAuthStore() // Access the userRole from the store
  const modalRef = useRef(null) // Ref for the modal
  const navigate = useNavigate() // Hook for navigation
  const location = useLocation() // Hook for location
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // State to manage sidebar visibility on mobile
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev) // Function to toggle sidebar
  const navItems = // Determine navigation items based on user role
    userRole === 'super_admin'
      ? adminNavItems
      : userRole === 'doctor'
        ? doctorsNavItems
        : patientsNavItems

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  // Handle logout confirmation
  const handleLogoutConfirm = async () => {
    try {
      await logout()
      if (modalRef.current?.open) modalRef.current.close()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <aside className="flex flex-col md:flex-row max-h-screen lg:fixed lg:h-screen overflow-y-auto">
      {/* Mobile header with menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={toggleSidebar} className="p-2 rounded-md">
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div className="text-xl font-bold">Retinalyze.ai</div>
          <img
            src="/logo.jpg"
            alt="logo"
            className="w-8 h-8 rounded-full border-2 border-gray-600"
          />
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static flex flex-col h-screen bg-white shadow-4xl w-64 z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } top-0 left-0 md:translate-x-0 md:w-64`}
      >
        <div className="flex items-center justify-center gap-3 mt-5 px-4">
          <div className="flex items-center justify-center rounded-full shadow-md">
            <img
              src="/logo.jpg"
              alt="Retinalyze.ai logo"
              className="h-10 w-10 object-cover rounded-full"
            />
          </div>
          <h1 className="text-xl font-extrabold leading-tight">
            Retinalyze.ai
            <span className="block font-normal text-xs text-gray-600">
              Early Stroke Risk Detection
            </span>
          </h1>
        </div>
        <div className="border-t mt-5 border-gray-300"></div>
        <nav className="flex-1 p-4 items-center justify-center py-4">
          <ul className="space-y-2 text-sm">
            {/* Navigation items */}
            {navItems.map(({ label, path, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 font-semibold rounded-lg ${
                      isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="mr-3" size={16} />
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <div
                className="flex items-center px-4 font-semibold py-2.5 cursor-pointer hover:bg-gray-100 hover:rounded-lg"
                onClick={() => {
                  if (modalRef.current && !modalRef.current.open) {
                    modalRef.current.showModal()
                  }
                }}
              >
                <RiLogoutCircleLine className="mr-3" size={16} />
                Sign out
              </div>
            </li>
          </ul>
        </nav>
        <UserInfo />
      </div>

      {/* Logout confirmation modal */}
      <Modal
        ref={modalRef}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Yes, Logout"
        color="bg-red-500"
        onConfirm={handleLogoutConfirm}
      />
    </aside>
  )
}

export default Sidebar
