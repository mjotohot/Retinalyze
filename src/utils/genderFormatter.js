export const genderFormatter = (gender) => {
  if (gender === '0') return 'Male'
  if (gender === '1') return 'Female'
  return 'no sex'
}
