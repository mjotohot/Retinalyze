import { useAuthStore } from '../../stores/useAuthStore'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera } from 'react-icons/fa'
import { timeStampFormatter } from '../../utils/timeStampFormatter'
import { useUploadAvatar } from '../../hooks/useUploadAvatar'
import { useRef } from 'react'

// Profile Sidebar Card Component
const ProfileSidebarCard = () => {
  const { profile, user } = useAuthStore() // Access the store authStore
  const fileInputRef = useRef(null)
  const uploadMutation = useUploadAvatar()

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Upload file
    uploadMutation.mutate({
      file,
      oldAvatarPath: profile?.avatar_path,
    })
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const isUploading = uploadMutation.isPending

  return (
    <div className="bg-white shadow rounded-lg lg:col-span-1">
      <div className="text-center p-6">
        {/* Avatar with Upload Button */}
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full mx-auto flex items-center justify-center mb-4 overflow-hidden">
            <img
              src={
                profile?.avatar_url ||
                'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
              }
              alt="user"
              className="rounded-full border-2 w-full h-full object-cover"
            />
          </div>

          {/* Camera Button Overlay */}
          <button
            onClick={handleCameraClick}
            disabled={isUploading}
            className="absolute bottom-3 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            title="Change avatar"
          >
            {isUploading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <FaCamera className="h-3 w-3" />
            )}
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
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