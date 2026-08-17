import { useState, useEffect } from 'react'
import { BellRing, CheckCircle, Filter } from 'lucide-react'
import { LeafSVG } from '../components/LeafIcons'
import { fetchAlerts, markAlertRead } from '../api/farmer'
import clsx from 'clsx'

const LEVEL_LEFT = {
  low:      'border-l-green-400',
  medium:   'border-l-amber-400',
  high:     'border-l-red-500',
  critical: 'border-l-purple-600',
}
const LEVEL_DOT = {
  low: '#22c55e', medium: '#f59e0b', high: '#ef4444', critical: '#a855f7',
}
const SOURCE_EMOJI = {
  disease: '🌿', moisture: '💧', price: '📈', fertilizer: '🧪', default: '⚠️',
}

const SAMPLE = [
  { id: 1, level: 'critical', source: 'disease',    message: 'Late Blight detected — Field A. Apply Mancozeb immediately.',    time: '2h ago',  read: false },
  { id: 2, level: 'high',     source: 'moisture',   message: 'Soil moisture below 20% in Field B. Irrigate within 24 hours.',  time: '5h ago',  read: false },
  { id: 3, level: 'medium',   source: 'price',      message: 'Wheat price expected to drop 8% next week. Plan early sale.',    time: '1d ago',  read: true  },
  { id: 4, level: 'medium',   source: 'fertilizer', message: 'K deficit 35 kg/ha detected. Apply MOP before next irrigation.', time: '2d ago',  read: true  },
  { id: 5, level: 'low',      source: 'disease',    message: 'Minor fungal spots on maize — monitor closely.',                  time: '3d ago',  read: true  },
]

export default function AlertsPage() {
  const [alerts,  setAlerts]  = useState(SAMPLE)
  const [filter,  setFilter]  = useState('all')

  const filtered = filter === 'all'    ? alerts
                 : filter === 'unread' ? alerts.filter(a => !a.read)
                 : alerts.filter(a => a.level === filter)

  const unreadCount = alerts.filter(a => !a.read).length

  const markRead = (id) =>
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Monitoring</p>
          <h1 className="font-display text-4xl text-stone-800 flex items-center gap-3">
            <BellRing className="w-8 h-8 text-amber-500" /> Alerts
          </h1>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-100">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-semibold text-red-600">{unreadCount} unread</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all','unread','critical','high','medium','low'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all',
              filter === f
                ? 'text-white shadow-sm'
                : 'bg-white/60 text-stone-500 hover:bg-white'
            )}
            style={filter === f ? { background: '#2d6a35' } : {}}>
            {f}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="flex justify-center mb-3 animate-float">
              <LeafSVG size={48} color="#3d8b47" />
            </div>
            <p className="text-stone-400 font-medium">No alerts in this category</p>
          </div>
        ) : filtered.map((a, i) => (
          <div key={a.id}
            className={clsx(
              'glass-card border-l-4 p-5 flex items-start gap-4 animate-slide-up transition-all',
              LEVEL_LEFT[a.level],
              a.read && 'opacity-60'
            )}
            style={{ animationDelay: `${i * 50}ms` }}>

            {/* Source emoji */}
            <div className="text-2xl shrink-0 mt-0.5">
              {SOURCE_EMOJI[a.source] || SOURCE_EMOJI.default}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: LEVEL_DOT[a.level] }} />
                <span className="text-xs font-bold uppercase tracking-wide text-stone-400">
                  {a.level} · {a.source}
                </span>
                {!a.read && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">New</span>
                )}
              </div>
              <p className="text-sm text-stone-700 font-medium">{a.message}</p>
              <p className="text-xs text-stone-400 mt-1">{a.time}</p>
            </div>

            {/* Mark read */}
            {!a.read && (
              <button onClick={() => markRead(a.id)}
                className="shrink-0 p-2 rounded-xl hover:bg-green-50 transition-colors group"
                title="Mark as read">
                <CheckCircle className="w-4 h-4 text-stone-300 group-hover:text-green-500 transition-colors" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}