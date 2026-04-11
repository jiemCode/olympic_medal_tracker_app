import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { medailleService } from '../../api/medailleService'
import useAuth from '../../hooks/useAuth'
import { usePagination } from '../../hooks/usePagination'
import Spinner from '../../components/common/Spinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import ConfirmModal from '../../components/common/ConfirmModal'
import PaginatedTable from '../../components/common/PaginatedTable'
import ListPageTitle from '../../components/common/ListPageTitle'
import { FaMedal } from 'react-icons/fa6'
import { TYPE_STYLE } from '../../constants/constants'
import TableSortIcon from '../../components/common/TableSortIcon'

const MedaillesList = () => {
  const [data, setData] = useState({ contenu: [], totalPages: 0, totalElements: 0 })
  const [filterType, setFilterType] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { page, sortBy, direction, setPage, toggleSort, params } = usePagination(10, 'dateObtention')

  const fetchMedailles = useCallback(async() => {
    setLoading(true)
    setError(null)
    try {
      const res = await medailleService.getAll(params)
      let contenu = res.data.contenu
      if (filterType) contenu = contenu.filter((m) => m.type === filterType)
      setData({ ...res.data, contenu })
    } catch {
      setError('Impossible de charger les médailles')
    } finally {
      setLoading(false)
    }
  }, [filterType, params])

  useEffect(() => { fetchMedailles() }, [page, sortBy, direction, filterType, fetchMedailles])

  const handleDelete = async() => {
    try {
      await medailleService.delete(deleteId)
      toast.success('Médaille supprimée')
      setDeleteId(null)
      fetchMedailles()
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }

  const SortIcon = ({ field }) => {
    return <TableSortIcon field={field} sortBy={sortBy} direction={direction} />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <ListPageTitle
          title='Médailles'
          data={`Total ${data.totalElements}`}
          icon={FaMedal}
        />
        {isAuthenticated && (
          <button
            onClick={() => navigate('/medailles/attribuer')}
            className="text-white text-sm px-4 py-2 rounded-lg font-medium hover:opacity-90"
            style={{ backgroundColor: '#f58e03' }}
          >
            + Attribuer une médaille
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium" style={{ color: '#2c4d14' }}>Type :</span>
        {['', 'OR', 'ARGENT', 'BRONZE'].map((type) => (
          <button
            key={type}
            onClick={() => { setFilterType(type); setPage(0) }}
            className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
            style={
              filterType === type
                ? { backgroundColor: '#2c4d14', color: 'white', borderColor: '#2c4d14' }
                : { backgroundColor: 'white', color: '#2c4d14', borderColor: '#2c4d14' }
            }
          >
            {type === '' ? 'Toutes' : `${TYPE_STYLE[type].icon} ${type}`}
          </button>
        ))}
      </div>

      {loading && <Spinner />}
      {error   && <ErrorMessage message={error} onRetry={fetchMedailles} />}

      {!loading && !error && (
        <PaginatedTable
          totalPages={data.totalPages}
          pageActuelle={page}
          onPageChange={setPage}
        >
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#2c4d14' }} className="text-white">
                  <th className="px-4 py-3 text-center w-24">Médaille</th>
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:opacity-80"
                    onClick={() => toggleSort('athlete')}
                  >
                    Athlète <SortIcon field="athlete" />
                  </th>
                  <th className="px-4 py-3 text-left">Pays</th>
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:opacity-80"
                    onClick={() => toggleSort('competition')}
                  >
                    Compétition <SortIcon field="competition" />
                  </th>
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:opacity-80"
                    onClick={() => toggleSort('dateObtention')}
                  >
                    Date <SortIcon field="dateObtention" />
                  </th>
                  {isAuthenticated && (
                    <th className="px-4 py-3 text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.contenu.map((m, i) => {
                  const style = TYPE_STYLE[m.type] ?? {}
                  return (
                    <tr
                      key={m.id}
                      className="border-b transition-colors"
                      style={{ backgroundColor: i % 2 === 0 ? 'white' : '#fdf9f9' }}
                    >
                      <td className="px-4 py-3 w-1/6 text-left">
                        <span
                          className="text-xs px-3 py-1 rounded-full font-bold"
                          style={{ backgroundColor: style.bg, color: style.color }}
                        >
                          {style.icon} {m.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: '#2c4d14' }}>
                        {m.athleteNom}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{m.paysNom}</td>
                      <td className="px-4 py-3 text-gray-600">{m.competitionNom}</td>
                      <td className="px-4 py-3 text-gray-500">{m.dateObtention}</td>
                      {isAuthenticated && (
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => navigate(`/medailles/attribuer?edit=${m.id}`)}
                              className="text-xs px-3 py-1 rounded font-medium text-white"
                              style={{ backgroundColor: '#2c4d14' }}
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => setDeleteId(m.id)}
                              className="text-xs px-3 py-1 rounded font-medium text-white"
                              style={{ backgroundColor: '#c0392b' }}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {data.contenu.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-2">🥇</p>
                <p>Aucune médaille trouvée</p>
              </div>
            )}
          </div>
        </PaginatedTable>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        message="Confirmer la suppression de cette médaille ?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

export default MedaillesList
