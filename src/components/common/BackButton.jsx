import { IoArrowBackOutline } from 'react-icons/io5'
import {  useNavigate } from 'react-router-dom'

const BackButton = ({ path }) => {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(path)}
      className="text-sm mb-6 hover:underline flex items-center gap-1 cursor-pointer"
      style={{ color: '#2c4d14' }}
    >
      <IoArrowBackOutline />
        Retour
    </button>
  )
}

export default BackButton
