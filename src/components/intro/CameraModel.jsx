import { forwardRef, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBox, useTexture } from '@react-three/drei'
import {
  createBezelTexture,
  createDistanceScaleTexture,
  createLeatherTexture,
  createSpeedDialTexture,
} from './cameraTextures'

/**
 * Kamera rangefinder 3D prosedural — dibangun dari primitif Three.js,
 * tanpa file .glb. Depan kamera menghadap +Z.
 *
 * refs yang diekspos (untuk animasi di CameraScene):
 *   lensFront  → titik tengah kaca depan (target zoom "cekrek")
 *   focusRing  → ring fokus yang berputar saat autofokus
 *   shutter    → tombol rana yang tertekan saat memotret
 */

const HALF_PI = Math.PI / 2

function useMaterials() {
  return useMemo(() => {
    const leatherBump = createLeatherTexture()
    return {
      champagne: new THREE.MeshStandardMaterial({ color: '#c8ad85', metalness: 1, roughness: 0.3 }),
      champagnePolished: new THREE.MeshStandardMaterial({ color: '#d9c19b', metalness: 1, roughness: 0.14 }),
      anodized: new THREE.MeshStandardMaterial({ color: '#191817', metalness: 0.75, roughness: 0.36 }),
      matte: new THREE.MeshStandardMaterial({ color: '#070707', metalness: 0, roughness: 0.95 }),
      matteInside: new THREE.MeshStandardMaterial({ color: '#050505', metalness: 0, roughness: 1, side: THREE.BackSide }),
      leather: new THREE.MeshStandardMaterial({
        color: '#1f1d1b',
        metalness: 0,
        roughness: 0.82,
        bumpMap: leatherBump,
        bumpScale: 2.2,
      }),
      lensGlass: new THREE.MeshPhysicalMaterial({
        color: '#0a0d13',
        metalness: 0.1,
        roughness: 0.02,
        clearcoat: 1,
        clearcoatRoughness: 0,
        iridescence: 1,
        iridescenceIOR: 1.35,
        iridescenceThicknessRange: [180, 520],
        envMapIntensity: 2.6,
      }),
      innerGlass: new THREE.MeshPhysicalMaterial({
        color: '#121a24',
        metalness: 0.2,
        roughness: 0.05,
        clearcoat: 1,
        iridescence: 0.7,
        iridescenceThicknessRange: [300, 700],
        envMapIntensity: 1.4,
      }),
      windowGlass: new THREE.MeshPhysicalMaterial({
        color: '#0c1015',
        metalness: 0.3,
        roughness: 0.04,
        clearcoat: 1,
        envMapIntensity: 1.8,
      }),
      frosted: new THREE.MeshStandardMaterial({
        color: '#f2ece2',
        metalness: 0,
        roughness: 0.35,
        emissive: '#fff4e0',
        emissiveIntensity: 0.45,
      }),
      afLamp: new THREE.MeshStandardMaterial({
        color: '#ff5a36',
        metalness: 0.1,
        roughness: 0.25,
        emissive: '#ff3b14',
        emissiveIntensity: 0.3,
      }),
      bezel: new THREE.MeshStandardMaterial({ map: createBezelTexture(), metalness: 0.5, roughness: 0.4 }),
      distance: new THREE.MeshStandardMaterial({ map: createDistanceScaleTexture(), metalness: 0.5, roughness: 0.42 }),
      speedDial: new THREE.MeshStandardMaterial({ map: createSpeedDialTexture(), metalness: 0.85, roughness: 0.32 }),
    }
  }, [])
}

/** Silinder yang sumbunya searah Z (depan lensa). */
function CylZ({ r, rFront = r, len, z = 0, material, segments = 72, open = false, ...props }) {
  return (
    <mesh position={[0, 0, z]} rotation={[HALF_PI, 0, 0]} material={material} {...props}>
      <cylinderGeometry args={[rFront, r, len, segments, 1, open]} />
    </mesh>
  )
}

