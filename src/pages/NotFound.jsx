import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-32 gap-4">
    <h1 className="text-3xl font-bold text-gray-800">Page introuvable</h1>
    <p className="text-gray-500">La page que vous cherchez n'existe plus.</p>
    <Link
      to="/classement"
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mt-2"
    >
      Retour
    </Link>
  </div>
)

export default NotFound
