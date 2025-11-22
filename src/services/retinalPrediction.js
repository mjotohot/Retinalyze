import { Client } from '@gradio/client'

/**
 * Predicts retinal health risk based on patient data
 * @param {Object} patientData - Patient health information
 * @param {number} patientData.age - Patient's age
 * @param {string} patientData.sex - Patient's sex ('male' or 'female')
 * @param {number} patientData.bp_systolic - Systolic blood pressure
 * @param {number} patientData.bp_diastolic - Diastolic blood pressure
 * @param {boolean} patientData.diabetic - Whether patient has diabetes
 * @param {string} patientData.smoking - Smoking status
 * @param {boolean} patientData.hypertension - Whether patient has hypertension
 * @param {boolean} patientData.stroke_history - Whether patient has stroke history
 * @returns {Promise<Object>} Prediction result from the API
 */
export const predictRetinalHealth = async (patientData) => {
  try {
    const client = await Client.connect('Maikuuuu/RetinalText')

    const result = await client.predict('/predict', {
      age: patientData.age,
      sex: patientData.sex,
      bp_systolic: patientData.bp_systolic,
      bp_diastolic: patientData.bp_diastolic,
      diabetes: patientData.diabetic ? 1 : 0, // Convert boolean to number
      smoking: patientData.smoking,
      hypertension: patientData.hypertension ? 1 : 0, // Convert boolean to number
      strokehistory: patientData.stroke_history ? 1 : 0, // Convert boolean to number
    })

    return result.data
  } catch (error) {
    console.error('Error predicting retinal health:', error)
    throw new Error(`Retinal health prediction failed: ${error.message}`)
  }
}
