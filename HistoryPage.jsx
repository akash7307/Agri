import { ClockIcon } from 'lucide-react'
import { LeafSVG } from '../components/LeafIcons'

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Records</p>
        <h1 className="font-display text-4xl text-stone-800 flex items-center gap-3">
          <ClockIcon className="w-8 h-8 text-stone-400" /> History
        </h1>
      </div>

      <div className="glass-card p-12 text-center bg-white/50 backdrop-blur-sm">
        <div className="flex justify-center mb-6 animate-float">
          <div className="w-20 h-20 bg-[var(--leaf-light)] rounded-full flex items-center justify-center opacity-20">
            <LeafSVG size={48} color="#3d8b47" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-stone-800 mb-2">History is Disabled</h2>
        <p className="text-stone-500 max-w-md mx-auto">
          Analysis history requires authentication to save your records securely. 
          Since login has been removed, this feature is currently unavailable.
        </p>
      </div>
    </div>
  )
}