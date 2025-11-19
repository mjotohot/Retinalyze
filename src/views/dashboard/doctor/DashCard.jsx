import { useDashboardCounts } from '../../../hooks/useDashboardCounts'
import { useAuthStore } from '../../../stores/useAuthStore'
import { useDoctorId } from '../../../hooks/useDoctorId'
import { HiMiniUsers } from 'react-icons/hi2'
import { TiWarning } from 'react-icons/ti'
import { IoCalendarNumberSharp } from 'react-icons/io5'
import { TbDeviceHeartMonitorFilled } from 'react-icons/tb'

// Dashboard card component
const DashCard = () => {
  const profile = useAuthStore((state) => state.profile)
  const { data: doctorId } = useDoctorId(profile?.id)
  const { data: stats, isLoading } = useDashboardCounts(doctorId)

  const cards = [
    {
      id: 1,
      title: 'Total Patients',
      icon: HiMiniUsers,
      count: stats?.total ?? 0,
      detail: 'Under your care',
    },
    {
      id: 2,
      title: 'Patients Under Monitoring',
      icon: TbDeviceHeartMonitorFilled,
      count: stats?.monitored ?? 0,
      detail: 'Require immediate attention',
    },
    {
      id: 3,
      title: 'This Week',
      icon: IoCalendarNumberSharp,
      count: stats?.thisWeek ?? 0,
      detail: 'Newly registered patients',
    },
    {
      id: 4,
      title: 'High Risk Patients',
      icon: TiWarning,
      count: stats?.highRisk ?? 0,
      detail: 'Critical condition',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 tracking-widest">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.id} className="card shadow-md bg-white rounded-lg">
            <div className="card-body">
              <h2 className="font-semibold flex justify-between tracking-normal">
                {card.title}
                {Icon && (
                  <Icon
                    size={20}
                    className={
                      card.title === 'High Risk Patients'
                        ? 'text-red-500'
                        : card.title === 'Patients Under Monitoring'
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                    }
                  />
                )}
              </h2>
              <p
                className={`text-2xl font-extrabold ${
                  card.title === 'High Risk Patients'
                    ? 'text-red-500'
                    : card.title === 'Patients Under Monitoring'
                      ? 'text-yellow-600'
                      : 'text-black'
                }`}
              >
                {isLoading ? '...' : card.count}
                <span className="block font-normal text-xs text-gray-600 tracking-normal">
                  {card.detail}
                </span>
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DashCard
