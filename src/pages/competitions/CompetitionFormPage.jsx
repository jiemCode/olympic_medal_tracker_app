import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { competitionService } from '../../api/competitionService'
import { STATUTS } from '../../constants/constants'
import FormField from '../../components/common/FormField'
import BaseForm from '../../components/layouts/BaseForm'

const INITIAL_FORM = {
  nom: '', discipline: '', dateDebut: '', dateFin: '', statut: 'PLANIFIEE',
}

const CompetitionFormPage = () => {
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
        const res = await competitionService.getById(id)
        const c = res.data
        setForm({
          nom: c.nom,
          discipline: c.discipline,
          dateDebut: c.dateDebut,
          dateFin: c.dateFin,
          statut: c.statut,
        })
      } catch {
        toast.error('Compétition introuvable')
        navigate('/competitions')
      }
    }
    fetch()
  }, [id, isEdit, navigate])

  const handleChange = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.nom.trim())        errs.nom        = 'Le nom est requis'
    if (!form.discipline.trim()) errs.discipline  = 'La discipline est requise'
    if (!form.dateDebut)         errs.dateDebut   = 'La date de début est requise'
    if (!form.dateFin)           errs.dateFin     = 'La date de fin est requise'
    if (!form.statut)            errs.statut      = 'Le statut est requis'
    if (form.dateDebut && form.dateFin && form.dateFin < form.dateDebut)
      errs.dateFin = 'La date de fin doit être après la date de début'
    return errs
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      if (isEdit) {
        await competitionService.update(id, form)
        toast.success('Compétition mise à jour !')
      } else {
        await competitionService.create(form)
        toast.success('Compétition créée !')
      }
      navigate('/competitions')
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
        style={{ borderColor: errors[name] ? '#c0392b' : '#2c4d14' }}
      />
      {errors[name] && (
        <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errors[name]}</p>
      )}
    </div>
  )

  return (
    <BaseForm title={isEdit ? 'Modifier la compétition' : 'Nouvelle compétition'} backUrl={'/competitions'} handleSubmit={handleSubmit}>
      <>
        <FormField name="nom"        label="Nom"        value={form.nom}        onChange={handleChange} error={errors.nom}        placeholder="ex: 100m Hommes" />
        <FormField name="discipline" label="Discipline" value={form.discipline} onChange={handleChange} error={errors.discipline} placeholder="ex: Athlétisme" />

        <div className="grid grid-cols-2 gap-4">
          <FormField name="dateDebut" label="Date de début" value={form.dateDebut} onChange={handleChange} error={errors.dateDebut} type="date" />
          <FormField name="dateFin"   label="Date de fin"   value={form.dateFin}   onChange={handleChange} error={errors.dateFin}   type="date" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#2c4d14' }}>
              Statut
          </label>
          <div className="flex gap-2">
            {STATUTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm({ ...form, statut: s })}
                className="flex-1 py-2 rounded-lg text-xs font-medium border transition-all"
                style={
                  form.statut === s
                    ? { backgroundColor: '#2c4d14', color: 'white', borderColor: '#2c4d14' }
                    : { backgroundColor: 'white', color: '#2c4d14', borderColor: '#2c4d14' }
                }
              >
                {s === 'PLANIFIEE' ? 'Planifiée' : s === 'EN_COURS' ? 'En cours' : 'Terminée'}
              </button>
            ))}
          </div>
          {errors.statut && (
            <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errors.statut}</p>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => navigate('/competitions')}
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
      </>
    </BaseForm>
  )
}

export default CompetitionFormPage
