export const getProbabilityRange = (score) => {
  if (score < 0.4) return 'Low (0–39%)'
  if (score < 0.7) return 'Moderate (40–69%)'
  return 'High (70–100%)'
}
