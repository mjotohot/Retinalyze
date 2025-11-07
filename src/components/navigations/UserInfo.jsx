import { useAuthStore } from '../../stores/useAuthStore'

// Component to display user information
const UserInfo = () => {
  const { user, profile, isLoading } = useAuthStore() // Access user, profile, and loading state

  // Handle loading state
  if (isLoading) {
    return <p className="p-4 text-sm text-gray-500">Loading...</p>
  }

  // Handle case when no user is logged in
  if (!user) {
    return <p className="p-4 text-sm text-gray-500">No user logged in</p>
  }

  return (
    <div className="p-4 border-t border-gray-300">
      <div className="flex items-center space-x-3 mb-4">
        <img
          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
          src={
            profile?.avatar_url ||
            'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
          }
          alt="user"
        />
        <div>
          <p className="text-sm font-bold">{profile?.full_name || 'No name'}</p>
          <p className="text-xs text-gray-700">
            Role: {profile?.role || 'User'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
