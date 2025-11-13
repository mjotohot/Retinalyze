import Sidebar from '../../components/navigations/Sidebar'
import { FaEdit } from 'react-icons/fa'
import ProfileSidebarCard from './ProfileSidebarCard'
import ProfileDetailsForm from './ProfileDetailsForm'
import { useUpdateDoctorData } from '../../hooks/useUpdateDoctor'
import { useFetchDoctorById } from '../../hooks/useFetchDoctorById'
import { useAuthStore } from '../../stores/useAuthStore'
import { useState, useEffect } from 'react'

const Profile = () => {
  // Get current user ID from auth store
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const userId = user?.id

  // Initialize the mutation hooks
  const doctorQuery = useFetchDoctorById(userId)
  const editDoctorMutation = useUpdateDoctorData(userId)

  // Local state for form values
  const [formValues, setFormValues] = useState({
    full_name: '',
    phone_number: '',
    professional_title: '',
    license_number: '',
    clinic_name: '',
    specialization: '',
    years_experience: '',
  })

  // Store original values to compare changes
  const [originalValues, setOriginalValues] = useState({
    full_name: '',
    phone_number: '',
    professional_title: '',
    license_number: '',
    clinic_name: '',
    specialization: '',
    years_experience: '',
  })

  // Prepare fields for mutation
  useEffect(() => {
    if (!profile && !doctorQuery.data) return // run whenever profile OR doctorQuery.data changes
    const prof = profile ?? {} // merge profile and doctor data
    const doc = doctorQuery.data ?? {}
    // set form values
    const data = {
      full_name: prof.full_name || '',
      phone_number: prof.phone_number || '',
      professional_title: doc.professional_title || '',
      license_number: doc.license_number || '',
      clinic_name: doc.clinic_name || '',
      specialization: doc.specialization || '',
      years_experience: doc.years_experience || '',
    }
    setFormValues(data) // set form values
    setOriginalValues(data) // keep original snapshot
  }, [doctorQuery.data, profile])

  // Handle form submission
  const handleSubmitFields = () => {
    const profileFields = {
      // Profile-specific fields
      full_name: formValues.full_name,
      phone_number: formValues.phone_number,
    }
    const doctorFields = {
      // Doctor-specific fields
      professional_title: formValues.professional_title,
      license_number: formValues.license_number,
      clinic_name: formValues.clinic_name,
      specialization: formValues.specialization,
      years_experience: formValues.years_experience,
    }
    editDoctorMutation.mutate(
      { profileFields, doctorFields }, // Call the mutation
      {
        onSuccess: ({ profData, docData }) => {
          setFormValues({
            full_name: profData.full_name || '',
            phone_number: profData.phone_number || '',
            professional_title: docData?.professional_title || '',
            license_number: docData?.license_number || '',
            clinic_name: docData?.clinic_name || '',
            specialization: docData?.specialization || '',
            years_experience: docData?.years_experience || '',
          })
          setOriginalValues({
            full_name: profData.full_name || '',
            phone_number: profData.phone_number || '',
            professional_title: docData?.professional_title || '',
            license_number: docData?.license_number || '',
            clinic_name: docData?.clinic_name || '',
            specialization: docData?.specialization || '',
            years_experience: docData?.years_experience || '',
          })
        },
      }
    )
  }

  // Check if there are changes between formValues and originalValues
  const hasChanges = () => {
    return Object.keys(formValues).some(
      (key) => formValues[key] !== originalValues[key]
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account information and preferences
              </p>
            </div>
            <button
              className="btn-neutral cursor-pointer btn rounded-lg disabled:bg-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed"
              onClick={handleSubmitFields}
              disabled={!hasChanges()}
            >
              <FaEdit className="h-4 w-4 mr-2" />
              Save Profile
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ProfileSidebarCard />
            <ProfileDetailsForm
              formValues={formValues}
              setFormValues={setFormValues}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
