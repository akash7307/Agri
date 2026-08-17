// LeafIcons.jsx — SVG plant/leaf illustrations for AgriAI

export function LeafSVG({ className = '', color = '#3d8b47', size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
      <path
        d="M32 56C32 56 8 44 8 24C8 13 19 6 32 8C45 6 56 13 56 24C56 44 32 56 32 56Z"
        fill={color} opacity="0.9"
      />
      <path
        d="M32 56C32 56 8 44 8 24"
        stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d="M32 8L32 56" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d="M32 20L20 30M32 30L44 20M32 40L22 48" stroke="rgba(255,255,255,0.35)"
        strokeWidth="1" strokeLinecap="round"
      />
    </svg>
  )
}

export function PlantSVG({ className = '' }) {
  return (
    <svg width="120" height="140" viewBox="0 0 120 140" className={className} fill="none">
      {/* Pot */}
      <path d="M38 120 L82 120 L76 140 L44 140 Z" fill="#7c5c3e" opacity="0.8"/>
      <rect x="32" y="112" width="56" height="12" rx="4" fill="#9a7458"/>
      {/* Stem */}
      <path d="M60 112 Q58 85 60 60" stroke="#2d6a35" strokeWidth="3" strokeLinecap="round"/>
      {/* Left leaf */}
      <path
        d="M60 85 Q40 75 35 55 Q50 58 60 75 Z"
        fill="#3d8b47" opacity="0.9"
      />
      <path d="M60 85 Q47 70 35 55" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round"/>
      {/* Right leaf */}
      <path
        d="M60 70 Q80 58 88 38 Q72 43 60 62 Z"
        fill="#5db356" opacity="0.85"
      />
      <path d="M60 70 Q74 52 88 38" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round"/>
      {/* Top leaf */}
      <path
        d="M60 60 Q48 40 52 20 Q65 30 64 52 Z"
        fill="#2d6a35" opacity="0.95"
      />
      <path d="M60 60 Q56 38 52 20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round"/>
      {/* Small leaf right */}
      <path d="M62 95 Q76 88 80 75 Q68 78 62 92 Z" fill="#5db356" opacity="0.7"/>
    </svg>
  )
}

export function WheatSVG({ className = '' }) {
  return (
    <svg width="80" height="110" viewBox="0 0 80 110" className={className} fill="none">
      {/* Stem */}
      <path d="M40 108 Q38 80 40 20" stroke="#7c5c3e" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Grains */}
      {[20, 32, 44, 56, 68].map((y, i) => (
        <g key={i}>
          <ellipse cx={40 - (i % 2 === 0 ? 8 : 0)} cy={y} rx="6" ry="9"
            fill="#e8a020" opacity={0.6 + i * 0.07} transform={`rotate(${i % 2 === 0 ? -15 : 15}, 40, ${y})`}/>
          <ellipse cx={40 + (i % 2 === 0 ? 0 : 8)} cy={y} rx="6" ry="9"
            fill="#f5c842" opacity={0.5 + i * 0.07} transform={`rotate(${i % 2 === 0 ? 15 : -15}, 40, ${y})`}/>
        </g>
      ))}
      {/* Top spike */}
      <path d="M40 20 L40 6" stroke="#7c5c3e" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M40 12 L34 6 M40 12 L46 6" stroke="#7c5c3e" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
}

export function SunSVG({ className = '' }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className={className} fill="none">
      <circle cx="28" cy="28" r="12" fill="#f5c842" opacity="0.9"/>
      {[0,45,90,135,180,225,270,315].map((angle, i) => (
        <line
          key={i}
          x1={28 + Math.cos(angle * Math.PI / 180) * 16}
          y1={28 + Math.sin(angle * Math.PI / 180) * 16}
          x2={28 + Math.cos(angle * Math.PI / 180) * 22}
          y2={28 + Math.sin(angle * Math.PI / 180) * 22}
          stroke="#f5c842" strokeWidth="2.5" strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

export function DropSVG({ className = '', color = '#4a90d9' }) {
  return (
    <svg width="32" height="40" viewBox="0 0 32 40" className={className} fill="none">
      <path
        d="M16 4 Q28 18 28 26 C28 33.7 22.6 38 16 38 C9.4 38 4 33.7 4 26 C4 18 16 4 16 4Z"
        fill={color} opacity="0.85"
      />
      <path
        d="M10 28 Q12 22 18 20"
        stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  )
}

export function LeafParticle({ style }) {
  return (
    <svg
      style={style}
      className="leaf-particle"
      viewBox="0 0 20 24" fill="none"
    >
      <path
        d="M10 22 Q2 16 2 8 C2 3 6 1 10 2 C14 1 18 3 18 8 C18 16 10 22 10 22Z"
        fill="#3d8b47" opacity="0.6"
      />
      <path d="M10 2 L10 22" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
    </svg>
  )
}

export function DiseaseSVG({ className = '' }) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className={className} fill="none">
      <circle cx="32" cy="32" r="28" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1.5"/>
      <path
        d="M20 24 Q24 16 32 20 Q40 16 44 24 Q48 32 44 40 Q40 48 32 44 Q24 48 20 40 Q16 32 20 24Z"
        fill="#3d8b47" opacity="0.7"
      />
      {/* Disease spots */}
      <circle cx="28" cy="28" r="4" fill="#7c3d3d" opacity="0.7"/>
      <circle cx="38" cy="32" r="3" fill="#7c3d3d" opacity="0.6"/>
      <circle cx="30" cy="38" r="2.5" fill="#7c3d3d" opacity="0.5"/>
    </svg>
  )
}