import { useState, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'
import { analyzeField } from '../api/farmer'

// ── Initial form values ────────────────────────────────────────────────────
const INITIAL_FORM = {
  nitrogen:      '',
  phosphorus:    '',
  potassium:     '',
  ph:            '',
  area_ha:       '1',
  lat:           '',
  lon:           '',
  location_name: '',
  phone:         '',
}

// ── Validation rules ───────────────────────────────────────────────────────
function validate(form, imageFile) {
  const errors = {}
  if (!imageFile)                        errors.image     = 'Leaf image upload karo'
  if (!form.nitrogen  || form.nitrogen  < 0) errors.nitrogen  = 'Valid nitrogen daalo'
  if (!form.phosphorus|| form.phosphorus< 0) errors.phosphorus= 'Valid phosphorus daalo'
  if (!form.potassium || form.potassium < 0) errors.potassium = 'Valid potassium daalo'
  if (!form.ph || form.ph < 0 || form.ph > 14) errors.ph     = 'pH 0–14 hona chahiye'
  if (!form.lat || isNaN(form.lat))      errors.lat       = 'Valid latitude daalo'
  if (!form.lon || isNaN(form.lon))      errors.lon       = 'Valid longitude daalo'
  return errors
}

export function useAnalysis() {
  const [form,           setForm]          = useState(INITIAL_FORM)
  const [imageFile,      setImageFile]     = useState(null)
  const [imagePreview,   setImagePreview]  = useState(null)
  const [loading,        setLoading]       = useState(false)
  const [uploadProgress, setUploadProgress]= useState(0)
  const [errors,         setErrors]        = useState({})
  const [result,         setResult]        = useState(null)
  const previewUrl = useRef(null)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      const next = { ...prev }; delete next[name]; return next;
    })
  }, [])

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
    const url = URL.createObjectURL(file)
    previewUrl.current = url
    setImageFile(file)
    setImagePreview(url)
    setErrors((prev) => { const next = { ...prev }; delete next.image; return next; })
  }, [])

  const removeImage = useCallback(() => {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
    previewUrl.current = null
    setImageFile(null)
    setImagePreview(null)
  }, [])

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM); removeImage(); setErrors({}); setResult(null); setUploadProgress(0);
  }, [removeImage])

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) { toast.error('No geolocation support'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({ ...prev, lat: pos.coords.latitude.toFixed(6), lon: pos.coords.longitude.toFixed(6) }))
        toast.success('Location detected!');
      },
      () => toast.error('Location access denied')
    )
  }, [])

  // ── Submit ───────────────────────────────────────────────────────────────
  const submit = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault()

    // Validate
    const validationErrors = validate(form, imageFile)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Pehle sab fields sahi se bharo')
      return
    }

    setLoading(true)
    setUploadProgress(0)
    setResult(null)

    const toastId = toast.loading('Field analyze ho rahi hai... thoda wait karo 🌾')

    try {
      const data = await analyzeField({
        ...form,
        leafImage: imageFile,
        onUploadProgress: setUploadProgress,
      })

      setResult(data)

      toast.success('Analysis complete!', { id: toastId })

      // Scroll to results
      setTimeout(() => {
        document.getElementById('analysis-results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    } catch (err) {
      toast.error(err.message || 'Analysis fail ho gayi', { id: toastId })
    } finally {
      setLoading(false)
    }
  }, [form, imageFile])

  return {
    // Form state
    form,
    handleChange,
    resetForm,
    detectLocation,

    // Image state
    imageFile,
    imagePreview,
    onDrop,
    removeImage,

    // Request state
    loading,
    uploadProgress,
    errors,

    // Result
    result,
    submit,
  }
}