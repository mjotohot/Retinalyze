import { BiSolidDashboard } from 'react-icons/bi'
import { FaUserDoctor } from 'react-icons/fa6'
import { MdGroupAdd } from 'react-icons/md'
import { FaUserInjured } from 'react-icons/fa'

// sidebar navigation items for admin role
export const adminNavItems = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: BiSolidDashboard,
  },
  {
    label: 'Add Doctor',
    path: '/admin/add',
    icon: MdGroupAdd,
  },
  {
    label: 'Doctors',
    path: '/admin/doctors',
    icon: FaUserDoctor,
  },
]

// sidebar navigation items for doctor role
export const doctorsNavItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: BiSolidDashboard,
  },
  {
    label: 'Add Patient',
    path: '/add',
    icon: MdGroupAdd,
  },
  {
    label: 'Patients',
    path: '/patients',
    icon: FaUserInjured,
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: FaUserDoctor,
  },
]

// sidebar navigation items for patient role
export const patientsNavItems = [
  {
    label: 'Results',
    path: '/user',
    icon: BiSolidDashboard,
  },
]