/** Gerigi (knurling) memakai InstancedMesh, sumbu Z. */
function Knurl({ r, len, z = 0, count = 72, width = 0.022, depth = 0.028, material }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      dummy.position.set(Math.cos(a) * r, Math.sin(a) * r, z)
      dummy.rotation.set(0, 0, a - HALF_PI)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [r, z, count])
  return (
    <instancedMesh ref={ref} args={[undefined, material, count]}>
      <boxGeometry args={[width, depth, len]} />
    </instancedMesh>
  )
}

/** Kenop bergerigi di atas kamera (sumbu Y). */
function TopKnob({ position, r, h, material, ridgeMaterial = material, children }) {
  return (
    <group position={position}>
      <group rotation={[-HALF_PI, 0, 0]}>
        <CylZ r={r * 0.94} len={h} z={h / 2} material={material} />
        <Knurl r={r * 0.95} len={h * 0.82} z={h / 2} count={Math.round(r * 220)} width={0.018} depth={0.022} material={ridgeMaterial} />
      </group>
      {children}
    </group>
  )
}

function Lens({ m, lensFrontRef, focusRingRef }) {
  return (
    <group position={[0, -0.14, 0.5]}>
      {/* bayonet mount */}
      <CylZ r={0.74} len={0.08} z={0.04} material={m.champagne} />
      {/* barrel dasar */}
      <CylZ r={0.66} len={0.2} z={0.18} material={m.anodized} />
      {/* ring aperture bergerigi */}
      <CylZ r={0.67} len={0.14} z={0.35} material={m.anodized} />
      <Knurl r={0.675} len={0.11} z={0.35} count={90} material={m.anodized} />
      {/* skala jarak */}
      <CylZ r={0.635} len={0.18} z={0.51} material={m.distance} segments={96} />
      {/* ring fokus champagne + tuas fokus */}
      <group ref={focusRingRef} position={[0, 0, 0.68]}>
        <CylZ r={0.69} len={0.16} material={m.champagne} />
        <Knurl r={0.695} len={0.13} count={110} material={m.champagnePolished} />
        <mesh position={[0, -0.76, 0]} material={m.champagne}>
          <boxGeometry args={[0.2, 0.12, 0.1]} />
        </mesh>
        <mesh position={[0, -0.83, 0]} rotation={[HALF_PI, 0, 0]} material={m.champagnePolished}>
          <cylinderGeometry args={[0.07, 0.07, 0.1, 32]} />
        </mesh>
      </group>
      {/* barrel depan */}
      <CylZ r={0.6} rFront={0.61} len={0.14} z={0.83} material={m.anodized} />
      {/* bezel depan dengan tulisan melingkar */}
      <mesh position={[0, 0, 0.901]} material={m.bezel}>
        <ringGeometry args={[0.49, 0.61, 128]} />
      </mesh>
      <mesh position={[0, 0, 0.902]} material={m.champagnePolished}>
        <torusGeometry args={[0.607, 0.012, 12, 128]} />
      </mesh>
      {/* bagian dalam lensa */}
      <CylZ r={0.49} len={0.42} z={0.69} material={m.matteInside} open />
      <mesh position={[0, 0, 0.4]} material={m.matte}>
        <ringGeometry args={[0.14, 0.49, 64]} />
      </mesh>
      <mesh position={[0, 0, 0.02]} rotation={[HALF_PI, 0, 0]} material={m.innerGlass}>
        <sphereGeometry args={[0.6, 48, 12, 0, Math.PI * 2, 0, 0.6]} />
      </mesh>
      <mesh position={[0, 0, 0.52]} material={m.champagne}>
        <torusGeometry args={[0.345, 0.006, 8, 96]} />
      </mesh>
      {/* kaca depan (cembung, coating iridescent) */}
      <mesh position={[0, 0, -0.2354]} rotation={[HALF_PI, 0, 0]} material={m.lensGlass}>
        <sphereGeometry args={[1.2, 96, 16, 0, Math.PI * 2, 0, 0.4206]} />
      </mesh>
      <group ref={lensFrontRef} position={[0, 0, 0.97]} />
    </group>
  )
}

