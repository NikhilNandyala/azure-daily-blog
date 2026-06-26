export function AmbientBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Orb 1 — top-left azure */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          left: -80,
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(0,120,212,0.12) 0%, transparent 70%)',
          animation: 'drift-1 8s ease-in-out infinite',
        }}
      />

      {/* Orb 2 — right cyan */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          right: -100,
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(0,188,242,0.08) 0%, transparent 70%)',
          animation: 'drift-2 10s ease-in-out infinite',
        }}
      />

      {/* Orb 3 — bottom-center azure */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '30%',
          width: 350,
          height: 350,
          background: 'radial-gradient(circle, rgba(0,120,212,0.07) 0%, transparent 70%)',
          animation: 'drift-3 12s ease-in-out infinite',
        }}
      />

      {/* Subtle grid */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.04,
          backgroundImage:
            'linear-gradient(var(--azure) 1px, transparent 1px), linear-gradient(90deg, var(--azure) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
