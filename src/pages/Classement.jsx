import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { classementService } from '../api/classementService'
import Spinner from '../components/common/Spinner'
import ErrorMessage from '../components/common/ErrorMessage'

const TRI_OPTIONS = [
  { value: null,     label: 'Total',  icon: '🏅' },
  { value: 'or',     label: 'Or',     icon: '🥇' },
  { value: 'argent', label: 'Argent', icon: '🥈' },
  { value: 'bronze', label: 'Bronze', icon: '🥉' },
  { value: 'points', label: 'Points', icon: '⭐' },
]

const PODIUM_BG = {
  0: { backgroundColor: '#fff8e1', borderLeft: '4px solid #f58e03' },
  1: { backgroundColor: '#f6dcdd', borderLeft: '4px solid #e0b0b5' },
  2: { backgroundColor: '#fef3e2', borderLeft: '4px solid #dde35f' },
}

const RANG_BADGE = { 0: '🥇', 1: '🥈', 2: '🥉' }

const Classement = () => {
  const [data, setData] = useState([])
  const [tri, setTri] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const fetchClassement = async() => {
    setLoading(true)
    setError(null)
    try {
      const res = await classementService.getAll(tri)
      setData(res.data)
    } catch {
      setError('Impossible de charger le classement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchClassement() }, [tri])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: '#2c4d14' }}>
          🏅 Classement des Nations
        </h1>
        <p className="text-gray-500 text-sm mt-1">{data.length} pays</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TRI_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setTri(opt.value)}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
            style={
              tri === opt.value
                ? { backgroundColor: '#2c4d14', color: 'white', borderColor: '#2c4d14' }
                : { backgroundColor: 'white', color: '#2c4d14', borderColor: '#2c4d14' }
            }
          >
            {opt.icon} {opt.label}
          </button>
        ))}
      </div>

      {loading && <Spinner />}
      {error   && <ErrorMessage message={error} onRetry={fetchClassement} />}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#2c4d14', borderLeft: '4px solid #2c4d14' }} className="text-white">
                <th className="px-4 py-3 text-left w-12">Rang</th>
                <th className="px-4 py-3 text-left">Pays</th>
                <th className="px-4 py-3 text-center">🥇 Or</th>
                <th className="px-4 py-3 text-center">🥈 Argent</th>
                <th className="px-4 py-3 text-center">🥉 Bronze</th>
                <th className="px-4 py-3 text-center">Total</th>
                <th className="px-4 py-3 text-center">⭐ Points</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={item.paysCode}
                  onClick={() => navigate(`/pays/${item.paysCode}`)}
                  className="cursor-pointer border-b transition-colors hover:opacity-80"
                  style={PODIUM_BG[index] ?? {}}
                >
                  <td className="px-4 py-3 text-center text-lg">
                    {RANG_BADGE[index] ?? index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.drapeau}</span>
                      <div>
                        <p className="font-medium" style={{ color: '#2c4d14' }}>{item.paysNom}</p>
                        <p className="text-xs text-gray-400">{item.paysCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold" style={{ color: '#f58e03' }}>
                    {item.or}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-gray-500">
                    {item.argent}
                  </td>
                  <td className="px-4 py-3 text-center font-bold" style={{ color: '#8B6914' }}>
                    {item.bronze}
                  </td>
                  <td className="px-4 py-3 text-center font-bold" style={{ color: '#2c4d14' }}>
                    {item.total}
                  </td>
                  <td className="px-4 py-3 text-center font-bold" style={{ color: '#b36e00' }}>
                    {item.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2"></p>
              <p>Classement non disponible</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Classement
