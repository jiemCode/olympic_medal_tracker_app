import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { athleteService } from '../../api/athleteService'
import { medailleService } from '../../api/medailleService'
import useAuth from '../../hooks/useAuth'
import Spinner from '../../components/common/Spinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const TYPE_STYLE = {
  OR:     { bg: '#fff8e1', color: '#f58e03', icon: '🥇' },
  ARGENT: { bg: '#f5f5f5', color: '#95a5a6', icon: '🥈' },
  BRONZE: { bg: '#fef3e2', color: '#8B6914', icon: '🥉' },
}

const AthleteDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [athlete, setAthlete] = useState(null)
  const [medailles, setMedailles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async() => {
      setLoading(true)
      setError(null)
      try {
        const [athleteRes, medaillesRes] = await Promise.all([
          athleteService.getById(id),
          medailleService.getByAthlete(id),
        ])
        setAthlete(athleteRes.data)
        setMedailles(medaillesRes.data)
      } catch {
        setError('Impossible de charger les données de cet athlète')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  if (loading) return <Spinner />
  if (error)   return <ErrorMessage message={error} onRetry={() => window.location.reload()} />

  const orCount     = medailles.filter((m) => m.type === 'OR').length
  const argentCount = medailles.filter((m) => m.type === 'ARGENT').length
  const bronzeCount = medailles.filter((m) => m.type === 'BRONZE').length

  return (
    <div>
      <button
        onClick={() => navigate('/athletes')}
        className="text-sm mb-6 hover:underline flex items-center gap-1"
        style={{ color: '#2c4d14' }}
      >
        ← Retour aux athlètes
      </button>

      {/* En-tête athlète */}
      <div
        className="rounded-xl p-6 mb-6 flex items-center justify-between"
        style={{ backgroundColor: '#f6dcdd' }}
      >
        <div className="flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ backgroundColor: '#2c4d14' }}
          >
            {athlete.nom.charAt(0)}{athlete.prenom.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#2c4d14' }}>
              {athlete.nom} {athlete.prenom}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ backgroundColor: '#dde35f', color: '#2c4d14' }}
              >
                {athlete.discipline}
              </span>
              <span
                className="text-xs px-2 py-1 rounded font-medium text-white"
                style={{ backgroundColor: '#2c4d14' }}
              >
                {athlete.paysCode}
              </span>
              <span className="text-sm text-gray-500">
                {athlete.dateNaissance}
              </span>
            </div>
          </div>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => navigate(`/athletes/${id}/modifier`)}
            className="text-white text-sm px-4 py-2 rounded-lg font-medium hover:opacity-90"
            style={{ backgroundColor: '#f58e03' }}
          >
            Modifier
          </button>
        )}
      </div>

      {/* Compteurs médailles */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'OR',     value: orCount,     color: '#f58e03' },
          { label: 'ARGENT', value: argentCount,  color: '#95a5a6' },
          { label: 'BRONZE', value: bronzeCount,  color: '#8B6914' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Liste médailles */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: '#f6dcdd' }}>
          <h2 className="font-bold text-lg" style={{ color: '#2c4d14' }}>
            Palmarès ({medailles.length} médaille{medailles.length > 1 ? 's' : ''})
          </h2>
        </div>

        {medailles.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>Aucune médaille pour cet athlète</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#f6dcdd' }}>
              <tr>
                <th className="px-4 py-3 text-left" style={{ color: '#2c4d14' }}>Médaille</th>
                <th className="px-4 py-3 text-left" style={{ color: '#2c4d14' }}>Compétition</th>
                <th className="px-4 py-3 text-left" style={{ color: '#2c4d14' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {medailles.map((m, i) => {
                const style = TYPE_STYLE[m.type] ?? {}
                return (
                  <tr
                    key={m.id}
                    className="border-b"
                    style={{ backgroundColor: i % 2 === 0 ? 'white' : '#fdf9f9' }}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-3 py-1 rounded-full font-bold"
                        style={{ backgroundColor: style.bg, color: style.color }}
                      >
                        {style.icon} {m.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: '#2c4d14' }}>
                      {m.competitionNom}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{m.dateObtention}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AthleteDetail
