const ListPageTitle = ({ title, data, icon: Icon, color='#2c4d14' }) => {
  return (
    <div className='flex gap-4'>
      {Icon && <Icon size={64} className="inline" />}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold" style={{ color: color }}>{title}</h1>
        <p className="text-gray-500 text-sm mt-1">{data}</p>
      </div>
    </div>
  )
}

export default ListPageTitle
