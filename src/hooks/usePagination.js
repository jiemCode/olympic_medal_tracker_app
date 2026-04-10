import { useMemo, useState } from 'react'

export const usePagination = (defaultSize = 10, defaultSort = 'nom') => {
  const [page, setPage] = useState(0)
  const [size] = useState(defaultSize)
  const [sortBy, setSortBy] = useState(defaultSort)
  const [direction, setDirection] = useState('asc')

  const toggleSort = (field) => {
    if (sortBy === field) {
      setDirection((d) => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setDirection('asc')
    }
    setPage(0)
  }

  const params = useMemo(() => ({
    page,
    size,
    sortBy,
    direction,
  }), [page, size, sortBy, direction])

  return { page, size, sortBy, direction, setPage, toggleSort, params }
}
