import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { competitionService } from '../../api/competitionService'
import useAuth from '../../hooks/useAuth'
import { usePagination } from '../../hooks/usePagination'
import Spinner from '../../components/common/Spinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import ConfirmModal from '../../components/common/ConfirmModal'
import PaginatedTable from '../../components/common/PaginatedTable'
import TableSortIcon from '../../components/common/TableSortIcon'
import { GiTrophyCup } from 'react-icons/gi'
import ListPageTitle from '../../components/common/ListPageTitle'
import { STATUT_STYLE, STATUTS } from '../../constants/constants'

const CompetitionsList = () => {
  const [data, setData] = useState({ contenu: [], totalPages: 0, totalElements: 0 })
  const [filterStatut, setFilterStatut] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { page, sortBy, direction, setPage, toggleSort, params  } = usePagination(10, 'nom')

  const fetchCompetitions = useCallback(async() => {
    setLoading(true)
    setError(null)
    try {
      const res = await competitionService.getAll({
        ...params,
        ...(filterStatut ? { statut: filterStatut } : {}),
      })
      setData(res.data)
    } catch {
      setError('Impossible de charger les compétitions')
    } finally {
      setLoading(false)
    }
  }, [params, filterStatut])

  useEffect(() => { fetchCompetitions() }, [fetchCompetitions])

  const handleDelete = async() => {
    try {
      await competitionService.delete(deleteId)
      toast.success('Compétition supprimée')
      setDeleteId(null)
      fetchCompetitions()
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
          title='Compétitions'
          data={`Total ${data.totalElements}`}
          icon={GiTrophyCup}
        />
        {isAuthenticated && (
          <button
            onClick={() => navigate('/competitions/nouveau')}
            className="text-white text-sm px-4 py-2 rounded-lg font-medium hover:opacity-90"
            style={{ backgroundColor: '#f58e03' }}
          >
            + Ajouter une compétition
          </button>
        )}
      </div>

      {/* Filtre statut */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium" style={{ color: '#2c4d14' }}>Statut :</span>
        {['', ...STATUTS].map((s) => (
          <button
            key={s}
            onClick={() => { setFilterStatut(s); setPage(0) }}
            className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
            style={
              filterStatut === s
                ? { backgroundColor: '#2c4d14', color: 'white', borderColor: '#2c4d14' }
                : { backgroundColor: 'white', color: '#2c4d14', borderColor: '#2c4d14' }
            }
          >
            {s === '' ? 'Tous' : STATUT_STYLE[s]?.label}
          </button>
        ))}
      </div>

      {loading && <Spinner />}
      {error   && <ErrorMessage message={error} onRetry={fetchCompetitions} />}

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
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:opacity-80"
                    onClick={() => toggleSort('nom')}
                  >
                    Nom <SortIcon field="nom" />
                  </th>
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:opacity-80"
                    onClick={() => toggleSort('discipline')}
                  >
                    Discipline <SortIcon field="discipline" />
                  </th>
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:opacity-80"
                    onClick={() => toggleSort('dateDebut')}
                  >
                    Date <SortIcon field="dateDebut" />
                  </th>
                  <th className="px-4 py-3 text-center">Statut</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.contenu.map((comp, i) => {
                  const statut = STATUT_STYLE[comp.statut] ?? {}
                  return (
                    <tr
                      key={comp.id}
                      className="border-b transition-colors"
                      style={{ backgroundColor: i % 2 === 0 ? 'white' : '#fdf9f9' }}
                    >
                      <td className="px-4 py-3">
                        <span
                          className="font-medium cursor-pointer hover:underline"
                          style={{ color: '#2c4d14' }}
                          onClick={() => navigate(`/competitions/${comp.id}`)}
                        >
                          {comp.nom}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ backgroundColor: '#dde35f', color: '#2c4d14' }}
                        >
                          {comp.discipline}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {comp.dateDebut}
                        {comp.dateFin !== comp.dateDebut && ` → ${comp.dateFin}`}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ backgroundColor: statut.bg, color: statut.color }}
                        >
                          {statut.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/competitions/${comp.id}`)}
                            className="text-xs px-3 py-1 rounded border font-medium"
                            style={{ borderColor: '#2c4d14', color: '#2c4d14' }}
                          >
                            Détail
                          </button>
                          {isAuthenticated && (
                            <>
                              <button
                                onClick={() => navigate(`/competitions/${comp.id}/modifier`)}
                                className="text-xs px-3 py-1 rounded font-medium text-white"
                                style={{ backgroundColor: '#2c4d14' }}
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => setDeleteId(comp.id)}
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
                  )
                })}
              </tbody>
            </table>

            {data.contenu.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p>Aucune compétition trouvée</p>
              </div>
            )}
          </div>
        </PaginatedTable>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        message="Confirmer la suppression de cette compétition ?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

export default CompetitionsList
