import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { athleteService } from '../../api/athleteService'
import { paysService } from '../../api/paysService'
import FormField from '../../components/common/FormField'
import SelectField from '../../components/common/SelectField'
import BaseForm from '../../components/layouts/BaseForm'

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
  }, [id, isEdit, navigate])

  const handleChange = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: null }))
  }

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
    <BaseForm title={isEdit ? 'Modifier l\'athlète' : 'Nouvel athlète'} backUrl={'/athletes'} handleSubmit={handleSubmit}>
      <>
        <FormField name="nom"           label="Nom"              value={form.nom}           onChange={handleChange} error={errors.nom}           placeholder="ex: Faye" />
        <FormField name="prenom"        label="Prénom"           value={form.prenom}        onChange={handleChange} error={errors.prenom}        placeholder="ex: Mbaye" />
        <FormField name="dateNaissance" label="Date de naissance" value={form.dateNaissance} onChange={handleChange} error={errors.dateNaissance} type="date" />
        <FormField name="discipline"    label="Discipline"       value={form.discipline}    onChange={handleChange} error={errors.discipline}    placeholder="ex: Lutte" />

        <SelectField name="paysId" label="Pays" value={form.paysId} onChange={handleChange} error={errors.paysId}>
          {pays.map((p) => (
            <option key={p.id} value={p.id}>{p.drapeau} {p.nom}</option>
          ))}
        </SelectField>

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
      </>
    </BaseForm>
  )
}

export default AthleteFormPage
