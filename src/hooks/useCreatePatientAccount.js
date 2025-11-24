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
        diabetic: Number(patientData.diabetic),
        hypertension: Number(patientData.hypertension),
        smoking: Number(patientData.smoking),
        stroke_history: Number(patientData.stroke_history),
      }

    

      // Prepare health prediction input
      const healthPredictionInput = {
        age: transformedData.age,
        sex: patientData.sex,
        bp_systolic: transformedData.bp_systolic,
        bp_diastolic: transformedData.bp_diastolic,
        diabetic: transformedData.diabetic,
        smoking: patientData.smoking,
        hypertension: transformedData.hypertension,
        stroke_history: transformedData.stroke_history,
      }

      
      const healthPrediction = await predictRetinalHealth(healthPredictionInput)


      // Upload retinal image if provided
      let retinalImageUrl = null
      if (retinalImageFile) {
  
        retinalImageUrl = await uploadRetinalImage(retinalImageFile, email)
      }

      // Combine predictions if image prediction exists
      let finalPrediction
      if (imagePrediction) {
  
        
        finalPrediction = combinePredictions(imagePrediction, healthPrediction)
        
      } else {
      
        
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
        
        console.log('Final prediction (health only):', JSON.stringify(finalPrediction, null, 2))
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
      const result = await createPatientAccount(payload)
    
      
      return result
    },

    onSuccess: (data) => {
      console.log('=== SUCCESS ===')
      console.log('Patient account created successfully:', data)
      alert(`Patient password: ${data.data.password}`) // temporary since way free nga SMTP
      options?.onSuccess?.(data)
    },

    onError: (error) => {
      console.error('=== ERROR ===')
      console.error('Error creating patient account:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      })
      options?.onError?.(error)
    },
  })
}