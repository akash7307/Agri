import { useDropzone } from 'react-dropzone'
import { UploadCloud, FlaskConical, MapPin, X, RotateCcw, BookOpen, ChevronRight, Leaf, Wheat } from 'lucide-react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import clsx from 'clsx'
import { useAnalysis } from '../hooks/useAnalysis'
import { LeafSVG, DiseaseSVG, WheatSVG, DropSVG } from '../components/LeafIcons'

const RISK_STYLE = {
  low:      'risk-low',
  medium:   'risk-medium',
  high:     'risk-high',
  critical: 'risk-critical',
}

const SOIL_FIELDS = [
  { name: 'nitrogen',   label: 'Nitrogen (N)',   unit: 'kg/ha', emoji: '🌿', max: 200 },
  { name: 'phosphorus', label: 'Phosphorus (P)', unit: 'kg/ha', emoji: '🟠', max: 150 },
  { name: 'potassium',  label: 'Potassium (K)',  unit: 'kg/ha', emoji: '🟡', max: 200 },
  { name: 'ph',         label: 'pH Level',       unit: '0–14',  emoji: '⚗️', max: 14 },
  { name: 'area_ha',    label: 'Area',           unit: 'hectare',emoji: '📐',max: 100 },
]

function Field({ label, name, value, onChange, error, unit, emoji }) {
  return (
    <label className="block group">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-sm">{emoji}</span>
        <span className="text-xs text-stone-500 font-medium uppercase tracking-wide">{label}</span>
        <span className="text-xs text-stone-300 ml-auto">{unit}</span>
      </div>
      <input
        name={name} value={value} onChange={onChange}
        type="number" min="0" step="0.1"
        className={clsx('field-input', error && 'error')}
        placeholder="0"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </label>
  )
}

