import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { paysService } from '../../api/paysService'

const INITIAL_FORM = { nom: '', code: '', drapeau: '' }

const PaysFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    const fetch = async() => {
      try {
        const res = await paysService.getById(id)
        setForm(res.data)
      } catch {
        toast.error('Pays introuvable')
        navigate('/pays')
      }
    }
    fetch()
  }, [id])

  const validate = () => {
    const errs = {}
    if (!form.nom.trim())  errs.nom  = 'Le nom est requis'
    if (!form.code.trim()) errs.code = 'Le code est requis'
    if (form.code.length > 3 || form.code.length < 2)
      errs.code = 'Le code doit contenir 2 à 3 caractères'
    return errs
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      if (isEdit) {
        await paysService.update(id, form)
        toast.success('Pays mis à jour !')
      } else {
        await paysService.create(form)
        toast.success('Pays créé !')
      }
      navigate('/pays')
    } catch (err) {
      const status = err.response?.status
      if (status === 409) toast.error(err.response.data.message)
      else if (status === 400) setErrors(err.response.data.details ?? {})
      else toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ name, label, placeholder, type = 'text' }) => (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: '#2c4d14' }}>
        {label}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => {
          setForm({ ...form, [name]: e.target.value })
          setErrors({ ...errors, [name]: null })
        }}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
        style={{
          borderColor: errors[name] ? '#c0392b' : '#2c4d14',
          boxShadow: errors[name] ? '0 0 0 2px #fde8e8' : 'none',
        }}
      />
      {errors[name] && (
        <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errors[name]}</p>
      )}
    </div>
  )

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => navigate('/pays')}
        className="text-sm mb-6 hover:underline flex items-center gap-1"
        style={{ color: '#2c4d14' }}
      >
        ← Retour aux pays
      </button>

      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#2c4d14' }}>
          {isEdit ? 'Modifier le pays' : 'Nouveau pays'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field name="nom"     label="Nom du pays"       placeholder="ex: Sénégal" />
          <Field name="code"    label="Code (2-3 lettres)" placeholder="ex: SEN" />
          <Field name="drapeau" label="Drapeau (emoji)"   placeholder="ex: 🇸🇳" />

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate('/pays')}
              className="flex-1 py-2 rounded-lg border text-sm font-medium"
              style={{ borderColor: '#2c4d14', color: '#2c4d14' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60 hover:opacity-90"
              style={{ backgroundColor: '#f58e03' }}
            >
              {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaysFormPage
