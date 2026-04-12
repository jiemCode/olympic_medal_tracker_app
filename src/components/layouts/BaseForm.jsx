import BackButton from '../common/BackButton'

const BaseForm = ({ title, backUrl, handleSubmit, children }) => {
  return (
    <div className="max-w-lg mx-auto">
      <BackButton path={backUrl} />

      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#2c4d14' }}>
          {title}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {children}
        </form>
      </div>
    </div>
  )
}

export default BaseForm
