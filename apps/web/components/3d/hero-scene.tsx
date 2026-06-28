'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function createCardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 640
  const ctx = canvas.getContext('2d')!

  // Background
  const bg = ctx.createLinearGradient(0, 0, 1024, 640)
  bg.addColorStop(0, '#1a0842')
  bg.addColorStop(0.45, '#2d1266')
  bg.addColorStop(1, '#0d051a')
  ctx.fillStyle = bg
  ctx.roundRect(0, 0, 1024, 640, 40)
  ctx.fill()

  // Holographic layer 1
  const holo1 = ctx.createLinearGradient(0, 0, 1024, 0)
  holo1.addColorStop(0, 'rgba(124,58,237,0)')
  holo1.addColorStop(0.35, 'rgba(124,58,237,0.18)')
  holo1.addColorStop(0.5, 'rgba(245,158,11,0.12)')
  holo1.addColorStop(0.65, 'rgba(124,58,237,0.18)')
  holo1.addColorStop(1, 'rgba(124,58,237,0)')
  ctx.fillStyle = holo1
  ctx.roundRect(0, 0, 1024, 640, 40)
  ctx.fill()

  // Holographic layer 2 (diagonal)
  const holo2 = ctx.createLinearGradient(0, 0, 1024, 640)
  holo2.addColorStop(0, 'rgba(99,102,241,0)')
  holo2.addColorStop(0.4, 'rgba(99,102,241,0.12)')
  holo2.addColorStop(0.6, 'rgba(251,191,36,0.08)')
  holo2.addColorStop(1, 'rgba(99,102,241,0)')
  ctx.fillStyle = holo2
  ctx.roundRect(0, 0, 1024, 640, 40)
  ctx.fill()

  // Top shine
  const shine = ctx.createLinearGradient(0, 0, 0, 120)
  shine.addColorStop(0, 'rgba(255,255,255,0.08)')
  shine.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = shine
  ctx.roundRect(0, 0, 1024, 120, [40, 40, 0, 0])
  ctx.fill()

  // Decorative circles
  ctx.save()
  ctx.globalAlpha = 0.12
  ctx.beginPath()
  ctx.arc(820, 450, 180, 0, Math.PI * 2)
  ctx.strokeStyle = '#7c3aed'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(870, 380, 110, 0, Math.PI * 2)
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()

  // Brand name
  ctx.font = 'bold 36px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.fillText('LoyaltyFlow', 56, 100)
  ctx.font = 'bold 36px system-ui'
  const lw = ctx.measureText('LoyaltyFlow').width
  const grad = ctx.createLinearGradient(56 + lw + 8, 70, 56 + lw + 60, 110)
  grad.addColorStop(0, '#F59E0B')
  grad.addColorStop(1, '#FBBF24')
  ctx.fillStyle = grad
  ctx.fillText('AI', 56 + lw + 8, 100)

  // Chip (credit card style)
  ctx.save()
  ctx.translate(56, 155)
  const chipGrad = ctx.createLinearGradient(0, 0, 70, 55)
  chipGrad.addColorStop(0, '#d4a843')
  chipGrad.addColorStop(0.5, '#f5d07a')
  chipGrad.addColorStop(1, '#b8851e')
  ctx.fillStyle = chipGrad
  ctx.roundRect(0, 0, 70, 55, 6)
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'
  ctx.lineWidth = 0.5
  ctx.strokeRect(0, 0, 70, 55)
  // chip lines
  ctx.strokeStyle = 'rgba(0,0,0,0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(25, 0)
  ctx.lineTo(25, 55)
  ctx.moveTo(45, 0)
  ctx.lineTo(45, 55)
  ctx.moveTo(0, 20)
  ctx.lineTo(70, 20)
  ctx.moveTo(0, 35)
  ctx.lineTo(70, 35)
  ctx.stroke()
  ctx.restore()

  // Restaurant name
  ctx.font = '500 26px system-ui'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('LE PETIT BISTROT', 56, 320)

  // Points label
  ctx.font = '500 18px system-ui'
  ctx.fillStyle = 'rgba(255,255,255,0.38)'
  ctx.fillText('POINTS FIDÉLITÉ', 56, 390)

  // Points value
  ctx.font = 'bold 80px system-ui'
  const ptGrad = ctx.createLinearGradient(56, 390, 320, 480)
  ptGrad.addColorStop(0, '#F59E0B')
  ptGrad.addColorStop(1, '#FBBF24')
  ctx.fillStyle = ptGrad
  ctx.fillText('1 248', 56, 480)

  // Bottom dots (like card number)
  ctx.font = '600 22px system-ui'
  ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ctx.fillText('•••• •••• •••• 4821', 56, 575)

  return new THREE.CanvasTexture(canvas)
}

