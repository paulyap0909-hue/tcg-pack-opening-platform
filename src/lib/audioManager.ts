import bgmLobbySrc from '../assets/audio/bgm-lobby.mp3'
import buttonClickSrc from '../assets/audio/button-click.mp3'
import cardFlipSrc from '../assets/audio/card-flip.mp3'
import errorSrc from '../assets/audio/error.mp3'
import packOpenSrc from '../assets/audio/pack-open.mp3'
import rareHitSrc from '../assets/audio/rare-hit.mp3'
import secretHitSrc from '../assets/audio/secret-hit.mp3'
import successSrc from '../assets/audio/success.mp3'

export type BgmName = 'lobby'

export type SfxName =
  | 'buttonClick'
  | 'packOpen'
  | 'cardFlip'
  | 'rareHit'
  | 'secretHit'
  | 'success'
  | 'error'

const AUDIO_ENABLED_KEY = 'tcg_audio_enabled'
const BGM_VOLUME_KEY = 'tcg_bgm_volume'
const SFX_VOLUME_KEY = 'tcg_sfx_volume'

const bgmSources: Record<BgmName, string> = {
  lobby: bgmLobbySrc,
}

const sfxSources: Record<SfxName, string> = {
  buttonClick: buttonClickSrc,
  packOpen: packOpenSrc,
  cardFlip: cardFlipSrc,
  rareHit: rareHitSrc,
  secretHit: secretHitSrc,
  success: successSrc,
  error: errorSrc,
}

const sfxNames = Object.keys(sfxSources) as SfxName[]

const isBrowser = () =>
  typeof window !== 'undefined' && typeof Audio !== 'undefined'

const getStoredNumber = (key: string, fallback: number) => {
  if (typeof window === 'undefined') return fallback

  const storedValue = Number(window.localStorage.getItem(key))
  return Number.isFinite(storedValue) ? storedValue : fallback
}

