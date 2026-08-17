import { useMemo } from 'react'
import { LeafParticle } from './LeafIcons'

export default function LeafBackground() {
  const particles = useMemo(() => (
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${8 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 8}s`,
      scale: 0.5 + Math.random() * 1,
      opacity: 0.3 + Math.random() * 0.4,
    }))
  ), [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <LeafParticle
          key={p.id}
          style={{
            left: p.left,
            top: '-40px',
            transform: `scale(${p.scale})`,
            opacity: p.opacity,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
    </div>
  )
}