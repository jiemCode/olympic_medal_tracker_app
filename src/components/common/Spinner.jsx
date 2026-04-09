const Spinner = ({ text = 'Chargement...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    <p className="text-gray-500 text-sm">{text}</p>
  </div>
)

export default Spinner
