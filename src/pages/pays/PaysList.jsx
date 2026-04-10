import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { paysService } from '../../api/paysService'
import useAuth from '../../hooks/useAuth'
import { usePagination } from '../../hooks/usePagination'
import Spinner from '../../components/common/Spinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import ConfirmModal from '../../components/common/ConfirmModal'
import PaginatedTable from '../../components/common/PaginatedTable'
import { FaArrowDown, FaArrowsUpDown, FaArrowUp, FaEarthAfrica } from 'react-icons/fa6'
import ListPageTitle from '../../components/common/ListPageTitle'

const PaysList = () => {
  const [data, setData] = useState({ contenu: [], totalPages: 0, totalElements: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { page, sortBy, direction, setPage, toggleSort } = usePagination(10, 'nom')

  const fetchPays = useCallback(async() => {
    setLoading(true)
    setError(null)
    try {
      const res = await paysService.getAll({ page, sortBy, direction, size: 10 })
      setData(res.data)
    } catch {
      setError('Impossible de charger les pays')
    } finally {
      setLoading(false)
    }
  }, [page, sortBy, direction])

  useEffect(() => { fetchPays() }, [fetchPays])

  const handleDelete = async() => {
    try {
      await paysService.delete(deleteId)
      toast.success('Pays supprimé')
      setDeleteId(null)
      fetchPays()
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }

  const SortIcon = ({ field }) => {
    // if (sortBy !== field) return <span className="text-gray-300 ml-1">↕</span>
    if (sortBy !== field) return <FaArrowsUpDown className='inline'/>
    // return <span className="ml-1" style={{ color: '#dde35f' }}>{direction === 'asc' && <FaArrowUp />}</span>
    return direction === 'asc' ? <FaArrowUp className='inline' /> : <FaArrowDown className='inline'/>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <ListPageTitle
          title='Pays'
          data={`Total ${data.totalElements}`}
          icon={FaEarthAfrica}
        />
        {isAuthenticated && (
          <button
            onClick={() => navigate('/pays/nouveau')}
            className="text-white text-sm px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#f58e03' }}
          >
            + Ajouter un pays
          </button>
        )}
      </div>

      {loading && <Spinner />}
      {error && <ErrorMessage message={error} onRetry={fetchPays} />}

      {!loading && !error && (
        <PaginatedTable
          totalPages={data.totalPages}
          pageActuelle={page}
          onPageChange={setPage}
        >
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr style={{ backgroundColor: '#2c4d14' }} className="text-white">
                  <th
                    className="px-4 py-3 w-4/12 text-left cursor-pointer hover:opacity-80"
                    onClick={() => toggleSort('nom')}
                  >
                    Pays <SortIcon field="nom" />
                  </th>
                  <th
                    className="px-4 py-3 w-2/12 text-center cursor-pointer hover:opacity-80"
                    onClick={() => toggleSort('code')}
                  >
                    Code <SortIcon field="code" />
                  </th>
                  <th className="px-4 py-3 w-2/12 text-center">Drapeau</th>
                  <th className="px-4 py-3 w-4/12 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.contenu.map((pays, i) => (
                  <tr
                    key={pays.id}
                    className="border-b transition-colors"
                    style={{ backgroundColor: i % 2 === 0 ? 'white' : '#fdf9f9' }}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="font-medium cursor-pointer hover:underline"
                        style={{ color: '#2c4d14' }}
                        onClick={() => navigate(`/pays/${pays.id}`)}
                      >
                        {pays.nom}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500 font-mono">{pays.code}</td>
                    <td className="px-4 py-3 text-center text-2xl">{pays.drapeau}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-left justify-center gap-2">
                        <button
                          onClick={() => navigate(`/pays/${pays.id}`)}
                          className="text-xs px-3 py-1 rounded border font-medium"
                          style={{ borderColor: '#2c4d14', color: '#2c4d14' }}
                        >
                          Détail
                        </button>
                        {isAuthenticated && (
                          <>
                            <button
                              onClick={() => navigate(`/pays/${pays.id}/modifier`)}
                              className="text-xs px-3 py-1 rounded font-medium text-white"
                              style={{ backgroundColor: '#2c4d14' }}
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => setDeleteId(pays.id)}
                              className="text-xs px-3 py-1 rounded font-medium text-white"
                              style={{ backgroundColor: '#c0392b' }}
                            >
                              Supprimer
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data.contenu.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p>Aucun pays trouvé</p>
              </div>
            )}
          </div>
        </PaginatedTable>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        message="Confirmer la suppression de ce pays ?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

export default PaysList