function FrontWindows({ m, logo, flashMatRef, afMatRef, flashLightRef }) {
  const z = 0.531
  useLayoutEffect(() => {
    if (flashMatRef) flashMatRef.current = m.frosted
    if (afMatRef) afMatRef.current = m.afLamp
  }, [m, flashMatRef, afMatRef])

  return (
    <group>
      {/* jendela viewfinder */}
      <RoundedBox args={[0.64, 0.32, 0.03]} radius={0.012} position={[-1.16, 0.74, z]} material={m.anodized} />
      <RoundedBox args={[0.56, 0.24, 0.03]} radius={0.01} position={[-1.16, 0.74, z + 0.01]} material={m.windowGlass} />
      {/* jendela flash / iluminator (menyala terang saat cekrek) */}
      <RoundedBox args={[0.42, 0.28, 0.03]} radius={0.012} position={[-0.48, 0.74, z]} material={m.anodized} />
      <RoundedBox args={[0.35, 0.21, 0.035]} radius={0.01} position={[-0.48, 0.74, z + 0.012]} material={m.frosted} />
      <pointLight ref={flashLightRef} position={[-0.48, 0.74, z + 0.35]} color="#fff7e8" intensity={0} distance={12} />
      {/* lampu indikator AF-assist / self-timer di bodi depan */}
      <group position={[-0.92, 0.18, 0]}>
        <CylZ r={0.068} len={0.04} z={0.51} material={m.champagnePolished} />
        <CylZ r={0.048} len={0.048} z={0.516} material={m.afLamp} />
      </group>
      {/* jendela rangefinder */}
      <RoundedBox args={[0.32, 0.28, 0.03]} radius={0.012} position={[1.24, 0.74, z]} material={m.anodized} />
      <RoundedBox args={[0.25, 0.21, 0.03]} radius={0.01} position={[1.24, 0.74, z + 0.01]} material={m.windowGlass} />
      {/* logo Efgraphy terukir di plat atas */}
      <mesh position={[0.42, 0.73, z + 0.002]}>
        <planeGeometry args={[0.46, 0.383]} />
        <meshStandardMaterial map={logo} transparent metalness={0.6} roughness={0.45} polygonOffset polygonOffsetFactor={-2} />
      </mesh>
      {/* eyepiece viewfinder & panel belakang lengkap (terlihat jelas saat kamera diputar 360 derajat) */}
      <group position={[0, 0, -0.5]}>
        {/* Eyepiece viewfinder belakang */}
        <RoundedBox args={[0.52, 0.32, 0.06]} radius={0.015} position={[1.14, 0.74, -0.04]} material={m.anodized} />
        <RoundedBox args={[0.42, 0.22, 0.07]} radius={0.01} position={[1.14, 0.74, -0.05]} material={m.windowGlass} />
        {/* Thumb-rest grip di kanan atas belakang */}
        <RoundedBox args={[0.62, 0.18, 0.08]} radius={0.03} position={[-1.25, 0.72, -0.04]} material={m.leather} />
        {/* Layar LCD belakang */}
        <RoundedBox args={[1.95, 1.12, 0.04]} radius={0.03} position={[0.22, -0.15, -0.01]} material={m.anodized} />
        <RoundedBox args={[1.8, 0.98, 0.05]} radius={0.02} position={[0.22, -0.15, -0.018]} material={m.windowGlass} />
        {/* 3 tombol fungsi di samping layar LCD */}
        {[0.24, -0.15, -0.54].map((yPos, idx) => (
          <mesh key={idx} position={[1.38, yPos, -0.02]} rotation={[HALF_PI, 0, 0]} material={m.champagnePolished}>
            <cylinderGeometry args={[0.075, 0.075, 0.05, 28]} />
          </mesh>
        ))}
        {/* D-Pad / Multi-selector di sebelah kanan belakang */}
        <mesh position={[-1.18, -0.18, -0.02]} rotation={[HALF_PI, 0, 0]} material={m.anodized}>
          <cylinderGeometry args={[0.28, 0.3, 0.05, 40]} />
        </mesh>
        <mesh position={[-1.18, -0.18, -0.03]} rotation={[HALF_PI, 0, 0]} material={m.champagnePolished}>
          <cylinderGeometry args={[0.11, 0.11, 0.06, 32]} />
        </mesh>
      </group>
    </group>
  )
}

