export const addPatientInputs = [
  {
    label: 'Email',
    id: 'email',
    type: 'email',
    placeholder: 'sample@gmail.com',
    required: true,
  },
  {
    label: 'Name',
    id: 'full_name',
    type: 'text',
    placeholder: "Enter patient's name",
    required: true,
  },
  {
    label: 'Age',
    id: 'age',
    type: 'number',
    placeholder: "Enter patient's age",
    required: true,
  },
  {
    label: 'Sex',
    id: 'sex',
    type: 'select',
    options: [
      { value: '0', label: 'Male' },
      { value: '1', label: 'Female' },
    ],
    placeholder: 'Select sex',
    required: true,
  },
  {
    label: 'Phone',
    id: 'phone_number',
    type: 'number',
    placeholder: 'e.g. 09xxxxxxxxx',
    required: true,
  },
  {
    label: 'Address',
    id: 'address',
    type: 'text',
    placeholder: "Enter patient's address",
  },
  {
    label: 'Diabetic?',
    id: 'diabetic',
    type: 'select',
    options: [
      { value: '1', label: 'Yes' },
      { value: '0', label: 'No' },
    ],
    placeholder: 'Select option',
  },
  {
    label: 'Smoking?',
    id: 'smoking',
    type: 'select',
    options: [
      { value: '1', label: 'Yes' },
      { value: '0', label: 'No' },
    ],
    placeholder: 'Select option',
  },
  {
    label: 'Hypertensive?',
    id: 'hypertension',
    type: 'select',
    options: [
      { value: '1', label: 'Yes' },
      { value: '0', label: 'No' },
    ],
    placeholder: 'Select option',
  },
  {
    label: 'Stroke History',
    id: 'stroke_history',
    type: 'select',
    options: [
      { value: '1', label: 'Yes' },
      { value: '0', label: 'No' },
    ],
    placeholder: 'Select option',
  },
  {
    label: 'BP Systolic',
    id: 'bp_systolic',
    type: 'number',
    placeholder: 'Enter here',
  },
  {
    label: 'BP Diastolic',
    id: 'bp_diastolic',
    type: 'number',
    placeholder: 'Enter here',
  },
]