export default function AnalyzePage() {
  const {
    form, handleChange, resetForm, detectLocation,
    imageFile, imagePreview, onDrop, removeImage,
    loading, uploadProgress, errors,
    result, submit,
  } = useAnalysis()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1, disabled: loading,
  })

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">AI-Powered</p>
          <h1 className="font-display text-4xl text-stone-800">Field Analysis</h1>
        </div>
        {result && (
          <button onClick={resetForm}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-stone-500 hover:text-stone-700 hover:bg-white/60 transition-all">
            <RotateCcw className="w-4 h-4" /> New Analysis
          </button>
        )}
      </div>

      <form onSubmit={submit} className="space-y-5">

        {/* ── Image Upload ─────────────────────────────────── */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <div className="animate-float"><LeafSVG size={20} color="#3d8b47" /></div>
            Leaf Image Upload
          </h2>

          {imagePreview ? (
            <div className="relative group">
              <div className="rounded-2xl overflow-hidden border-2 border-green-200"
                style={{ maxHeight: 260, display: 'flex', justifyContent: 'center', background: '#f0f7f0' }}>
                <img src={imagePreview} alt="leaf" className="object-contain h-64 w-auto" />
              </div>
              {/* Overlay with remove */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                <button type="button" onClick={removeImage}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-medium text-red-600 shadow-lg">
                  <X className="w-4 h-4" /> Remove
                </button>
              </div>
              <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium text-white"
                style={{ background: 'rgba(61,139,71,0.85)' }}>
                ✓ Image ready
              </div>
            </div>
          ) : (
            <div {...getRootProps()}
              className={clsx(
                'relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 group',
                isDragActive
                  ? 'border-green-400 bg-green-50/80 scale-[1.01]'
                  : 'border-stone-200 hover:border-green-300 hover:bg-green-50/40',
                errors.image && 'border-red-300 bg-red-50/40'
              )}>
              <input {...getInputProps()} />

              {/* Animated leaf in upload zone */}
              <div className="flex justify-center mb-4">
                <div className={clsx('transition-transform duration-300', isDragActive ? 'scale-125 animate-bounce' : 'animate-float')}>
                  <LeafSVG size={56} color={isDragActive ? '#3d8b47' : '#a7c9a9'} />
                </div>
              </div>

              <p className="text-stone-600 font-medium mb-1">
                {isDragActive ? '🌿 Drop it here!' : 'Drop a leaf photo here'}
              </p>
              <p className="text-stone-400 text-sm">or click to browse · JPG, PNG, WEBP</p>

              {/* Corner decorations */}
              <div className="absolute top-3 left-3 opacity-20"><LeafSVG size={16} color="#3d8b47" /></div>
              <div className="absolute bottom-3 right-3 opacity-20"><LeafSVG size={16} color="#3d8b47" /></div>
            </div>
          )}
          {errors.image && <p className="text-xs text-red-500 mt-2">{errors.image}</p>}
        </div>

        {/* ── Soil Data ─────────────────────────────────────── */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-amber-600" />
            Soil Data
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SOIL_FIELDS.map(f => (
              <Field key={f.name} {...f} value={form[f.name]} onChange={handleChange} error={errors[f.name]} />
            ))}
          </div>

          {/* Soil NPK visual bar */}
          {form.nitrogen || form.phosphorus || form.potassium ? (
            <div className="mt-5 p-4 rounded-xl bg-stone-50 space-y-2">
              <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-3">Nutrient Preview</p>
              {[
                { label: 'N', value: form.nitrogen,   color: '#3d8b47', max: 200 },
                { label: 'P', value: form.phosphorus, color: '#e8a020', max: 150 },
                { label: 'K', value: form.potassium,  color: '#4a90d9', max: 200 },
              ].map(bar => (
                <div key={bar.label} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-4" style={{ color: bar.color }}>{bar.label}</span>
                  <div className="flex-1 progress-bar">
                    <div className="progress-bar-fill" style={{
                      width: `${Math.min(100, (bar.value / bar.max) * 100)}%`,
                      background: bar.color,
                    }} />
                  </div>
                  <span className="text-xs text-stone-400 w-12 text-right">{bar.value || 0} kg/ha</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* ── Location ──────────────────────────────────────── */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            Location & Contact
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'lat',           label: 'Latitude',    emoji: '🌐', unit: 'decimal' },
              { name: 'lon',           label: 'Longitude',   emoji: '🌐', unit: 'decimal' },
              { name: 'location_name', label: 'Village/City',emoji: '📍', unit: 'text' },
              { name: 'phone',         label: 'Phone (SMS)', emoji: '📱', unit: '+91...' },
            ].map(f => (
              <label key={f.name} className="block">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-sm">{f.emoji}</span>
                  <span className="text-xs text-stone-500 font-medium uppercase tracking-wide">{f.label}</span>
                </div>
                <input
                  name={f.name} value={form[f.name]} onChange={handleChange}
                  type={f.name === 'phone' ? 'tel' : 'text'}
                  className={clsx('field-input', errors[f.name] && 'error')}
                  placeholder={f.unit}
                />
                {errors[f.name] && <p className="text-xs text-red-500 mt-1">{errors[f.name]}</p>}
              </label>
            ))}
          </div>
          <button type="button" onClick={detectLocation}
            className="mt-3 flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: '#3d8b47' }}>
            <MapPin className="w-4 h-4" /> Auto-detect my location
          </button>
        </div>

        {/* Upload progress */}
        {loading && uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex justify-between text-xs text-stone-400">
              <span>Uploading image...</span><span>{uploadProgress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-base">
          {loading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              Analysing your field... please wait
            </>
          ) : (
            <> Run AI Field Analysis <ChevronRight className="w-5 h-5" /> </>
          )}
        </button>
      </form>

      {/* ── Results ───────────────────────────────────────── */}
      {result && <Results data={result} />}
    </div>
  )
}

// ── Results component ─────────────────────────────────────
function Results({ data }) {
  const { disease, forecast, crop, fertilizer, risk_events, advisory } = data

  const moisture7d = (forecast.moisture_forecast_7d || []).map((v, i) => ({ day: `Day ${i+1}`, moisture: +v.toFixed(1) }))
  const price7d    = (forecast.price_forecast_7d    || []).map((v, i) => ({ day: `Day ${i+1}`, price:    +v.toFixed(0) }))

  const radarData = [
    { subject: 'N',    value: Math.min(100, fertilizer.deficit_kg_ha?.N || 0) },
    { subject: 'P',    value: Math.min(100, fertilizer.deficit_kg_ha?.P || 0) },
    { subject: 'K',    value: Math.min(100, fertilizer.deficit_kg_ha?.K || 0) },
    { subject: 'pH',   value: ((form?.ph || 7) / 14) * 100 },
    { subject: 'Moisture', value: moisture7d[0]?.moisture || 50 },
  ]

  const isHealthy   = disease.disease === 'Healthy'
  const trendColor  = forecast.trend === 'up' ? '#22c55e' : forecast.trend === 'down' ? '#ef4444' : '#6b7280'

  return (
    <div id="analysis-results" className="space-y-6 pt-4 animate-fade-in">

      {/* Results header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-200" />
        <h2 className="font-display text-2xl text-stone-700 px-2">Analysis Results</h2>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      {/* ── Summary row ─────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Disease */}
        <div className={clsx('glass-card p-5 text-center animate-slide-up relative overflow-hidden', !isHealthy && 'border border-red-200')}>
          <div className="flex justify-center mb-3">
            {isHealthy
              ? <div className="animate-float"><LeafSVG size={44} color="#3d8b47" /></div>
              : <DiseaseSVG />}
          </div>
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Disease</p>
          <p className={clsx('font-bold text-lg', isHealthy ? 'text-green-600' : 'text-red-600')}>
            {disease.disease}
          </p>
          <div className="mt-2 progress-bar">
            <div className="progress-bar-fill"
              style={{ width: `${disease.confidence * 100}%`, background: isHealthy ? '#3d8b47' : '#ef4444' }} />
          </div>
          <p className="text-xs text-stone-400 mt-1">{(disease.confidence * 100).toFixed(1)}% confidence</p>
        </div>

        {/* Crop */}
        <div className="glass-card p-5 text-center animate-slide-up" style={{ animationDelay: '60ms' }}>
          <div className="flex justify-center mb-3">
            <div className="animate-sway origin-bottom"><WheatSVG /></div>
          </div>
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Best Crop</p>
          <p className="font-bold text-lg text-green-700">{crop.recommended_crop}</p>
          <div className="mt-2 space-y-1">
            {crop.top3?.slice(0,3).map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="text-stone-400 w-14 truncate">{c.crop}</span>
                <div className="flex-1 progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${c.probability * 100}%` }} />
                </div>
                <span className="text-stone-400">{(c.probability*100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price trend */}
        <div className="glass-card p-5 text-center animate-slide-up" style={{ animationDelay: '120ms' }}>
          <div className="flex justify-center mb-3">
            <DropSVG color={trendColor} />
          </div>
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Price Trend</p>
          <p className="font-bold text-lg" style={{ color: trendColor }}>
            {forecast.trend?.toUpperCase()}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Avg ₹{forecast.avg_predicted?.toFixed(0)}/quintal
          </p>
          <p className="text-xs mt-1 font-medium" style={{ color: trendColor }}>
            {forecast.trend === 'up' ? '↑ Good time to hold' : forecast.trend === 'down' ? '↓ Consider early sale' : '→ Stable market'}
          </p>
        </div>
      </div>

      {/* ── Charts ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-5">
        <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '180ms' }}>
          <p className="text-sm font-semibold text-stone-600 mb-4 flex items-center gap-2">
            <DropSVG color="#4a90d9" /> 7-Day Moisture Forecast (%)
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={moisture7d}>
              <defs>
                <linearGradient id="mGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4a90d9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4a90d9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}/>
              <YAxis domain={[0,100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{ background:'rgba(26,61,31,0.85)', border:'none', borderRadius:8, color:'white', fontSize:11 }}/>
              <Area type="monotone" dataKey="moisture" stroke="#4a90d9" strokeWidth={2.5} fill="url(#mGrad2)" dot={{ r:3, fill:'#4a90d9' }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '220ms' }}>
          <p className="text-sm font-semibold text-stone-600 mb-4">📈 7-Day Price Forecast (₹/q)</p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={price7d}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{ background:'rgba(26,61,31,0.85)', border:'none', borderRadius:8, color:'white', fontSize:11 }}/>
              <Line type="monotone" dataKey="price" stroke="#e8a020" strokeWidth={2.5} dot={{ r:3, fill:'#e8a020' }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Risk events ──────────────────────────────────── */}
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '260ms' }}>
        <h3 className="font-semibold text-stone-700 mb-4">⚠️ Risk Events</h3>
        {risk_events.length === 0
          ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 text-green-700">
              <LeafSVG size={24} color="#3d8b47" />
              <p className="font-medium">No significant risks detected. Your crop looks good!</p>
            </div>
          )
          : risk_events.map((e, i) => (
            <div key={i} className={clsx('flex items-start gap-3 p-4 rounded-xl mb-3 text-sm', RISK_STYLE[e.level] || 'risk-medium')}>
              <span className="font-bold uppercase text-xs mt-0.5">[{e.level}]</span>
              <div>
                <span className="font-medium capitalize">{e.source}: </span>
                {e.message}
              </div>
            </div>
          ))
        }
      </div>

      {/* ── Fertilizer ───────────────────────────────────── */}
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <h3 className="font-semibold text-stone-700 mb-4 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-amber-600" /> Fertilizer Prescription
        </h3>
        <div className="space-y-3">
          {(fertilizer.prescriptions || []).map((p, i) => p.fertilizer ? (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div>
                <p className="font-semibold text-amber-800">{p.fertilizer}</p>
                <p className="text-xs text-amber-600 mt-0.5">{p.application}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-700 text-lg">{p.total_kg} kg</p>
                <p className="text-xs text-amber-500">total for {fertilizer.area_ha} ha</p>
              </div>
            </div>
          ) : (
            <p key={i} className="text-sm text-green-600 p-3 bg-green-50 rounded-xl">{p.message}</p>
          ))}
        </div>
      </div>

      {/* ── AI Advisory ──────────────────────────────────── */}
      <div className="rounded-3xl p-7 text-white animate-slide-up"
        style={{
          background: 'linear-gradient(135deg, #1a3d1f 0%, #2d6a35 60%, #3d8b47 100%)',
          animationDelay: '340ms'
        }}>
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="w-5 h-5 text-yellow-300" />
          <h3 className="font-display text-xl text-white">AI Advisory</h3>
          <div className="ml-auto animate-float"><LeafSVG size={24} color="#5db356" /></div>
        </div>
        <p className="text-green-100 leading-relaxed text-sm whitespace-pre-wrap">{advisory}</p>
      </div>
    </div>
  )
}

// expose form for radar fallback
const form = {}