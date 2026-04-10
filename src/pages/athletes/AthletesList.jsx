import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { athleteService } from '../../api/athleteService'
import { paysService } from '../../api/paysService'
import useAuth from '../../hooks/useAuth'
import { usePagination } from '../../hooks/usePagination'
import Spinner from '../../components/common/Spinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import ConfirmModal from '../../components/common/ConfirmModal'
import PaginatedTable from '../../components/common/PaginatedTable'
import { GiThrowingBall } from 'react-icons/gi'
import ListPageTitle from '../../components/common/ListPageTitle'
import TableSortIcon from '../../components/common/TableSortIcon'

const AthletesList = () => {
  const [data, setData] = useState({ contenu: [], totalPages: 0, totalElements: 0 })
  const [pays, setPays] = useState([])
  const [filterPays, setFilterPays] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { page, sortBy, direction, setPage, toggleSort, params } = usePagination(10, 'nom')

  useEffect(() => {
    const fetchPays = async() => {
      try {
        const res = await paysService.getAll({ page: 0, size: 25, sortBy: 'nom', direction: 'asc' })
        setPays(res.data.contenu)
      } catch { /* */ }
    }
    fetchPays()
  }, [])

  const fetchAthletes = useCallback(async() => {
    setLoading(true)
    setError(null)
    try {
      let res
      if (filterPays) {
        const filtered = await athleteService.getByPays(filterPays)
        setData({ contenu: filtered.data, totalPages: 1, totalElements: filtered.data.length })
        return
      }
      res = await athleteService.getAll(params)
      setData(res.data)
    } catch {
      setError('Impossible de charger les athlètes')
    } finally {
      setLoading(false)
    }
  }, [params, filterPays])

  useEffect(() => { fetchAthletes() }, [fetchAthletes])

  const handleDelete = async() => {
    try {
      await athleteService.delete(deleteId)
      toast.success('Athlète supprimé')
      setDeleteId(null)
      fetchAthletes()
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }

  const SortIcon = ({ field }) => {
    return <TableSortIcon field={field} sortBy={sortBy} direction={direction} />
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <ListPageTitle
          title='Athlètes'
          data={`Total ${data.totalElements}`}
          icon={GiThrowingBall}
        />
        {isAuthenticated && (
          <button
            onClick={() => navigate('/athletes/nouveau')}
            className="text-white text-sm px-4 py-2 rounded-lg font-medium hover:opacity-90"
            style={{ backgroundColor: '#f58e03' }}
          >
            + Ajouter un athlète
          </button>
        )}
      </div>

      {/* Filtre par pays */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex items-center gap-3">
        <label className="text-sm font-medium" style={{ color: '#2c4d14' }}>
          Filtrer par pays :
        </label>
        <select
          value={filterPays}
          onChange={(e) => { setFilterPays(e.target.value); setPage(0) }}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none flex-1 max-w-xs"
          style={{ borderColor: '#2c4d14' }}
        >
          <option value="">Tous les pays</option>
          {pays.map((p) => (
            <option key={p.id} value={p.id}>
              {p.drapeau} {p.nom}
            </option>
          ))}
        </select>
        {filterPays && (
          <button
            onClick={() => setFilterPays('')}
            className="text-xs px-3 py-1 rounded border"
            style={{ borderColor: '#2c4d14', color: '#2c4d14' }}
          >
            Effacer
          </button>
        )}
      </div>

      {loading && <Spinner />}
      {error   && <ErrorMessage message={error} onRetry={fetchAthletes} />}

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
                    onClick={() => toggleSort('prenom')}
                  >
                    Prénom <SortIcon field="prenom" />
                  </th>
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:opacity-80"
                    onClick={() => toggleSort('discipline')}
                  >
                    Discipline <SortIcon field="discipline" />
                  </th>
                  <th className="px-4 py-3 text-left">Pays</th>
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:opacity-80"
                    onClick={() => toggleSort('dateNaissance')}
                  >
                    Date naissance <SortIcon field="dateNaissance" />
                  </th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.contenu.map((athlete, i) => (
                  <tr
                    key={athlete.id}
                    className="border-b transition-colors"
                    style={{ backgroundColor: i % 2 === 0 ? 'white' : '#fdf9f9' }}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="font-medium cursor-pointer hover:underline"
                        style={{ color: '#2c4d14' }}
                        onClick={() => navigate(`/athletes/${athlete.id}`)}
                      >
                        {athlete.nom}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{athlete.prenom}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ backgroundColor: '#dde35f', color: '#2c4d14' }}
                      >
                        {athlete.discipline}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded font-medium text-white"
                        style={{ backgroundColor: '#2c4d14' }}
                      >
                        {athlete.paysCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{athlete.dateNaissance}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/athletes/${athlete.id}`)}
                          className="text-xs px-3 py-1 rounded border font-medium"
                          style={{ borderColor: '#2c4d14', color: '#2c4d14' }}
                        >
                          Détail
                        </button>
                        {isAuthenticated && (
                          <>
                            <button
                              onClick={() => navigate(`/athletes/${athlete.id}/modifier`)}
                              className="text-xs px-3 py-1 rounded font-medium text-white"
                              style={{ backgroundColor: '#2c4d14' }}
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => setDeleteId(athlete.id)}
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
                <p className="text-4xl mb-2">🏃</p>
                <p>Aucun athlète trouvé</p>
              </div>
            )}
          </div>
        </PaginatedTable>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        message="Confirmer la suppression de cet athlète ?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

export default AthletesList
