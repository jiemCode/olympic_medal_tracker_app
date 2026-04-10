const ListPageTitle = ({ title, data, icon: Icon, color='#2c4d14' }) => {
  return <div>
    <div className='flex gap-4'>
      {Icon && <Icon size={32} className="inline" />}
      <h1 className="text-3xl font-bold" style={{ color: color }}>{title}</h1>
    </div>
    <p className="text-gray-500 text-sm mt-1">{data}</p>
  </div>
}

export default ListPageTitle
