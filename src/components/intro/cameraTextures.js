import * as THREE from 'three'

/**
 * Tekstur prosedural untuk kamera 3D (dibuat dengan <canvas>, tanpa file gambar).
 */

function makeCanvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')]
}

/** Tekstur kulit (leatherette) untuk bumpMap bodi kamera. */
export function createLeatherTexture() {
  const size = 512
  const [c, g] = makeCanvas(size, size)
  g.fillStyle = '#808080'
  g.fillRect(0, 0, size, size)
  // butiran kulit: ribuan bintik lembut terang/gelap
  for (let i = 0; i < 9000; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = 1 + Math.random() * 3.2
    const v = Math.random() > 0.5 ? 255 : 0
    g.fillStyle = `rgba(${v},${v},${v},${0.08 + Math.random() * 0.12})`
    g.beginPath()
    g.arc(x, y, r, 0, Math.PI * 2)
    g.fill()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(1.6, 1.6)
  return tex
}

/** Ring depan lensa dengan tulisan melingkar. Cocok untuk RingGeometry (UV planar). */
export function createBezelTexture() {
  const size = 1024
  const [c, g] = makeCanvas(size, size)
  const cx = size / 2
  g.fillStyle = '#0d0c0c'
  g.fillRect(0, 0, size, size)

  const text = 'EFGRAPHY  ·  MEMORY OF LENS  ·  EF-LENS 1:1.4 / 35mm  ·  KENDAL  ·  '
  const radius = 452
  g.font = '600 34px "Plus Jakarta Sans Variable", system-ui, sans-serif'
  g.fillStyle = '#e8e1d5'
  g.textAlign = 'center'
  g.textBaseline = 'middle'

  const totalWidth = [...text].reduce((w, ch) => w + g.measureText(ch).width, 0)
  const scale = (Math.PI * 2 * radius) / totalWidth
  let angle = -Math.PI / 2
  for (const ch of text) {
    const w = g.measureText(ch).width * scale
    angle += w / 2 / radius
    g.save()
    g.translate(cx + Math.cos(angle) * radius, cx + Math.sin(angle) * radius)
    g.rotate(angle + Math.PI / 2)
    g.fillText(ch, 0, 0)
    g.restore()
    angle += w / 2 / radius
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/** Skala jarak fokus di sisi barrel lensa (dibungkus melingkar pada silinder). */
export function createDistanceScaleTexture() {
  const w = 2048
  const h = 128
  const [c, g] = makeCanvas(w, h)
  g.fillStyle = '#121111'
  g.fillRect(0, 0, w, h)

  const labels = ['0.7', '0.8', '1', '1.2', '1.5', '2', '3', '5', '∞']
  const repeats = 3
  const step = w / (labels.length * repeats)
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  for (let r = 0; r < repeats; r++) {
    labels.forEach((label, i) => {
      const x = (r * labels.length + i + 0.5) * step
      g.fillStyle = label === '∞' ? '#c9ae86' : '#ece6dc'
      g.font = '600 46px "Plus Jakarta Sans Variable", system-ui, sans-serif'
      g.fillText(label, x, h * 0.42)
      g.fillStyle = 'rgba(236,230,220,0.85)'
      g.fillRect(x - 1.5, h * 0.74, 3, h * 0.26)
      g.fillRect(x + step / 2 - 1, h * 0.84, 2, h * 0.16)
    })
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.center.set(0.5, 0.5)
  tex.rotation = Math.PI
  tex.anisotropy = 8
  return tex
}

/** Angka kecepatan rana di atas dial (CircleGeometry, UV planar). */
export function createSpeedDialTexture() {
  const size = 512
  const [c, g] = makeCanvas(size, size)
  const cx = size / 2
  g.fillStyle = '#b99c72'
  g.fillRect(0, 0, size, size)
  // cincin halus seperti hasil bubut logam
  for (let r = 20; r < cx; r += 3) {
    g.strokeStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.06})`
    g.beginPath()
    g.arc(cx, cx, r, 0, Math.PI * 2)
    g.stroke()
  }
  const speeds = ['B', '1', '2', '4', '8', '15', '30', '60', '125', '250', '500', '1000']
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  speeds.forEach((s, i) => {
    const a = (i / speeds.length) * Math.PI * 2 - Math.PI / 2
    g.save()
    g.translate(cx + Math.cos(a) * 180, cx + Math.sin(a) * 180)
    g.rotate(a + Math.PI / 2)
    g.fillStyle = s === '250' ? '#7a1f17' : '#1b1917'
    g.font = '700 40px "Plus Jakarta Sans Variable", system-ui, sans-serif'
    g.fillText(s, 0, 0)
    g.restore()
  })
  g.fillStyle = '#1b1917'
  g.beginPath()
  g.arc(cx, cx, 16, 0, Math.PI * 2)
  g.fill()
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/** Tekstur starburst kilatan lampu flash kamera (additive sprite di jendela flash 3D). */
export function createFlashStarburstTexture() {
  const size = 512
  const [c, g] = makeCanvas(size, size)
  const cx = size / 2

  g.clearRect(0, 0, size, size)

  // Halo luar lembut hangat-putih
  const halo = g.createRadialGradient(cx, cx, 0, cx, cx, cx)
  halo.addColorStop(0, 'rgba(255, 255, 255, 1)')
  halo.addColorStop(0.14, 'rgba(255, 253, 248, 0.96)')
  halo.addColorStop(0.32, 'rgba(255, 244, 222, 0.55)')
  halo.addColorStop(0.62, 'rgba(255, 232, 195, 0.14)')
  halo.addColorStop(1, 'rgba(255, 255, 255, 0)')
  g.fillStyle = halo
  g.fillRect(0, 0, size, size)

  // Garis sinar difraksi tajam (horizontal, vertikal, & diagonal) khas lampu flash kamera
  const drawSpike = (angle, length, thickness, alpha) => {
    g.save()
    g.translate(cx, cx)
    g.rotate(angle)
    const grad = g.createLinearGradient(-length, 0, length, 0)
    grad.addColorStop(0, 'rgba(255,255,255,0)')
    grad.addColorStop(0.42, `rgba(255,250,240,${alpha * 0.55})`)
    grad.addColorStop(0.5, `rgba(255,255,255,${alpha})`)
    grad.addColorStop(0.58, `rgba(255,250,240,${alpha * 0.55})`)
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.beginPath()
    g.ellipse(0, 0, length, thickness, 0, 0, Math.PI * 2)
    g.fill()
    g.restore()
  }

  drawSpike(0, cx * 0.98, 7, 0.95)
  drawSpike(Math.PI / 2, cx * 0.92, 6, 0.9)
  drawSpike(Math.PI / 4, cx * 0.65, 4, 0.65)
  drawSpike(-Math.PI / 4, cx * 0.65, 4, 0.65)

  // Inti putih sangat terang
  const core = g.createRadialGradient(cx, cx, 0, cx, cx, cx * 0.16)
  core.addColorStop(0, 'rgba(255,255,255,1)')
  core.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = core
  g.fillRect(0, 0, size, size)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
