import bgImage from '../../assets/images/background-image.jpg'
import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-2"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
      }}
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2 h-full">
          <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-blue-500 text-white">
            <div className="w-48 h-48 rounded-full overflow-hidden mb-6 flex items-center justify-center bg-[#B6CAE3]">
              <img
                src="logo.jpg"
                alt="logo"
                className="object-cover w-40 h-40"
              />
            </div>

            <h1 className="text-3xl font-bold mb-2">Retinalyze.ai</h1>
            <p className="text-center">
              AI-Powered Retinal Scanning and Stroke Risk Assessment Platform
            </p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>AI-powered retinal analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Stroke risk assessment</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Patient management system</span>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-12 flex flex-col justify-center">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
