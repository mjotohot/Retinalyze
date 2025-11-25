import { useLoadingStore } from '../../stores/useLoadingStore'

const GlobalLoader = () => {
  const { isLoading, isFadingOut, message } = useLoadingStore()

  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center 
                  bg-white bg-opacity-90 transition-opacity duration-300
                  ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Inline keyframes for animations */}
      <style>
        {`
          @keyframes spinRing {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes pulseDot {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        `}
      </style>

      <div className="flex flex-col items-center">
        {/* Logo with spinning circular border */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Circular spinning ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-purple-300 border-t-purple-600"
            style={{
              animation: 'spinRing 1.2s linear infinite',
            }}
          ></div>

          {/* Logo inside the spinner */}
          <img
            src="/logo-icon.png"
            alt="Loading..."
            className="w-10 h-10 opacity-90"
          />
        </div>

        {/* Loading Text */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 font-medium">{message}</p>

          {/* Animated Loading Dots */}
          <div className="mt-2 flex justify-center">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-purple-600 rounded-full"
                style={{ animation: 'pulseDot 1.5s ease-in-out infinite' }}
              ></div>

              <div
                className="w-2 h-2 bg-purple-600 rounded-full"
                style={{
                  animation: 'pulseDot 1.5s ease-in-out infinite',
                  animationDelay: '0.2s',
                }}
              ></div>

              <div
                className="w-2 h-2 bg-purple-600 rounded-full"
                style={{
                  animation: 'pulseDot 1.5s ease-in-out infinite',
                  animationDelay: '0.4s',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalLoader
