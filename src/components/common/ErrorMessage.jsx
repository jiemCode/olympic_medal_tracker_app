const ErrorMessage = ({ message = 'Une erreur est survenue', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <p className="font-medium" style={{ color: '#2c4d14' }}>{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-white text-sm px-4 py-2 rounded transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#f58e03' }}
      >
        Réessayer
      </button>
    )}
  </div>
)

export default ErrorMessage
