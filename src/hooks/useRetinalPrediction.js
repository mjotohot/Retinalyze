
import { useMutation } from '@tanstack/react-query';
import { predictRetinalHealth } from '../services/retinalPrediction';

/**
 * Hook for making retinal health predictions
 * @param {Object} options - Optional callbacks for success/error handling
 * @returns {Object} Mutation object with predict function and status
 */
export const useRetinalPrediction = (options = {}) => {
  return useMutation({
    mutationFn: async (patientData) => {
      return await predictRetinalHealth(patientData);
    },

    onSuccess: (data) => {
      console.log('Retinal health prediction successful:', data);
      options?.onSuccess?.(data);
    },

    onError: (error) => {
      console.error('Error in retinal health prediction:', error);
      options?.onError?.(error);
    },
  });
};