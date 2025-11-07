import { useAuthStore } from '../../stores/useAuthStore'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import { timeStampFormatter } from '../../utils/timeStampFormatter'

// Profile Sidebar Card Component
const ProfileSidebarCard = () => {
  const { profile, user } = useAuthStore() // Access the store authStore

  return (
    <div className="bg-white shadow rounded-lg lg:col-span-1">
      <div className="text-center p-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full mx-auto flex items-center justify-center mb-4">
          <img
            src={
              profile?.avatar_url ||
              'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
            }
            alt="user"
            className="rounded-full border-2"
          />
        </div>
        <h2 className="text-xl font-semibold">
          {profile?.full_name || 'No name'}
        </h2>
        <p className="text-gray-600">{profile?.role || 'No role'}</p>
      </div>
      <div className="px-6 pb-6 space-y-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Member since</p>
          <p className="font-semibold">
            {timeStampFormatter(profile?.created_at)}
          </p>
        </div>
        <hr />
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <FaEnvelope className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{user?.email || 'No Email'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaPhone className="h-4 w-4 text-gray-400" />
            <span className="text-sm">
              {profile?.phone_number || 'No number'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{profile?.address || 'No address'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSidebarCard
