'use client'

const particles = [
  ['8%', '18%', '0.18rem'],
  ['18%', '72%', '0.12rem'],
  ['28%', '12%', '0.14rem'],
  ['78%', '18%', '0.16rem'],
  ['88%', '68%', '0.12rem'],
  ['72%', '82%', '0.18rem'],
  ['12%', '48%', '0.1rem'],
  ['92%', '38%', '0.14rem'],
  ['52%', '8%', '0.12rem'],
  ['48%', '90%', '0.16rem'],
  ['34%', '84%', '0.1rem'],
  ['66%', '30%', '0.12rem'],
] as const

export function HeroScene() {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <div className="absolute inset-[12%] rounded-full bg-violet-600/20 blur-[90px]" />
      {particles.map(([left, top, size], index) => (
        <span
          key={index}
          className="absolute rounded-full bg-violet-300/70 shadow-[0_0_18px_rgba(167,139,250,0.8)]"
          style={{ left, top, width: size, height: size }}
        />
      ))}

      <div
        className="relative w-[min(82%,420px)]"
        style={{
          transform: 'rotateX(12deg) rotateY(-18deg) rotateZ(-5deg)',
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 35px 45px rgba(76,29,149,0.38))',
        }}
      >
        <div className="absolute -inset-3 rounded-[2rem] border border-violet-300/20 bg-violet-500/10 blur-sm" />
        <div className="relative aspect-[1.6] overflow-hidden rounded-[1.7rem] border border-white/20 bg-gradient-to-br from-[#32136b] via-[#1b0b3d] to-[#090515] p-7 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_15%,rgba(245,158,11,0.2),transparent_42%),linear-gradient(125deg,rgba(139,92,246,0.18),transparent_55%)]" />
          <div className="relative flex items-center justify-between">
            <span className="text-lg font-bold tracking-tight text-white">LoyaltyFlow<span className="text-amber-300">AI</span></span>
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[9px] font-semibold tracking-widest text-amber-200">MEMBER</span>
          </div>
          <div className="relative mt-8">
            <div className="text-[10px] font-medium tracking-[0.22em] text-white/45">LE PETIT BISTROT</div>
            <div className="mt-1 text-[10px] tracking-[0.2em] text-white/35">POINTS FIDÉLITÉ</div>
            <div className="mt-1 text-5xl font-black tracking-tight text-transparent [background:linear-gradient(90deg,#fbbf24,#fef3c7)] bg-clip-text sm:text-6xl">1 248</div>
          </div>
          <div className="relative mt-5 flex items-center justify-between">
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/35" />
              ))}
            </div>
            <span className="text-[9px] tracking-[0.24em] text-white/35">•••• 4821</span>
          </div>
          <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full border border-violet-300/15" />
          <div className="absolute -right-4 -top-6 h-24 w-24 rounded-full border border-amber-300/20" />
        </div>
      </div>
    </div>
  )
}
