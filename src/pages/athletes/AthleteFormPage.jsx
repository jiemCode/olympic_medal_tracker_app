import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { athleteService } from '../../api/athleteService'
import { paysService } from '../../api/paysService'

const INITIAL_FORM = {
  nom: '', prenom: '', dateNaissance: '', discipline: '', paysId: '',
}

const AthleteFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState(INITIAL_FORM)
  const [pays, setPays] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPays = async() => {
      try {
        const res = await paysService.getAll({ page: 0, size: 100, sortBy: 'nom', direction: 'asc' })
        setPays(res.data.contenu)
      } catch {
        toast.error('Impossible de charger les pays')
      }
    }
    fetchPays()

    if (!isEdit) return
    const fetchAthlete = async() => {
      try {
        const res = await athleteService.getById(id)
        const a = res.data
        setForm({
          nom: a.nom,
          prenom: a.prenom,
          dateNaissance: a.dateNaissance,
          discipline: a.discipline,
          paysId: a.paysId,
        })
      } catch {
        toast.error('Athlète introuvable')
        navigate('/athletes')
      }
    }
    fetchAthlete()
  }, [id])

  const validate = () => {
    const errs = {}
    if (!form.nom.trim())           errs.nom           = 'Le nom est requis'
    if (!form.prenom.trim())        errs.prenom        = 'Le prénom est requis'
    if (!form.dateNaissance)        errs.dateNaissance = 'La date de naissance est requise'
    if (!form.discipline.trim())    errs.discipline    = 'La discipline est requise'
    if (!form.paysId)               errs.paysId        = 'Le pays est requis'
    return errs
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const payload = { ...form, paysId: Number(form.paysId) }
      if (isEdit) {
        await athleteService.update(id, payload)
        toast.success('Athlète mis à jour !')
      } else {
        await athleteService.create(payload)
        toast.success('Athlète créé !')
      }
      navigate('/athletes')
    } catch (err) {
      const status = err.response?.status
      if (status === 400) setErrors(err.response.data.details ?? {})
      else if (status === 404) toast.error(err.response.data.message)
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
        style={{ borderColor: errors[name] ? '#c0392b' : '#2c4d14' }}
      />
      {errors[name] && (
        <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errors[name]}</p>
      )}
    </div>
  )

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => navigate('/athletes')}
        className="text-sm mb-6 hover:underline flex items-center gap-1"
        style={{ color: '#2c4d14' }}
      >
        ← Retour aux athlètes
      </button>

      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#2c4d14' }}>
          {isEdit ? 'Modifier l\'athlète' : 'Nouvel athlète'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field name="nom"     label="Nom"             placeholder="ex: Faye" />
          <Field name="prenom"  label="Prénom"          placeholder="ex: Mbaye" />
          <Field name="dateNaissance" label="Date de naissance" type="date" />
          <Field name="discipline"   label="Discipline"  placeholder="ex: Lutte" />

          {/* Sélecteur pays */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2c4d14' }}>
              Pays
            </label>
            <select
              value={form.paysId}
              onChange={(e) => {
                setForm({ ...form, paysId: e.target.value })
                setErrors({ ...errors, paysId: null })
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: errors.paysId ? '#c0392b' : '#2c4d14' }}
            >
              <option value="">Sélectionner un pays</option>
              {pays.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.drapeau} {p.nom}
                </option>
              ))}
            </select>
            {errors.paysId && (
              <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errors.paysId}</p>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate('/athletes')}
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

export default AthleteFormPage
