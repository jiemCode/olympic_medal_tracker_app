import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useAuth from '../../hooks/useAuth'

const navLinks = [
  { to: '/classement',   label: 'Classement' },
  { to: '/pays',         label: 'Pays' },
  { to: '/athletes',     label: 'Athlètes' },
  { to: '/competitions', label: 'Compétitions' },
  { to: '/medailles',    label: 'Médailles' },
]

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Déconnexion réussie')
    navigate('/classement')
  }

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <NavLink to="/classement" className="text-xl font-bold tracking-wide">
          Olympic Medal Tracker
        </NavLink>

        <div className="flex items-center gap-1 flex-wrap">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-blue-200">Admin</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded transition-colors"
            >
              Connexion
            </NavLink>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar
