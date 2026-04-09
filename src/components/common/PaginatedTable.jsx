const PaginatedTable = ({ totalPages, pageActuelle, onPageChange, children }) => (
  <div>
    {children}

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => onPageChange(pageActuelle - 1)}
          disabled={pageActuelle === 0}
          className="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100"
        >
          ← Précédent
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-1 rounded border text-sm ${
              i === pageActuelle
                ? 'bg-blue-600 text-white border-blue-600'
                : 'hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(pageActuelle + 1)}
          disabled={pageActuelle === totalPages - 1}
          className="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100"
        >
          Suivant →
        </button>
      </div>
    )}
  </div>
)

export default PaginatedTable
