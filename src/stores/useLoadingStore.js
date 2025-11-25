import { create } from 'zustand'

export const useLoadingStore = create((set) => ({
  isLoading: false,
  isFadingOut: false,
  message: 'Loading...',

  showLoading: (message = 'Loading...') =>
    set({ isLoading: true, isFadingOut: false, message }),

  hideLoading: () => {
    // Start fade-out
    set({ isFadingOut: true })

    // Wait for CSS animation to finish (300ms)
    setTimeout(() => {
      set({ isLoading: false, isFadingOut: false, message: '' })
    }, 300)
  },
}))