function TopControls({ m, shutterRef }) {
  const top = 0.97
  return (
    <group>
      {/* kenop rewind */}
      <TopKnob position={[-1.2, top, -0.05]} r={0.24} h={0.17} material={m.champagne} ridgeMaterial={m.champagnePolished}>
        <mesh position={[0, 0.175, 0]} material={m.champagnePolished}>
          <cylinderGeometry args={[0.16, 0.2, 0.03, 48]} />
        </mesh>
      </TopKnob>
      {/* hot shoe */}
      <mesh position={[0.06, top + 0.025, -0.02]} material={m.anodized}>
        <boxGeometry args={[0.5, 0.05, 0.46]} />
      </mesh>
      <mesh position={[0.06, top + 0.06, -0.02]} material={m.champagne}>
        <boxGeometry args={[0.42, 0.025, 0.4]} />
      </mesh>
      {/* dial kecepatan rana */}
      <TopKnob position={[0.78, top, -0.06]} r={0.3} h={0.13} material={m.champagne} ridgeMaterial={m.champagnePolished}>
        <mesh position={[0, 0.132, 0]} rotation={[-HALF_PI, 0, 0]} material={m.speedDial}>
          <circleGeometry args={[0.28, 64]} />
        </mesh>
      </TopKnob>
      {/* tombol rana */}
      <group position={[1.33, top, 0.14]}>
        <mesh position={[0, 0.035, 0]} material={m.champagne}>
          <cylinderGeometry args={[0.14, 0.15, 0.07, 48]} />
        </mesh>
        <mesh ref={shutterRef} position={[0, 0.1, 0]} material={m.champagnePolished}>
          <cylinderGeometry args={[0.075, 0.08, 0.08, 40]} />
        </mesh>
      </group>
      {/* tuas pengokang film */}
      <group position={[1.33, top + 0.09, 0.14]} rotation={[0, 0.9, 0]}>
        <mesh position={[-0.28, 0, 0]} material={m.champagne}>
          <boxGeometry args={[0.5, 0.03, 0.07]} />
        </mesh>
        <mesh position={[-0.53, 0.03, 0]} material={m.anodized}>
          <cylinderGeometry args={[0.045, 0.045, 0.1, 24]} />
        </mesh>
      </group>
    </group>
  )
}

const CameraModel = forwardRef(function CameraModel(
  { lensFrontRef, focusRingRef, shutterRef, flashMatRef, afMatRef, flashLightRef, ...props },
  ref,
) {
  const m = useMaterials()
  const logo = useTexture('/logo-mark-dark.png')
  logo.colorSpace = THREE.SRGBColorSpace
  logo.anisotropy = 8

  return (
    <group ref={ref} {...props}>
      {/* bodi berlapis kulit */}
      <RoundedBox args={[3.4, 1.32, 1.0]} radius={0.1} smoothness={6} position={[0, -0.15, 0]} material={m.leather} />
      {/* plat atas & bawah champagne */}
      <RoundedBox args={[3.46, 0.5, 1.06]} radius={0.12} smoothness={6} position={[0, 0.72, 0]} material={m.champagne} />
      <RoundedBox args={[3.46, 0.2, 1.06]} radius={0.08} smoothness={6} position={[0, -0.86, 0]} material={m.champagne} />

      <FrontWindows m={m} logo={logo} flashMatRef={flashMatRef} afMatRef={afMatRef} flashLightRef={flashLightRef} />
      <TopControls m={m} shutterRef={shutterRef} />
      <Lens m={m} lensFrontRef={lensFrontRef} focusRingRef={focusRingRef} />

      {/* tombol pelepas lensa */}
      <group position={[-0.86, -0.5, 0]}>
        <CylZ r={0.07} len={0.06} z={0.52} material={m.champagnePolished} />
      </group>
      {/* lug tali kamera */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.75, 0.62, 0]}>
          <mesh rotation={[0, 0, HALF_PI]} material={m.champagne}>
            <cylinderGeometry args={[0.055, 0.055, 0.09, 24]} />
          </mesh>
          <mesh position={[side * 0.08, 0, 0]} rotation={[0, HALF_PI, 0]} material={m.champagnePolished}>
            <torusGeometry args={[0.09, 0.016, 12, 32]} />
          </mesh>
        </group>
      ))}
    </group>
  )
})

export default CameraModel
