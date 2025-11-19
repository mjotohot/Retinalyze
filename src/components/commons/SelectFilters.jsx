const SelectFilters = ({
  options = [],
  selectedValue,
  onChange,
  placeholder = 'Select an option',
}) => {
  return (
    <select
      className="select border-none rounded-md w-full sm:w-1/3"
      value={selectedValue}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default SelectFilters
