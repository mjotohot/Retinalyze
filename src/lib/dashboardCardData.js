import { HiMiniUsers } from 'react-icons/hi2'
import { TiWarning } from 'react-icons/ti'
import { IoCalendarNumberSharp } from 'react-icons/io5'
import { TbDeviceHeartMonitorFilled } from 'react-icons/tb'

// Dashboard card data
export const cards = [
  {
    id: 1,
    title: 'Total Patients',
    icon: HiMiniUsers,
    count: 58,
    detail: '+2 from last week',
  },
  {
    id: 2,
    title: 'Patients Under Monitoring',
    icon: TbDeviceHeartMonitorFilled,
    count: 12,
    detail: 'Require immediate attention',
  },
  {
    id: 3,
    title: 'This Week',
    icon: IoCalendarNumberSharp,
    count: 23,
    detail: 'Analysis completed',
  },
  {
    id: 4,
    title: 'High Risk Patients',
    icon: TiWarning,
    count: '10',
    detail: 'Critical condition',
  },
]
