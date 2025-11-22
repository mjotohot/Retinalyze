// hooks/useCreatePatientAccount.js
import { useMutation } from '@tanstack/react-query'
import { createPatientAccount } from '../services/createPatientAccount'
import { predictRetinalHealth } from '../services/retinalPrediction'
import { combinePredictions } from '../services/combinePredictions'
import { uploadRetinalImage } from '../services/uploadRetinalImage'
import { useAuthStore } from '../stores/useAuthStore'
import { useDoctorId } from './useDoctorId'

/**
 * Hook that handles patient account creation with retinal health prediction
 */
export const useCreatePatientAccount = (options = {}) => {
  const profile = useAuthStore((state) => state.profile)
  const { data: doctorId, isLoading: isDoctorLoading } = useDoctorId(
    profile?.id
  )

  return useMutation({
    mutationFn: async ({
      email,
      patientData,
      imagePrediction = null,
      retinalImageFile = null,
    }) => {
      if (!profile?.id) {
        throw new Error('Doctor profile not loaded. Please try again.')
      }

      if (isDoctorLoading || !doctorId) {
        throw new Error('Doctor ID not loaded. Please try again.')
      }

      // Transform patient data for the payload
      const transformedData = {
        ...patientData,
        doctor_id: doctorId,
        age: Number(patientData.age),
        bp_systolic: Number(patientData.bp_systolic),
        bp_diastolic: Number(patientData.bp_diastolic),
        diabetic: patientData.diabetic === 'yes',
        hypertension: patientData.hypertension === 'yes',
        smoking: patientData.smoking === 'yes',
        stroke_history: patientData.stroke_history === 'yes',
      }

      // Call retinal health prediction API before creating account
      console.log('Predicting retinal health from patient data...')
      const healthPrediction = await predictRetinalHealth({
        age: transformedData.age,
        sex: patientData.sex,
        bp_systolic: transformedData.bp_systolic,
        bp_diastolic: transformedData.bp_diastolic,
        diabetic: transformedData.diabetic,
        smoking: patientData.smoking,
        hypertension: transformedData.hypertension,
        stroke_history: transformedData.stroke_history,
      })

      console.log('Health prediction result:', healthPrediction)

      // Upload retinal image if provided
      let retinalImageUrl = null
      if (retinalImageFile) {
        console.log('Uploading retinal image to storage...')
        retinalImageUrl = await uploadRetinalImage(retinalImageFile, email)
        console.log('Retinal image uploaded:', retinalImageUrl)
      }

      // Combine predictions if image prediction exists
      let finalPrediction
      if (imagePrediction) {
        console.log('Combining image and health predictions...')
        finalPrediction = combinePredictions(imagePrediction, healthPrediction)
        console.log('Final combined prediction:', finalPrediction)
      } else {
        console.log(
          'No image prediction available, using health prediction only'
        )
        // Use health prediction only if no image was provided
        finalPrediction = {
          final_risk_level: healthPrediction?.[0]?.RiskLevel || 'Unknown',
          health_prediction: {
            risk_level: healthPrediction?.[0]?.RiskLevel || 'Unknown',
          },
          image_prediction: null,
          assessment:
            'Assessment based on health records only. Retinal image scan recommended for comprehensive evaluation.',
          requires_immediate_attention: false,
          prediction_date: new Date().toISOString(),
        }
      }

      // Add final prediction result and image URL to patient data
      const payload = {
        email,
        patientData: {
          ...transformedData,
          retinal_prediction: finalPrediction.final_risk_level, // Store the combined prediction result
          combined_score: finalPrediction.combined_score,
          retinal_img: retinalImageUrl, // Store the image URL
        },
      }

      // Create the patient account with prediction data
      return await createPatientAccount(payload)
    },

    onSuccess: (data) => {
      console.log('Patient account created successfully:', data)
      alert(`Patient password: ${data.data.password}`) // temporary since way free nga SMTP
      options?.onSuccess?.(data)
    },

    onError: (error) => {
      console.error('Error creating patient account:', error)
      options?.onError?.(error)
    },
  })
}
