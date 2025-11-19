// services/uploadRetinalImage.js
import { supabase } from "../api/supabaseClient"

/**
 * Uploads a retinal image to Supabase storage
 * @param {File} imageFile - The retinal image file to upload
 * @param {string} patientEmail - Patient's email to create unique filename
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export const uploadRetinalImage = async (imageFile, patientEmail) => {
  try {
    if (!imageFile) {
      throw new Error('No image file provided')
    }

    // Create a unique filename using patient email and timestamp
    const timestamp = Date.now()
    const fileExt = imageFile.name.split('.').pop()
    const sanitizedEmail = patientEmail.replace(/[^a-zA-Z0-9]/g, '_')
    const fileName = `${sanitizedEmail}_${timestamp}.${fileExt}`

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('retinal_images')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Error uploading retinal image:', error)
      throw new Error(`Failed to upload retinal image: ${error.message}`)
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('retinal_images')
      .getPublicUrl(fileName)

    console.log('Retinal image uploaded successfully:', publicUrl)
    return publicUrl

  } catch (error) {
    console.error('Error in uploadRetinalImage:', error)
    throw error
  }
}