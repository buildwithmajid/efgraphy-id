import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import CameraModel from './CameraModel'
import { createFlashStarburstTexture } from './cameraTextures'

const BASE_DISTANCE = 8.6
const MODEL_CENTER_Y = 0.06
const INITIAL_YAW = -0.56 // posisi awal menyerong elegan 3D (~ -32 derajat)
const INITIAL_PITCH = 0.16 // sedikit menunduk agar top plate & dial 3D terlihat jelas
const FOV = 28
const HALF = Math.PI / 2
const TWO_PI = Math.PI * 2

const easeInOutCubic = (x) => {
  const t = Math.min(1, Math.max(0, x))
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function normalizeAngle(rad) {
  return (((rad + Math.PI) % TWO_PI) + TWO_PI) % TWO_PI - Math.PI
}

function Rig({ phaseRef, reducedMotion, onCameraClick, onReady }) {
  const group = useRef()
  const lensFront = useRef()
  const focusRing = useRef()
  const shutter = useRef()
  const flashMat = useRef()
  const afMat = useRef()
  const flashLight = useRef()
  const flashSprite = useRef()
  const hovered = useRef(false)
  // Posisi awal: MENYERONG 3D elegan seperti di awal; saat diklik baru berputar animasi hingga lurus (0, 0, 0)
  const targetOrbit = useRef({ y: INITIAL_YAW, x: INITIAL_PITCH })
  const alignStartRot = useRef({ x: INITIAL_PITCH, y: INITIAL_YAW, z: 0 })
  const alignStartPos = useRef({ x: 0, y: MODEL_CENTER_Y, z: 0 })
  const alignCaptured = useRef(false)
  const drag = useRef({ active: false, moved: false, startX: 0, startY: 0, baseRotY: 0, baseRotX: 0 })
  const { size, camera } = useThree()

  const flashTex = useMemo(() => createFlashStarburstTexture(), [])
  useEffect(() => () => flashTex.dispose(), [flashTex])

  // Lens-shift vertikal agar kamera duduk lega di atas judul "Memory of Lens"
  // tanpa kemiringan perspektif sedikit pun saat bergerak ke posisi lurus (0, 0, 0).
  useEffect(() => {
    const yOffset = Math.round(size.height * 0.145)
    camera.setViewOffset(size.width, size.height, 0, yOffset, size.width, size.height)
    camera.updateProjectionMatrix()
    return () => {
      camera.clearViewOffset()
      camera.updateProjectionMatrix()
    }
  }, [camera, size.width, size.height])

  useEffect(() => {
    if (group.current) {
      // Saat pertama kali tampil: mulai dari posisi menyerong 3D elegan
      group.current.rotation.set(INITIAL_PITCH, INITIAL_YAW, 0)
      group.current.position.set(0, MODEL_CENTER_Y, 0)
    }
    onReady?.()
    return () => {
      document.body.style.cursor = ''
    }
  }, [onReady])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    camera.position.set(0, MODEL_CENTER_Y, BASE_DISTANCE)
    camera.lookAt(0, MODEL_CENTER_Y, 0)

    const { phase, t0 } = phaseRef.current
    const now = performance.now()
    const elapsedPhase = (now - t0) / 1000
    const t = state.clock.elapsedTime

    const aspect = size.width / size.height
    const visibleHeight = 2 * BASE_DISTANCE * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const visibleWidth = visibleHeight * aspect
    const baseScale = Math.min(0.68, visibleWidth / 5.1, (size.height / 760) * 0.68)

    const isAligning = phase === 'align' || phase === 'strobe' || phase === 'whiteHold'
    const isStrobe = phase === 'strobe' || phase === 'whiteHold'

    if (!isAligning) {
      alignCaptured.current = false

      // Putar 360 DERAJAT mengikuti kursor saat kursor berada di atas kamera (atau sedang di-drag).
      // Saat kursor tidak di atas kamera, kamera tetap di posisi menyerong awal (atau sudut terakhirnya)
      // sehingga begitu tombol diklik terlihat jelas animasi kamera berputar ke posisi lurus sejajar!
      if (hovered.current && !drag.current.active) {
        const normX = THREE.MathUtils.clamp(state.pointer.x / 0.36, -1, 1)
        const normY = THREE.MathUtils.clamp((state.pointer.y - 0.28) / 0.34, -1, 1)
        targetOrbit.current.y = INITIAL_YAW + normX * Math.PI
        targetOrbit.current.x = INITIAL_PITCH - normY * 0.38
      }

      const idleY = targetOrbit.current.y + Math.sin(t * 0.6) * 0.02
      const idleX = targetOrbit.current.x + Math.cos(t * 0.7) * 0.012

      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, idleY, 5.5, delta)
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, idleX, 5.5, delta)
      g.rotation.z = THREE.MathUtils.damp(g.rotation.z, 0, 8, delta)

      const floatY = Math.sin(t * 0.9) * 0.03
      g.position.x = THREE.MathUtils.damp(g.position.x, 0, 6, delta)
      g.position.y = THREE.MathUtils.damp(g.position.y, MODEL_CENTER_Y + floatY, 6, delta)
      g.position.z = THREE.MathUtils.damp(g.position.z, hovered.current ? 0.14 : 0, 6, delta)
    } else {
      // Begitu diklik: animasi bergerak jelas selama 0.95 detik dari posisi menyerong / 360°
      // hingga berhenti LURUS SEJAJAR KE DEPAN (0, 0, 0), diam sebentar, lalu menyalakan FLASH!
      if (!alignCaptured.current) {
        alignCaptured.current = true
        const currentY = normalizeAngle(g.rotation.y)
        g.rotation.y = currentY
        alignStartRot.current = { x: g.rotation.x, y: currentY, z: g.rotation.z }
        alignStartPos.current = { x: g.position.x, y: g.position.y, z: g.position.z }
      }

      const p = isStrobe ? 1 : easeInOutCubic(elapsedPhase / 0.95)
      const recoilZ = isStrobe ? -0.14 * Math.exp(-elapsedPhase * 11) : 0

      g.rotation.x = THREE.MathUtils.lerp(alignStartRot.current.x, 0, p)
      g.rotation.y = THREE.MathUtils.lerp(alignStartRot.current.y, 0, p)
      g.rotation.z = THREE.MathUtils.lerp(alignStartRot.current.z, 0, p)

      g.position.x = THREE.MathUtils.lerp(alignStartPos.current.x, 0, p)
      g.position.y = THREE.MathUtils.lerp(alignStartPos.current.y, MODEL_CENTER_Y, p)
      g.position.z = THREE.MathUtils.lerp(alignStartPos.current.z, 0.35, p) + recoilZ
    }

    const s = THREE.MathUtils.damp(g.scale.x, baseScale, 6, delta)
    g.scale.setScalar(s)

    // Ring fokus berputar mengunci fokus
    if (focusRing.current) {
      const targetRing = isAligning ? 0.65 : hovered.current ? 0.22 : 0
      focusRing.current.rotation.z = THREE.MathUtils.damp(focusRing.current.rotation.z, targetRing, 12, delta)
    }

    // Tombol rana di atas kamera tertekan saat memotret
    if (shutter.current) {
      const targetShutter = isStrobe ? 0.042 : phase === 'align' ? 0.08 : 0.1
      shutter.current.position.y = THREE.MathUtils.damp(shutter.current.position.y, targetShutter, 24, delta)
    }

    // Lampu AF-assist merah-oranye berkedip saat kamera membidik kita
    if (afMat.current) {
      let afTarget = hovered.current ? 1.2 : 0.35
      if (phase === 'align') {
        afTarget = Math.sin(elapsedPhase * 32) > -0.15 ? 8 : 0.5
      } else if (isStrobe) {
        afTarget = 14
      }
      afMat.current.emissiveIntensity = THREE.MathUtils.damp(afMat.current.emissiveIntensity, afTarget, 22, delta)
    }

    // Jendela Flash 3D + sprite starburst cahaya flash yang memancar langsung dari jendela flash kamera!
    if (flashMat.current) {
      const flashTarget = isStrobe ? 45 : phase === 'align' ? 1.4 : 0.5
      flashMat.current.emissiveIntensity = THREE.MathUtils.damp(flashMat.current.emissiveIntensity, flashTarget, 32, delta)
    }
    if (flashLight.current) {
      const lightTarget = isStrobe ? 90 : 0
      flashLight.current.intensity = THREE.MathUtils.damp(flashLight.current.intensity, lightTarget, 32, delta)
    }
    if (flashSprite.current) {
      flashSprite.current.visible = isStrobe
      if (isStrobe) {
        // Kilatan starburst muncul cepat dari jendela flash lalu membesar membutakan layar
        const burst = Math.min(1, elapsedPhase / 0.26)
        const scale = 1.4 + Math.pow(burst, 1.35) * 14
        flashSprite.current.scale.set(scale, scale, 1)
        flashSprite.current.material.opacity = Math.min(1, 0.75 + burst * 0.25)
      }
    }
  })

  return (
    <group
      ref={group}
      onClick={(e) => {
        e.stopPropagation()
        if (!drag.current.moved) onCameraClick?.()
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
        drag.current.active = true
        drag.current.moved = false
        drag.current.startX = e.clientX
        drag.current.startY = e.clientY
        drag.current.baseRotY = targetOrbit.current.y
        drag.current.baseRotX = targetOrbit.current.x
      }}
      onPointerMove={(e) => {
        if (!drag.current.active) return
        const dx = (e.clientX - drag.current.startX) / Math.max(1, size.width)
        const dy = (e.clientY - drag.current.startY) / Math.max(1, size.height)
        if (Math.hypot(dx, dy) > 0.04) drag.current.moved = true
        targetOrbit.current.y = drag.current.baseRotY + dx * TWO_PI
        targetOrbit.current.x = THREE.MathUtils.clamp(drag.current.baseRotX + dy * 1.6, -0.55, 0.55)
      }}
      onPointerUp={() => {
        drag.current.active = false
      }}
      onPointerOver={() => {
        hovered.current = true
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        hovered.current = false
        drag.current.active = false
        document.body.style.cursor = ''
      }}
    >
      <CameraModel
        lensFrontRef={lensFront}
        focusRingRef={focusRing}
        shutterRef={shutter}
        flashMatRef={flashMat}
        afMatRef={afMat}
        flashLightRef={flashLight}
      />
      {/* Starburst kilatan lampu flash yang memancar TEPAT dari jendela flash putih pada bodi kamera */}
      <sprite ref={flashSprite} position={[-0.48, 0.74, 0.65]} visible={false}>
        <spriteMaterial
          map={flashTex}
          color="#ffffff"
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>
      <ContactShadows position={[0, -1.25, 0]} scale={7} resolution={512} blur={2.6} far={2.2} opacity={0.75} color="#000000" />
    </group>
  )
}

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[4, 6, 6]} intensity={1.45} color="#fff6ea" />
      <directionalLight position={[-6, 2, -4]} intensity={0.95} color="#c2a67e" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 6, 1]} rotation-x={HALF} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={2.8} color="#fff1dc" position={[-6, 1, 2]} rotation-y={HALF} scale={[2.2, 8, 1]} />
        <Lightformer form="rect" intensity={2.6} color="#fff1dc" position={[6, 1, 2]} rotation-y={-HALF} scale={[2.2, 8, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#fff7eb" position={[0, 1.6, 8]} scale={[7, 3.5, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#fff1dc" position={[0, 1.5, -8]} scale={[7, 3.5, 1]} />
        <Lightformer form="ring" intensity={2.4} color="#f3e3c8" position={[0, 0.06, 7]} scale={2.2} />
        <Lightformer form="rect" intensity={0.6} color="#3a2e22" position={[0, -5, 0]} rotation-x={-HALF} scale={[12, 12, 1]} />
      </Environment>
    </>
  )
}

export default function CameraScene({ phaseRef, reducedMotion, onCameraClick, onReady }) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.75]}
      camera={{ position: [0, MODEL_CENTER_Y, BASE_DISTANCE], fov: FOV, near: 0.05, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.08
        camera.lookAt(0, MODEL_CENTER_Y, 0)
      }}
    >
      <Suspense fallback={null}>
        <StudioLights />
        <Rig phaseRef={phaseRef} reducedMotion={reducedMotion} onCameraClick={onCameraClick} onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