const getAudioContextConstructor = () => {
  if (typeof window === 'undefined') return null

  return (
    window.AudioContext ??
    (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext ??
    null
  )
}

class TcgAudioManager {
  private enabled = false
  private activeBgm: HTMLAudioElement | null = null
  private activeBgmName: BgmName | null = null
  private audioContext: AudioContext | null = null
  private sfxBuffers = new Map<SfxName, AudioBuffer>()
  private sfxBufferPromises = new Map<SfxName, Promise<AudioBuffer | null>>()
  private htmlAudioPools = new Map<SfxName, HTMLAudioElement[]>()
  private lastSfxPlayedAt = new Map<SfxName, number>()
  private lastButtonClickPlayedAt = 0

  get hasSavedPreference() {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(AUDIO_ENABLED_KEY) !== null
  }

  get isEnabled() {
    return this.enabled
  }

  getSavedPreference() {
    if (typeof window === 'undefined') return null

    const storedValue = window.localStorage.getItem(AUDIO_ENABLED_KEY)
    if (storedValue === null) return null

    return storedValue === 'true'
  }

  setEnabled(enabled: boolean, persist = true) {
    this.enabled = enabled

    if (persist && typeof window !== 'undefined') {
      window.localStorage.setItem(AUDIO_ENABLED_KEY, String(enabled))
    }

    if (enabled) {
      this.primeHtmlAudioPools()
      void this.warmUpSfx()
      return
    }

    this.stopBgm()
  }

  getBgmVolume() {
    return getStoredNumber(BGM_VOLUME_KEY, 0.24)
  }

  getSfxVolume() {
    return getStoredNumber(SFX_VOLUME_KEY, 0.72)
  }

  setBgmVolume(volume: number) {
    const normalizedVolume = Math.max(0, Math.min(1, volume))

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(BGM_VOLUME_KEY, String(normalizedVolume))
    }

    if (this.activeBgm) {
      this.activeBgm.volume = normalizedVolume
    }
  }

  setSfxVolume(volume: number) {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(SFX_VOLUME_KEY, String(Math.max(0, Math.min(1, volume))))
  }

  async enableWithSound() {
    this.setEnabled(true)
    await this.unlockAudioContext()
    void this.warmUpSfx()
    await this.playBgm('lobby')
    this.playSfx('success', { throttleMs: 0 })
  }

  continueMuted() {
    this.setEnabled(false)
  }

  private getAudioContext() {
    if (!isBrowser()) return null

    if (this.audioContext) return this.audioContext

    const AudioContextConstructor = getAudioContextConstructor()
    if (!AudioContextConstructor) return null

    this.audioContext = new AudioContextConstructor()
    return this.audioContext
  }

  private async unlockAudioContext() {
    const context = this.getAudioContext()

    if (!context) return false

    try {
      if (context.state === 'suspended') {
        await context.resume()
      }

      const buffer = context.createBuffer(1, 1, 22050)
      const source = context.createBufferSource()
      source.buffer = buffer
      source.connect(context.destination)
      source.start(0)

      return true
    } catch {
      return false
    }
  }

  private primeHtmlAudioPools() {
    if (!isBrowser()) return

    sfxNames.forEach((name) => {
      if (this.htmlAudioPools.has(name)) return

      const pool = Array.from({ length: name === 'buttonClick' ? 6 : 3 }, () => {
        const audio = new Audio(sfxSources[name])
        audio.preload = 'auto'
        audio.volume = this.getSfxVolume()
        audio.load()
        return audio
      })

      this.htmlAudioPools.set(name, pool)
    })
  }

  private async loadSfxBuffer(name: SfxName) {
    if (this.sfxBuffers.has(name)) return this.sfxBuffers.get(name) ?? null

    const existingPromise = this.sfxBufferPromises.get(name)
    if (existingPromise) return existingPromise

    const context = this.getAudioContext()

    if (!context || typeof fetch === 'undefined') return null

    const promise = fetch(sfxSources[name])
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((buffer) => {
        this.sfxBuffers.set(name, buffer)
        return buffer
      })
      .catch(() => null)

    this.sfxBufferPromises.set(name, promise)

    const buffer = await promise
    this.sfxBufferPromises.delete(name)

    return buffer
  }

  async warmUpSfx() {
    if (!isBrowser()) return

    this.primeHtmlAudioPools()
    await this.unlockAudioContext()

    void Promise.all(sfxNames.map((name) => this.loadSfxBuffer(name)))
  }

  stopBgm() {
    if (!this.activeBgm) return

    this.activeBgm.pause()
    this.activeBgm.currentTime = 0
    this.activeBgm = null
    this.activeBgmName = null
  }

  async playBgm(name: BgmName) {
    if (!isBrowser() || !this.enabled) return false

    if (this.activeBgmName === name && this.activeBgm) {
      if (this.activeBgm.paused) {
        try {
          await this.activeBgm.play()
          return true
        } catch {
          return false
        }
      }

      return true
    }

    this.stopBgm()

    const bgm = new Audio(bgmSources[name])
    bgm.loop = true
    bgm.volume = this.getBgmVolume()
    bgm.preload = 'auto'

    this.activeBgm = bgm
    this.activeBgmName = name

    try {
      await bgm.play()
      return true
    } catch {
      return false
    }
  }

  private playSfxBuffer(name: SfxName, volume: number) {
    const context = this.getAudioContext()
    const buffer = this.sfxBuffers.get(name)

    if (!context || !buffer) return false

    try {
      if (context.state === 'suspended') {
        void context.resume()
      }

      const source = context.createBufferSource()
      const gainNode = context.createGain()

      source.buffer = buffer
      gainNode.gain.value = volume

      source.connect(gainNode)
      gainNode.connect(context.destination)
      source.start(0)

      return true
    } catch {
      return false
    }
  }

  private playHtmlSfx(name: SfxName, volume: number) {
    if (!isBrowser()) return

    this.primeHtmlAudioPools()

    const pool = this.htmlAudioPools.get(name)
    if (!pool) return

    const audio =
      pool.find((item) => item.paused || item.ended) ??
      pool.reduce((oldestAudio, currentAudio) =>
        currentAudio.currentTime > oldestAudio.currentTime ? currentAudio : oldestAudio,
      )

    try {
      audio.pause()
      audio.currentTime = 0
      audio.volume = volume
      void audio.play().catch(() => undefined)
    } catch {
      // Browser rejected this play attempt; ignore so UI never breaks.
    }
  }

  private playSyntheticButtonClick(volume: number) {
    const context = this.getAudioContext()
    if (!context) return false

    const playClick = () => {
      try {
        const startTime = context.currentTime
        const clickOscillator = context.createOscillator()
        const clickGain = context.createGain()
        const snapOscillator = context.createOscillator()
        const snapGain = context.createGain()
        const masterGain = context.createGain()

        masterGain.gain.setValueAtTime(Math.min(0.18, volume * 0.18), startTime)

        clickOscillator.type = 'triangle'
        clickOscillator.frequency.setValueAtTime(980, startTime)
        clickOscillator.frequency.exponentialRampToValueAtTime(360, startTime + 0.045)

        clickGain.gain.setValueAtTime(0.0001, startTime)
        clickGain.gain.exponentialRampToValueAtTime(1, startTime + 0.004)
        clickGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.058)

        snapOscillator.type = 'square'
        snapOscillator.frequency.setValueAtTime(1800, startTime)
        snapOscillator.frequency.exponentialRampToValueAtTime(900, startTime + 0.024)

        snapGain.gain.setValueAtTime(0.0001, startTime)
        snapGain.gain.exponentialRampToValueAtTime(0.35, startTime + 0.002)
        snapGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.022)

        clickOscillator.connect(clickGain)
        clickGain.connect(masterGain)
        snapOscillator.connect(snapGain)
        snapGain.connect(masterGain)
        masterGain.connect(context.destination)

        clickOscillator.start(startTime)
        snapOscillator.start(startTime)
        clickOscillator.stop(startTime + 0.065)
        snapOscillator.stop(startTime + 0.03)

        return true
      } catch {
        return false
      }
    }

    if (context.state === 'suspended') {
      void context
        .resume()
        .then(() => {
          playClick()
        })
        .catch(() => undefined)

      return true
    }

    return playClick()
  }

  playButtonClick(options?: { throttleMs?: number; volume?: number }) {
    if (!isBrowser() || !this.enabled) return

    const throttleMs = options?.throttleMs ?? 70
    const now = Date.now()

    if (now - this.lastButtonClickPlayedAt < throttleMs) return

    this.lastButtonClickPlayedAt = now

    const volume = options?.volume ?? this.getSfxVolume()

    // V4: generate the UI tap sound directly with Web Audio.
    // This avoids short MP3 loading/decoding issues on mobile browsers.
    this.playSyntheticButtonClick(volume)
  }

  playSfx(name: SfxName, options?: { throttleMs?: number; volume?: number }) {
    if (name === 'buttonClick') {
      this.playButtonClick(options)
      return
    }

    if (!isBrowser() || !this.enabled) return

    const throttleMs = options?.throttleMs ?? 55
    const now = Date.now()
    const lastPlayedAt = this.lastSfxPlayedAt.get(name) ?? 0

    if (now - lastPlayedAt < throttleMs) return

    this.lastSfxPlayedAt.set(name, now)

    const volume = options?.volume ?? this.getSfxVolume()

    if (this.playSfxBuffer(name, volume)) return

    void this.loadSfxBuffer(name)
    this.playHtmlSfx(name, volume)
  }
}

export const audioManager = new TcgAudioManager()
