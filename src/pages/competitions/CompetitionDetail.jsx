import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { competitionService } from '../../api/competitionService'
import { medailleService } from '../../api/medailleService'
import useAuth from '../../hooks/useAuth'
import Spinner from '../../components/common/Spinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { STATUT_STYLE, TYPE_STYLE } from '../../constants/constants'
import BackButton from '../../components/common/BackButton'

const CompetitionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [competition, setCompetition] = useState(null)
  const [medailles, setMedailles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async() => {
      setLoading(true)
      setError(null)
      try {
        const [compRes, medRes] = await Promise.all([
          competitionService.getById(id),
          medailleService.getByCompetition(id),
        ])
        setCompetition(compRes.data)
        setMedailles(medRes.data)
      } catch {
        setError('Impossible de charger les données de cette compétition')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  if (loading) return <Spinner />
  if (error)   return <ErrorMessage message={error} onRetry={() => window.location.reload()} />

  const statut  = STATUT_STYLE[competition.statut] ?? {}
  const podium  = ['OR', 'ARGENT', 'BRONZE'].map((type) => ({
    type,
    medaille: medailles.find((m) => m.type === type),
    style: TYPE_STYLE[type],
  }))

  return (
    <div>
      <BackButton path="/competitions" />

      {/* En-tête */}
      <div
        className="rounded-xl p-6 mb-6 flex items-center justify-between"
        style={{ backgroundColor: '#f6dcdd' }}
      >
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#2c4d14' }}>
            {competition.nom}
          </h1>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span
              className="text-xs px-2 py-1 rounded-full font-medium"
              style={{ backgroundColor: '#dde35f', color: '#2c4d14' }}
            >
              {competition.discipline}
            </span>
            <span
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: statut.bg, color: statut.color }}
            >
              {statut.label}
            </span>
            <span className="text-sm text-gray-500">
              {competition.dateDebut}
              {competition.dateFin !== competition.dateDebut && ` → ${competition.dateFin}`}
            </span>
          </div>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => navigate(`/competitions/${id}/modifier`)}
            className="text-white text-sm px-4 py-2 rounded-lg font-medium hover:opacity-90"
            style={{ backgroundColor: '#f58e03' }}
          >
            Modifier
          </button>
        )}
      </div>

      {/* Podium */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4" style={{ color: '#2c4d14' }}>🏅 Podium</h2>
        <div className="grid grid-cols-3 gap-4">
          {podium.map(({ type, medaille, style }) => (
            <div
              key={type}
              className="rounded-xl p-5 text-center shadow"
              style={{ backgroundColor: style.bg }}
            >
              <p className="text-4xl mb-2">{style.icon}</p>
              {medaille ? (
                <>
                  <p
                    className="font-bold text-sm cursor-pointer hover:underline"
                    style={{ color: style.color }}
                    onClick={() => navigate(`/athletes/${medaille.athleteNom}`)}
                  >
                    {medaille.athleteNom}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{medaille.paysNom}</p>
                </>
              ) : (
                <p className="text-sm text-gray-400">—</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toutes les médailles */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: '#f6dcdd' }}>
          <h2 className="font-bold text-lg" style={{ color: '#2c4d14' }}>
            Médailles attribuées ({medailles.length})
          </h2>
        </div>

        {medailles.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>Aucune médaille attribuée pour cette compétition</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#f6dcdd' }}>
              <tr>
                <th className="px-4 py-3 text-left" style={{ color: '#2c4d14' }}>Médaille</th>
                <th className="px-4 py-3 text-left" style={{ color: '#2c4d14' }}>Athlète</th>
                <th className="px-4 py-3 text-left" style={{ color: '#2c4d14' }}>Pays</th>
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
                      {m.athleteNom}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{m.paysNom}</td>
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

export default CompetitionDetail
