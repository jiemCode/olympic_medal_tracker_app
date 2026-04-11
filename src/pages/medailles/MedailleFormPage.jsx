import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { medailleService } from '../../api/medailleService'
import { athleteService } from '../../api/athleteService'
import { paysService } from '../../api/paysService'
import { competitionService } from '../../api/competitionService'
import { TYPE_STYLE, TYPES } from '../../constants/constants'

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
          athleteId: '',
          paysId: '',
          competitionId: '',
        })
      } catch {
        toast.error('Médaille introuvable')
        navigate('/medailles')
      }
    }
    fetchMedaille()
  }, [editId, isEdit, navigate])

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

  const SelectField = ({ name, label, children }) => (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: '#2c4d14' }}>
        {label}
      </label>
      <select
        value={form[name]}
        onChange={(e) => {
          if (name === 'athleteId') { handleAthleteChange(e.target.value); return }
          setForm({ ...form, [name]: e.target.value })
          setErrors({ ...errors, [name]: null })
        }}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
        style={{ borderColor: errors[name] ? '#c0392b' : '#2c4d14' }}
      >
        <option value="">Sélectionner...</option>
        {children}
      </select>
      {errors[name] && (
        <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errors[name]}</p>
      )}
    </div>
  )

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => navigate('/medailles')}
        className="text-sm mb-6 hover:underline flex items-center gap-1"
        style={{ color: '#2c4d14' }}
      >
        ← Retour aux médailles
      </button>

      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#2c4d14' }}>
          {isEdit ? 'Modifier la médaille' : 'Attribuer une médaille'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Type de médaille */}
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

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2c4d14' }}>
              Date d'obtention
            </label>
            <input
              type="date"
              value={form.dateObtention}
              onChange={(e) => {
                setForm({ ...form, dateObtention: e.target.value })
                setErrors({ ...errors, dateObtention: null })
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: errors.dateObtention ? '#c0392b' : '#2c4d14' }}
            />
            {errors.dateObtention && (
              <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errors.dateObtention}</p>
            )}
          </div>

          {/* Athlète */}
          <SelectField name="athleteId" label="Athlète">
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nom} {a.prenom} — {a.paysCode}
              </option>
            ))}
          </SelectField>

          {/* Pays — auto-rempli mais modifiable */}
          <SelectField name="paysId" label="Pays représenté">
            {pays.map((p) => (
              <option key={p.id} value={p.id}>
                {p.drapeau} {p.nom}
              </option>
            ))}
          </SelectField>

          {/* Compétition */}
          <SelectField name="competitionId" label="Compétition">
            {competitions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom} — {c.discipline}
              </option>
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
        </form>
      </div>
    </div>
  )
}

export default MedailleFormPage
