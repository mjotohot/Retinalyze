
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadAvatar, deleteAvatar, updateProfileAvatar } from '../services/avatarService'
import { useAuthStore } from '../stores/useAuthStore'


/**
 * Hook for uploading avatar images
 * Handles file upload to storage and profile update in one operation
 */
export const useUploadAvatar = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  return useMutation({
    mutationFn: async ({ file, oldAvatarPath }) => {
      const userId = user?.id

      if (!userId) {
        throw new Error('User not authenticated')
      }

      console.log('Old avatar path to delete:', oldAvatarPath)

      // Step 1: Upload new avatar to storage
      const { url, path } = await uploadAvatar(file, userId)

      // Step 2: Update profile with new avatar URL and path
      const profileData = await updateProfileAvatar(userId, url, path)

      // Step 3: Delete old avatar if it exists
      if (oldAvatarPath && oldAvatarPath.trim() !== '') {
        try {
          console.log('Attempting to delete old avatar:', oldAvatarPath)
          await deleteAvatar(oldAvatarPath)
          console.log('Old avatar deleted successfully')
        } catch (error) {
          // Log but don't fail if old avatar deletion fails
          console.error('Failed to delete old avatar:', error)
        }
      } else {
        console.log('No old avatar to delete')
      }

      return {
        profileData,
        avatarUrl: url,
        avatarPath: path,
      }
    },
    onSuccess: ({ profileData, avatarUrl, avatarPath }) => {
      // Try to update the auth store if the method exists
      const updateProfile = useAuthStore.getState().updateProfile
      
      if (typeof updateProfile === 'function') {
        const updatedProfile = {
          ...profileData,
          avatar_url: avatarUrl,
          avatar_path: avatarPath,
        }
        updateProfile(updatedProfile)
      }

      // Invalidate relevant queries to refetch fresh data
      queryClient.invalidateQueries(['profile', user?.id])
      queryClient.invalidateQueries(['doctor', user?.id])

      // Reload the site automatically after successful upload
      window.location.reload()
    },
    onError: (error) => {
      console.error('Avatar upload error:', error)
    },
  })
}

/**
 * Hook for removing avatar
 * Removes avatar from storage and updates profile
 */
export const useRemoveAvatar = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  return useMutation({
    mutationFn: async (avatarPath) => {
      const userId = user?.id

      if (!userId) {
        throw new Error('User not authenticated')
      }

      console.log('Avatar path to delete:', avatarPath)

      // Step 1: Delete avatar from storage
      if (avatarPath && avatarPath.trim() !== '') {
        try {
          await deleteAvatar(avatarPath)
          console.log('Avatar deleted successfully')
        } catch (error) {
          console.error('Failed to delete avatar:', error)
          throw error
        }
      }

      // Step 2: Update profile to remove avatar URL and path
      const profileData = await updateProfileAvatar(userId, null, null)

      return { profileData }
    },
    onSuccess: ({ profileData }) => {
      // Try to update the auth store if the method exists
      const updateProfile = useAuthStore.getState().updateProfile
      
      if (typeof updateProfile === 'function') {
        updateProfile(profileData)
      }

      // Invalidate queries
      queryClient.invalidateQueries(['profile', user?.id])
      queryClient.invalidateQueries(['doctor', user?.id])

      // Reload the site automatically after successful removal
      window.location.reload()
    },
    onError: (error) => {
      console.error('Avatar removal error:', error)
    },
  })
}