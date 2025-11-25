import AppRoutes from './routes/AppRoutes'
import { useAuthStore } from './stores/useAuthStore'
import { useEffect } from 'react'
import GlobalLoader from './components/commons/GlobalLoader'

const App = () => {
  // initialize the auth store when the app first loads
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <>
      <GlobalLoader />
      <AppRoutes />
    </>
  )
}

export default App