interface CardProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

function LoyaltyCard({ mouseRef }: CardProps) {
  const groupRef = useRef<THREE.Group>(null)

  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null
    return createCardTexture()
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouseRef.current.y * 0.22,
      0.055
    )
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouseRef.current.x * 0.28 + 0.15,
      0.055
    )
  })

  if (!texture) return null

  return (
    <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.6}>
      <group ref={groupRef}>
        {/* Card front */}
        <mesh>
          <boxGeometry args={[4, 2.5, 0.06]} />
          <meshPhysicalMaterial
            map={texture}
            metalness={0.25}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.05}
            reflectivity={0.9}
            envMapIntensity={1.2}
          />
        </mesh>
        {/* Card back */}
        <mesh position={[0, 0, -0.031]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[4, 2.5]} />
          <meshPhysicalMaterial color="#12062b" metalness={0.2} roughness={0.3} clearcoat={0.5} />
        </mesh>
        {/* Glow rim */}
        <mesh>
          <boxGeometry args={[4.04, 2.54, 0.065]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.04} side={THREE.BackSide} />
        </mesh>
      </group>
    </Float>
  )
}

function Particles({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = 80

  const { positions, speeds } = useMemo(() => {
    const pos = Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 5 - 1,
    ])
    const spd = Array.from({ length: count }, () => 0.15 + Math.random() * 0.35)
    return { positions: pos, speeds: spd }
  }, [])

  const matrix = useMemo(() => new THREE.Matrix4(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    const mx = mouseRef.current.x * 0.3
    const my = mouseRef.current.y * 0.3

    positions.forEach((pos, i) => {
      const s = speeds[i]
      matrix.setPosition(
        pos[0] + Math.sin(t * s + i * 0.6) * 0.3 + mx * 0.5,
        pos[1] + Math.cos(t * s * 0.7 + i * 0.4) * 0.25 + my * 0.5,
        pos[2]
      )
      meshRef.current!.setMatrixAt(i, matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.022, 6, 6]} />
      <meshBasicMaterial color="#8b5cf6" transparent opacity={0.55} />
    </instancedMesh>
  )
}

function GoldParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = 30
  const matrix = useMemo(() => new THREE.Matrix4(), [])

  const positions = useMemo(
    () =>
      Array.from({ length: count }, () => [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3,
      ]),
    []
  )

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    positions.forEach((pos, i) => {
      matrix.setPosition(
        pos[0] + Math.sin(t * 0.2 + i) * 0.2,
        pos[1] + Math.cos(t * 0.15 + i * 0.7) * 0.2,
        pos[2]
      )
      meshRef.current!.setMatrixAt(i, matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.018, 6, 6]} />
      <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
    </instancedMesh>
  )
}

function SceneContent({
  mouseRef,
}: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 6]} intensity={3} color="#7c3aed" />
      <pointLight position={[-4, -3, 4]} intensity={1.5} color="#f59e0b" />
      <pointLight position={[0, 6, 2]} intensity={1} color="#ffffff" />
      <Environment preset="city" />
      <LoyaltyCard mouseRef={mouseRef} />
      <Particles mouseRef={mouseRef} />
      <GoldParticles />
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.35}
        scale={10}
        blur={2.5}
        far={5}
        color="#7c3aed"
      />
    </>
  )
}

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    mouseRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
  }

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseRef.current = { x: 0, y: 0 }
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SceneContent mouseRef={mouseRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}
