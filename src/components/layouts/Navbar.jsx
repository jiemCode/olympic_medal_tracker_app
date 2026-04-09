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
    <nav style={{ backgroundColor: '#2c4d14' }} className="shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <NavLink to="/classement" className="text-xl font-bold text-white tracking-wide">
          Olympic Medal Tracker
        </NavLink>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-white hover:text-primary hover:bg-accent'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: '#dde35f', color: '#2c4d14' } : {}}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm" style={{ color: '#dde35f' }}>Admin</span>
              <button
                onClick={handleLogout}
                style={{ backgroundColor: '#f58e03' }}
                className="hover:opacity-90 text-white text-sm px-4 py-2 rounded transition-opacity font-medium"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              style={{ backgroundColor: '#f58e03' }}
              className="hover:opacity-90 text-white text-sm px-4 py-2 rounded transition-opacity font-medium"
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
