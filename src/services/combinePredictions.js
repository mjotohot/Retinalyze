/**
 * Determines the final retinal prediction by combining image analysis and health record predictions
 * @param {Object} imagePrediction - Result from retinal image analysis
 * @param {string} imagePrediction.label - Label from image prediction (e.g., "Healthy", "Diseased")
 * @param {Object} healthPrediction - Result from health records prediction
 * @param {string} healthPrediction.RiskLevel - Risk level from health data (e.g., "Low", "Medium", "High")
 * @param {number} healthPrediction.StrokeRiskPercent - Stroke risk percentage (e.g., 50 for 50%)
 * @returns {Object} Combined prediction result with final assessment
 */
export const combinePredictions = (imagePrediction, healthPrediction) => {
  // Extract the prediction values
  const imageLabel = imagePrediction?.[0]?.label || 'Unknown';
  const riskLevel = healthPrediction?.[0]?.RiskLevel || 'Unknown';
 

  // Risk scoring system
  const imageRiskScore = getImageRiskScore(imageLabel);
const healthRiskScore = (healthPrediction?.[0]?.StrokeRiskPercent || 0) / 100;


  const combinedScore = (imageRiskScore * 0.5) + (healthRiskScore * 0.5);

  // Determine final risk level
  const finalRiskLevel = getFinalRiskLevel(combinedScore);

  // Generate detailed assessment
  const assessment = generateAssessment(imageLabel, riskLevel, finalRiskLevel);

  return {
    final_risk_level: finalRiskLevel,
    combined_score: Math.round(combinedScore * 100) / 100,
    image_prediction: {
      label: imageLabel,
      risk_score: imageRiskScore
    },
    health_prediction: {
      risk_level: riskLevel,
      risk_score: healthRiskScore
    },
    assessment: assessment,
    requires_immediate_attention: combinedScore >= 0.7,
    prediction_date: new Date().toISOString()
  };
};

/**
 * Converts image prediction label to a risk score (0-1)
 */
const getImageRiskScore = (label) => {
  const labelLower = label.toLowerCase();
  
  if (labelLower.includes('low') || labelLower.includes('healthy')) {
    return 0.3;
  } else if (labelLower.includes('moderate') || labelLower.includes('early')) {
    return 0.6;
  } else if (labelLower.includes('high')) {
    return 0.9;
  }
  
  return 0.5; // Default for unknown
};


/**
 * Determines final risk level from combined score
 */
const getFinalRiskLevel = (score) => {
  if (score < 0.4) return 'Low';
  if (score < 0.7) return 'Moderate';
  return 'High';
};

/**
 * Generates a detailed assessment message
 */
const generateAssessment = (imageLabel, riskLevel, finalRiskLevel) => {
  const assessments = {
    'Low': 'Patient shows minimal signs of retinal disease. Continue with regular monitoring and maintain healthy lifestyle habits.',
    'Moderate': 'Patient exhibits moderate risk factors. Schedule comprehensive eye examination and consider preventive measures.',
    'High': 'Patient shows significant risk indicators. Immediate comprehensive evaluation recommended with specialist consultation.'
  };

  return assessments[finalRiskLevel] || 'Further evaluation needed to determine appropriate care plan.';
};