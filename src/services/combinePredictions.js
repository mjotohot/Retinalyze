/**
 * Determines the final retinal prediction by combining image analysis and health record predictions
 * @param {Object} imagePrediction - Result from retinal image analysis
 * @param {string} imagePrediction.label - Label from image prediction (e.g., "Healthy", "Diseased")
 * @param {Object} healthPrediction - Result from health records prediction
 * @param {string} healthPrediction.RiskLevel - Risk level from health data (e.g., "Low", "Medium", "High")
 * @returns {Object} Combined prediction result with final assessment
 */
export const combinePredictions = (imagePrediction, healthPrediction) => {
  // Extract the prediction values
  const imageLabel = imagePrediction?.[0]?.label || 'Unknown';
  const riskLevel = healthPrediction?.[0]?.RiskLevel || 'Unknown';

  // Risk scoring system
  const imageRiskScore = getImageRiskScore(imageLabel);
  const healthRiskScore = getHealthRiskScore(riskLevel);

  // Calculate combined risk score (weighted average: 60% image, 40% health)
  const combinedScore = (imageRiskScore * 0.6) + (healthRiskScore * 0.4);

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
  
  if (labelLower.includes('normal') || labelLower.includes('healthy')) {
    return 0.1;
  } else if (labelLower.includes('mild') || labelLower.includes('early')) {
    return 0.4;
  } else if (labelLower.includes('moderate')) {
    return 0.6;
  } else if (labelLower.includes('severe') || labelLower.includes('advanced')) {
    return 0.9;
  } else if (labelLower.includes('disease') || labelLower.includes('abnormal')) {
    return 0.7;
  }
  
  return 0.5; // Default for unknown
};

/**
 * Converts health risk level to a risk score (0-1)
 */
const getHealthRiskScore = (riskLevel) => {
  const levelLower = riskLevel.toLowerCase();
  
  if (levelLower.includes('low') || levelLower.includes('minimal')) {
    return 0.2;
  } else if (levelLower.includes('medium') || levelLower.includes('moderate')) {
    return 0.5;
  } else if (levelLower.includes('high') || levelLower.includes('severe')) {
    return 0.8;
  } else if (levelLower.includes('critical') || levelLower.includes('extreme')) {
    return 0.95;
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