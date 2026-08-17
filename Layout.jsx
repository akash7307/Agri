import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ScanSearch, BellRing, ClockIcon, Store } from 'lucide-react'
import { LeafSVG, PlantSVG } from './LeafIcons'
import LeafBackground from './LeafBackground'
import FarmerChat from './FarmerChat'
import clsx from 'clsx'

// 2. NAV array mein Kisan Mandi add kiya (2nd position par)
const NAV = [
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard',     desc: 'Farm overview' },
  { to: '/mandi',   icon: Store,           label: 'Kisan Mandi',   desc: 'Live Market Price' },
  { to: '/analyze', icon: ScanSearch,      label: 'Analyse Field', desc: 'Scan your crop' },
  { to: '/alerts',  icon: BellRing,        label: 'Alerts',        desc: 'Risk events' },
  { to: '/history', icon: ClockIcon,       label: 'History',       desc: 'Past analyses' },
]

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen relative">
      <LeafBackground />

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside
        className="w-72 flex flex-col shrink-0 relative z-10"
        style={{
          background: 'linear-gradient(180deg, #1a3d1f 0%, #2d6a35 60%, #1a3d1f 100%)',
          boxShadow: '4px 0 32px rgba(26,61,31,0.25)',
        }}
      >
        {/* Decorative bg circles */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #5db356, transparent)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-32 left-0 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #e8a020, transparent)', transform: 'translate(-30%, 0)' }} />

        {/* Logo */}
        <div className="px-6 py-7 flex items-center gap-3 border-b border-white/10 relative">
          <div className="animate-float">
            <LeafSVG size={38} color="#5db356" />
          </div>
          <div>
            <h1 className="font-display text-white text-2xl tracking-wide leading-none">AgriAI</h1>
            <p className="text-green-300 text-xs mt-0.5 font-light tracking-widest uppercase">Smart Farming</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV.map(({ to, icon: Icon, label, desc }, i) => (
            <NavLink
              key={to} to={to} end={to === '/'}
              className={({ isActive }) => clsx(
                'group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 relative overflow-hidden',
                isActive
                  ? 'bg-white/15 shadow-lg'
                  : 'hover:bg-white/8'
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-green-300" />
                  )}
                  <div className={clsx(
                    'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0',
                    isActive ? 'bg-green-400/25' : 'bg-white/8 group-hover:bg-white/14'
                  )}>
                    <Icon className={clsx('w-4 h-4', isActive ? 'text-green-300' : 'text-green-200/70 group-hover:text-green-200')} />
                  </div>
                  <div>
                    <p className={clsx('text-sm font-medium leading-none', isActive ? 'text-white' : 'text-green-100/80 group-hover:text-white')}>
                      {label}
                    </p>
                    <p className="text-xs text-green-300/50 mt-0.5">{desc}</p>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Plant illustration */}
        <div className="flex justify-center pb-2 opacity-60 relative">
          <div className="animate-sway origin-bottom">
            <PlantSVG />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-green-300/50 text-center">AgriAI v1.0 · ICAR-aligned</p>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto relative z-10" style={{ background: 'var(--cream)' }}>
        {/* Top bar */}
        <div className="sticky top-0 z-20 px-8 py-4 flex items-center justify-between"
          style={{
            background: 'rgba(247,243,237,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
            <span className="text-xs text-green-700 font-medium">System Online</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-stone-400">
              {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3d8b47, #5db356)' }}>
              F
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-8">
          {children}
        </div>

        {/* Global LLM Chat Icon */}
        <FarmerChat />
      </main>
    </div>
  )
}