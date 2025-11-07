import { useAuthStore } from '../../stores/useAuthStore'

const ProfileDetailsForm = ({ formValues, setFormValues }) => {
  // Get current user ID from auth store
  const user = useAuthStore((state) => state.user)

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormValues((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <p className="text-sm text-gray-600">
            Update your personal details and contact information
          </p>
        </div>

        {/* Personal Information Form */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              placeholder="Juan Dela Cruz"
              value={formValues.full_name}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="juandelacruz@hospital.com"
              defaultValue={user?.email}
              className="w-full border rounded-md p-2"
              disabled
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone_number"
                placeholder="(123) 456-7890"
                value={formValues.phone_number}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="title">
                Professional Title
              </label>
              <input
                id="professional_title"
                placeholder="Ophthalmologist, PhD"
                value={formValues.professional_title}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Professional Information</h3>
          <p className="text-sm text-gray-600">
            Your medical credentials and specializations
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="license">
                Medical License Number
              </label>
              <input
                id="license_number"
                placeholder="MD-12345-PH"
                value={formValues.license_number}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="hospital">
                Hospital/Clinic Name
              </label>
              <input
                id="clinic_name"
                placeholder="Manila General Hospital"
                value={formValues.clinic_name}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="specialization">
              Specialization
            </label>
            <input
              id="specialization"
              placeholder="Retinal Diseases, Diabetic Retinopathy"
              value={formValues.specialization}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="experience">
              Years of Experience
            </label>
            <input
              id="years_experience"
              placeholder="15 years"
              value={formValues.years_experience}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProfileDetailsForm
