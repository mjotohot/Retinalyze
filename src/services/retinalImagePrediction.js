import { Client } from "@gradio/client";

/**
 * Predicts retinal health from an image
 * @param {File|Blob} imageFile - The retinal image file to analyze
 * @returns {Promise<Object>} Prediction result from the API
 */
export const predictRetinalImage = async (imageFile) => {
  try {
    if (!imageFile) {
      throw new Error('No image file provided');
    }

    // Convert File to Blob if needed
    const imageBlob = imageFile instanceof Blob ? imageFile : await imageFile.blob();

    const client = await Client.connect("Maikuuuu/RetinalImage");
    
    const result = await client.predict("/predict", {
      img: imageBlob,
    });

    return result.data;
  } catch (error) {
    console.error('Error predicting retinal image:', error);
    throw new Error(`Retinal image prediction failed: ${error.message}`);
  }
};