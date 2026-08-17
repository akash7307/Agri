import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: API,
  timeout: 120000, // 2 min — ML models take time
})

// ── Request interceptor — add auth token if present ────────────────────────
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('agri_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response interceptor — normalize errors ────────────────────────────────
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'Something went wrong'
    return Promise.reject(new Error(msg))
  }
)

// ──────────────────────────────────────────────────────────────────────────
// FARMER ANALYSIS
// POST /api/farmer/analyze
// Accepts multipart/form-data: soil data + leaf image
// Returns: disease, forecast, crop, fertilizer, risk_events, advisory
// ──────────────────────────────────────────────────────────────────────────
export async function analyzeField({
  nitrogen,
  phosphorus,
  potassium,
  ph,
  area_ha = 1,
  lat,
  lon,
  location_name = '',
  phone = '',
  device_token = '',
  leafImage,           // File object from dropzone
  onUploadProgress,    // optional progress callback (percent) => void
}) {
  const fd = new FormData()
  fd.append('nitrogen',      nitrogen)
  fd.append('phosphorus',    phosphorus)
  fd.append('potassium',     potassium)
  fd.append('ph',            ph)
  fd.append('area_ha',       area_ha)
  fd.append('lat',           lat)
  fd.append('lon',           lon)
  fd.append('location_name', location_name)
  fd.append('phone',         phone)
  fd.append('device_token',  device_token)
  fd.append('leaf_image',    leafImage)

  const { data } = await client.post('/api/farmer/analyze', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onUploadProgress && e.total) {
        onUploadProgress(Math.round((e.loaded * 100) / e.total))
      }
    },
  })
  return data
}

// ──────────────────────────────────────────────────────────────────────────
// ANALYSIS HISTORY
// GET /api/farmer/history?page=1&limit=10
// ──────────────────────────────────────────────────────────────────────────
export async function fetchHistory({ page = 1, limit = 10 } = {}) {
  const { data } = await client.get('/api/farmer/history', {
    params: { page, limit },
  })
  return data // { items: [...], total: N, page: N }
}

// ──────────────────────────────────────────────────────────────────────────
// SINGLE ANALYSIS DETAIL
// GET /api/farmer/history/:id
// ──────────────────────────────────────────────────────────────────────────
export async function fetchAnalysisById(id) {
  const { data } = await client.get(`/api/farmer/history/${id}`)
  return data
}

// ──────────────────────────────────────────────────────────────────────────
// ALERTS
// GET /api/alerts?unread=true
// ──────────────────────────────────────────────────────────────────────────
export async function fetchAlerts({ unreadOnly = false } = {}) {
  const { data } = await client.get('/api/alerts', {
    params: { unread: unreadOnly },
  })
  return data // { alerts: [...], unread_count: N }
}

// ──────────────────────────────────────────────────────────────────────────
// MARK ALERT READ
// PATCH /api/alerts/:id/read
// ──────────────────────────────────────────────────────────────────────────
export async function markAlertRead(id) {
  const { data } = await client.patch(`/api/alerts/${id}/read`)
  return data
}

// ──────────────────────────────────────────────────────────────────────────
// DASHBOARD SUMMARY
// GET /api/farmer/dashboard
// ──────────────────────────────────────────────────────────────────────────
export async function fetchDashboard() {
  const { data } = await client.get('/api/farmer/dashboard')
  return data
  // {
  //   last_crop, temperature, price_trend,
  //   open_alerts, recent_risks: [{ level, message }]
  // }
}

// ──────────────────────────────────────────────────────────────────────────
// HEALTH CHECK
// GET /health
// ──────────────────────────────────────────────────────────────────────────
export async function checkHealth() {
  const { data } = await client.get('/health')
  return data // { status: "ok" }
}