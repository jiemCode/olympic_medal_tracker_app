import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { paysService } from '../../api/paysService'
import FormField from '../../components/common/FormField'
import BaseForm from '../../components/layouts/BaseForm'

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
  }, [id, isEdit, navigate])

  const handleChange = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: null }))
  }

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

  return (
    <BaseForm title={isEdit ? 'Modifier le pays' : 'Nouveau pays'} backUrl={'/pays'} handleSubmit={handleSubmit}>
      <>
        <FormField name="nom"     label="Nom du pays"        value={form.nom}     onChange={handleChange} error={errors.nom}     placeholder="ex: Sénégal" />
        <FormField name="code"    label="Code (2-3 lettres)" value={form.code}    onChange={handleChange} error={errors.code}    placeholder="ex: SEN" />
        <FormField name="drapeau" label="Drapeau (emoji)"    value={form.drapeau} onChange={handleChange} error={errors.drapeau} placeholder="ex: 🇸🇳" />

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
        </div> </>
    </BaseForm>
  )
}

export default PaysFormPage
