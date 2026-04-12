import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { medailleService } from '../../api/medailleService'
import { athleteService } from '../../api/athleteService'
import { paysService } from '../../api/paysService'
import { competitionService } from '../../api/competitionService'
import { TYPE_STYLE, TYPES } from '../../constants/constants'
import FormField from '../../components/common/FormField'
import SelectField from '../../components/common/SelectField'
import BaseForm from '../../components/layouts/BaseForm'

const INITIAL_FORM = {
  type: '', dateObtention: '', athleteId: '', paysId: '', competitionId: '',
}

const MedailleFormPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const isEdit = !!editId

  const [form, setForm] = useState(INITIAL_FORM)
  const [athletes, setAthletes] = useState([])
  const [pays, setPays] = useState([])
  const [competitions, setCompetitions] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSelects = async() => {
      try {
        const [athletesRes, paysRes, compsRes] = await Promise.all([
          athleteService.getAll({ page: 0, size: 100, sortBy: 'nom', direction: 'asc' }),
          paysService.getAll({ page: 0, size: 100, sortBy: 'nom', direction: 'asc' }),
          competitionService.getAll({ page: 0, size: 100, sortBy: 'nom', direction: 'asc' }),
        ])
        setAthletes(athletesRes.data.contenu)
        setPays(paysRes.data.contenu)
        setCompetitions(compsRes.data.contenu)
      } catch {
        toast.error('Erreur lors du chargement des données')
      }
    }
    fetchSelects()

    if (!isEdit) return
    const fetchMedaille = async() => {
      try {
        const res = await medailleService.getById(editId)
        const m = res.data
        setForm({
          type: m.type,
          dateObtention: m.dateObtention,
          athleteId: m.athleteId,
          paysId: m.paysId,
          competitionId: m.competitionId,
        })
      } catch {
        toast.error('Médaille introuvable')
        navigate('/medailles')
      }
    }
    fetchMedaille()
  }, [editId, isEdit, navigate])

  const handleChange = (name, value) => {
    if (name === 'athleteId') { handleAthleteChange(value); return }
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: null }))
  }

  const handleAthleteChange = (athleteId) => {
    const athlete = athletes.find((a) => a.id === Number(athleteId))
    setForm((f) => ({
      ...f,
      athleteId,
      paysId: athlete ? String(athlete.paysId) : f.paysId,
    }))
    setErrors((e) => ({ ...e, athleteId: null, paysId: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.type)           errs.type          = 'Le type est requis'
    if (!form.dateObtention)  errs.dateObtention  = 'La date est requise'
    if (!form.athleteId)      errs.athleteId      = 'L\'athlète est requis'
    if (!form.paysId)         errs.paysId         = 'Le pays est requis'
    if (!form.competitionId)  errs.competitionId  = 'La compétition est requise'
    return errs
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const payload = {
        type: form.type,
        dateObtention: form.dateObtention,
        athleteId: Number(form.athleteId),
        paysId: Number(form.paysId),
        competitionId: Number(form.competitionId),
      }

      if (isEdit) {
        await medailleService.update(editId, payload)
        toast.success('Médaille mise à jour !')
      } else {
        await medailleService.create(payload)
        toast.success('Médaille attribuée !')
      }
      navigate('/medailles')
    } catch (err) {
      const status = err.response?.status
      if (status === 400) setErrors(err.response.data.details ?? {})
      else if (status === 404) toast.error(err.response.data.message)
      else toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <BaseForm title={isEdit ? 'Modifier la médaille' : 'Attribuer une médaille'} backUrl={'/medailles'} handleSubmit={handleSubmit}>
      <>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#2c4d14' }}>
              Type de médaille
          </label>
          <div className="flex gap-3">
            {TYPES.map((type) => {
              const style = TYPE_STYLE[type]
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setForm({ ...form, type })
                    setErrors({ ...errors, type: null })
                  }}
                  className="flex-1 py-3 rounded-lg text-sm font-bold border-2 transition-all"
                  style={
                    form.type === type
                      ? { backgroundColor: style.bg, color: style.color, borderColor: style.color }
                      : { backgroundColor: 'white', color: '#888', borderColor: '#e5e7eb' }
                  }
                >
                  {style.icon} {type}
                </button>
              )
            })}
          </div>
          {errors.type && (
            <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errors.type}</p>
          )}
        </div>

        <FormField name="dateObtention" label="Date d'obtention" value={form.dateObtention} onChange={handleChange} error={errors.dateObtention} type="date" />

        <SelectField name="athleteId" label="Athlète" value={form.athleteId} onChange={handleChange} error={errors.athleteId}>
          {athletes.map((a) => (
            <option key={a.id} value={a.id}>{a.nom} {a.prenom} — {a.paysCode}</option>
          ))}
        </SelectField>

        <SelectField name="paysId" label="Pays représenté" value={form.paysId} onChange={handleChange} error={errors.paysId}>
          {pays.map((p) => (
            <option key={p.id} value={p.id}>{p.drapeau} {p.nom}</option>
          ))}
        </SelectField>

        <SelectField name="competitionId" label="Compétition" value={form.competitionId} onChange={handleChange} error={errors.competitionId}>
          {competitions.map((c) => (
            <option key={c.id} value={c.id}>{c.nom} — {c.discipline}</option>
          ))}
        </SelectField>
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => navigate('/medailles')}
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
            {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Attribuer'}
          </button>
        </div>
      </>
    </BaseForm>
  )
}

export default MedailleFormPage
