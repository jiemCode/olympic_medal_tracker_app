import { FaArrowDown, FaArrowsUpDown, FaArrowUp } from 'react-icons/fa6'

const TableSortIcon = ({ field, sortBy, direction }) => {
  if (sortBy !== field) return <FaArrowsUpDown className='inline'/>
  return direction === 'asc' ? <FaArrowUp className='inline' /> : <FaArrowDown className='inline'/>
}

export default TableSortIcon
