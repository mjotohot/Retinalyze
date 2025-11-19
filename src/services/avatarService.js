import { supabase } from "../api/supabaseClient"

/**
 * Upload avatar image to Supabase storage
 * @param {File} file - The image file to upload
 * @param {string} userId - The user ID for unique file naming
 * @returns {Promise<{url: string, path: string}>} - The public URL and storage path
 */
export const uploadAvatar = async (file, userId) => {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit.')
    }

    // Create unique file name with timestamp to avoid conflicts
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatar_images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false, // Changed to false to avoid conflicts with existing files
      })

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatar_images')
      .getPublicUrl(filePath)

    return {
      url: urlData.publicUrl,
      path: filePath,
    }
  } catch (error) {
    console.error('Error uploading avatar:', error)
    throw error
  }
}

/**
 * Delete avatar image from Supabase storage
 * @param {string} filePath - The storage path of the file to delete
 * @returns {Promise<void>}
 */
export const deleteAvatar = async (filePath) => {
  try {
    if (!filePath) {
      console.warn('No file path provided for deletion')
      return
    }

    console.log('Deleting file from storage:', filePath)

    const { data, error } = await supabase.storage
      .from('avatar_images')
      .remove([filePath])

    if (error) {
      console.error('Supabase delete error:', error)
      throw error
    }

    console.log('Delete response:', data)
  } catch (error) {
    console.error('Error deleting avatar:', error)
    throw error
  }
}

/**
 * Update profile with new avatar URL and path
 * @param {string} userId - The user ID
 * @param {string|null} avatarUrl - The avatar URL to update (null to remove)
 * @param {string|null} avatarPath - The avatar storage path to update (null to remove)
 * @returns {Promise<any>} - Updated profile data
 */
export const updateProfileAvatar = async (userId, avatarUrl, avatarPath = null) => {
  try {
    const updateData = {
      avatar_url: avatarUrl,
    }

    // Only update avatar_path if it's provided (check if column exists in your DB)
    if (avatarPath !== undefined) {
      updateData.avatar_url = avatarUrl
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error updating profile avatar:', error)
    throw error
  }
}