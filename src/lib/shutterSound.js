/**
 * Suara rana kamera ("cekrek") yang disintesis langsung dengan Web Audio API,
 * jadi tidak perlu file audio. Harus dipanggil dari aksi user (klik / tombol).
 */

let ctx = null

function getContext() {
  if (typeof window === 'undefined') return null
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  if (!ctx) ctx = new AudioCtx()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function noiseBuffer(ac, seconds) {
  const length = Math.floor(ac.sampleRate * seconds)
  const buffer = ac.createBuffer(1, length, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    // derau yang meluruh cepat → karakter "klak" mekanis
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3)
  }
  return buffer
}

function clack(ac, at, { freq, q, gain, length }) {
  const src = ac.createBufferSource()
  src.buffer = noiseBuffer(ac, length)

  const band = ac.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = freq
  band.Q.value = q

  const amp = ac.createGain()
  amp.gain.setValueAtTime(0, at)
  amp.gain.linearRampToValueAtTime(gain, at + 0.002)
  amp.gain.exponentialRampToValueAtTime(0.0001, at + length)

  src.connect(band).connect(amp).connect(ac.destination)
  src.start(at)
  src.stop(at + length + 0.02)
}

function thump(ac, at) {
  const osc = ac.createOscillator()
  const amp = ac.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(140, at)
  osc.frequency.exponentialRampToValueAtTime(48, at + 0.06)
  amp.gain.setValueAtTime(0.0001, at)
  amp.gain.exponentialRampToValueAtTime(0.35, at + 0.004)
  amp.gain.exponentialRampToValueAtTime(0.0001, at + 0.08)
  osc.connect(amp).connect(ac.destination)
  osc.start(at)
  osc.stop(at + 0.1)
}

export function playShutterSound() {
  const ac = getContext()
  if (!ac) return
  const t = ac.currentTime + 0.01
  // tirai pertama membuka
  clack(ac, t, { freq: 3200, q: 0.9, gain: 0.55, length: 0.045 })
  thump(ac, t)
  // tirai kedua menutup + cermin kembali
  clack(ac, t + 0.075, { freq: 2200, q: 1.2, gain: 0.45, length: 0.06 })
  clack(ac, t + 0.085, { freq: 5200, q: 2, gain: 0.18, length: 0.03 })
  thump(ac, t + 0.075)
}

/** Bunyi "bip" fokus terkunci yang halus. */
export function playFocusBeep() {
  const ac = getContext()
  if (!ac) return
  const t = ac.currentTime + 0.01
  ;[0, 0.09].forEach((offset) => {
    const osc = ac.createOscillator()
    const amp = ac.createGain()
    osc.type = 'sine'
    osc.frequency.value = 2650
    amp.gain.setValueAtTime(0.0001, t + offset)
    amp.gain.exponentialRampToValueAtTime(0.06, t + offset + 0.005)
    amp.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.06)
    osc.connect(amp).connect(ac.destination)
    osc.start(t + offset)
    osc.stop(t + offset + 0.07)
  })
}
