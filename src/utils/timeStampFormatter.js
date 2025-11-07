// custom utility to format timestamps into human-readable date strings
export const timeStampFormatter = (
  timestamp,
  locale = 'en-US',
  options = {}
) => {
  const date = new Date(timestamp)
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // hour: "2-digit",
    // minute: "2-digit",
    ...options,
  })
}
