import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { paysService } from '../../api/paysService'
import { classementService } from '../../api/classementService'
import { athleteService } from '../../api/athleteService'
import useAuth from '../../hooks/useAuth'
import Spinner from '../../components/common/Spinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const StatCard = ({ label, value, color }) => (
  <div className="bg-white rounded-xl shadow p-5 text-center">
    <p className="text-3xl font-bold" style={{ color }}>{value}</p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
)

const PaysDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [pays, setPays] = useState(null)
  const [stats, setStats] = useState(null)
  const [athletes, setAthletes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async() => {
      setLoading(true)
      setError(null)
      try {
        const [paysRes, statsRes, athletesRes] = await Promise.all([
          paysService.getById(id),
          classementService.getByPays(id),
          athleteService.getByPays(id),
        ])
        setPays(paysRes.data)
        setStats(statsRes.data)
        setAthletes(athletesRes.data)
      } catch {
        setError('Impossible de charger les données de ce pays')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  if (loading) return <Spinner />
  if (error)   return <ErrorMessage message={error} onRetry={() => window.location.reload()} />

  return (
    <div>
      {/* Retour */}
      <button
        onClick={() => navigate('/pays')}
        className="text-sm mb-6 hover:underline flex items-center gap-1"
        style={{ color: '#2c4d14' }}
      >
        ← Retour aux pays
      </button>

      {/* En-tête pays */}
      <div
        className="rounded-xl p-6 mb-6 flex items-center justify-between"
        style={{ backgroundColor: '#f6dcdd' }}
      >
        <div className="flex items-center gap-4">
          <span className="text-6xl">{pays.drapeau}</span>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#2c4d14' }}>{pays.nom}</h1>
            <span
              className="text-sm font-mono px-2 py-0.5 rounded mt-1 inline-block"
              style={{ backgroundColor: '#2c4d14', color: 'white' }}
            >
              {pays.code}
            </span>
          </div>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => navigate(`/pays/${id}/modifier`)}
            className="text-white text-sm px-4 py-2 rounded-lg font-medium hover:opacity-90"
            style={{ backgroundColor: '#f58e03' }}
          >
            Modifier
          </button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="OR" value={stats.or} color="#f58e03" />
          <StatCard label="ARGENT" value={stats.argent} color="#95a5a6" />
          <StatCard label="BRONZE" value={stats.bronze} color="#8B6914" />
          <StatCard label="POINTS" value={stats.points} color="#2c4d14" />
        </div>
      )}

      {/* Athlètes */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: '#f6dcdd' }}>
          <h2 className="font-bold text-lg" style={{ color: '#2c4d14' }}>
            Athlètes ({athletes.length})
          </h2>
        </div>
        {athletes.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>Aucun athlète pour ce pays</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#f6dcdd' }}>
              <tr>
                <th className="px-4 py-3 text-left" style={{ color: '#2c4d14' }}>Nom</th>
                <th className="px-4 py-3 text-left" style={{ color: '#2c4d14' }}>Prénom</th>
                <th className="px-4 py-3 text-left" style={{ color: '#2c4d14' }}>Discipline</th>
                <th className="px-4 py-3 text-center" style={{ color: '#2c4d14' }}>Détail</th>
              </tr>
            </thead>
            <tbody>
              {athletes.map((athlete, i) => (
                <tr key={athlete.id} className="border-b"
                  style={{ backgroundColor: i % 2 === 0 ? 'white' : '#fdf9f9' }}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: '#2c4d14' }}>
                    {athlete.nom}
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
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate(`/athletes/${athlete.id}`)}
                      className="text-xs px-3 py-1 rounded border font-medium"
                      style={{ borderColor: '#2c4d14', color: '#2c4d14' }}
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default PaysDetail
