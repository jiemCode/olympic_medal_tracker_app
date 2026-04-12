import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useAuth from '../hooks/useAuth'
import authService from '../api/authService'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async(e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authService.login(form.username, form.password)
      login(res.data.token, res.data.role)
      toast.success('Connexion réussie !')
      navigate('/classement')
    } catch (err) {
      const status = err.response?.status
      if (status === 401) toast.error('Identifiants incorrects')
      else toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f6dcdd' }}>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-1" style={{ color: '#2c4d14' }}>
          Olympic Medal Tracker
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">Connexion</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2c4d14' }}>
              Nom d'utilisateur
            </label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="darth"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: '#2c4d14' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2c4d14' }}>
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="********"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: '#2c4d14' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="font-medium py-2 rounded-lg transition-opacity disabled:opacity-60 mt-2 text-white"
            style={{ backgroundColor: '#f58e03' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
