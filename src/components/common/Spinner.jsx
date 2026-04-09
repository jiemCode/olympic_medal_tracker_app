const Spinner = ({ text = 'Chargement...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div
      className="w-12 h-12 border-4 rounded-full animate-spin"
      style={{ borderColor: '#f6dcdd', borderTopColor: '#2c4d14' }}
    />
    <p className="text-sm" style={{ color: '#2c4d14' }}>{text}</p>
  </div>
)

export default Spinner
