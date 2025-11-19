
import { useMutation } from '@tanstack/react-query';
import { predictRetinalImage } from '../services/retinalImagePrediction';

/**
 * Hook for making retinal image predictions
 * @param {Object} options - Optional callbacks for success/error handling
 * @returns {Object} Mutation object with predict function and status
 */
export const useRetinalImagePrediction = (options = {}) => {
  return useMutation({
    mutationFn: async (imageFile) => {
      return await predictRetinalImage(imageFile);
    },

    onSuccess: (data) => {
      console.log('Retinal image prediction successful:', data);
      options?.onSuccess?.(data);
    },

    onError: (error) => {
      console.error('Error in retinal image prediction:', error);
      options?.onError?.(error);
    },
  });
};