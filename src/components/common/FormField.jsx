const FormField = ({ label, name, value, onChange, error, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium mb-1" style={{ color: '#2c4d14' }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
      style={{ borderColor: error ? '#c0392b' : '#2c4d14' }}
    />
    {error && <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{error}</p>}
  </div>
)

export default FormField
