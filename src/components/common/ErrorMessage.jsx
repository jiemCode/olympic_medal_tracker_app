const ErrorMessage = ({ message = 'Une erreur est survenue', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <p className="text-red-600 font-medium">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
      >
        Réessayer
      </button>
    )}
  </div>
)

export default ErrorMessage
