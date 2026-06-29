import { Howl, Howler } from 'howler'

import bgmLobbySrc from '../assets/audio/bgm-lobby.mp3'
import pokemonBgmSrc from '../assets/audio/pokemon-bgm.mp3'
import onePieceBgmSrc from '../assets/audio/onepiece-bgm.mp3'
import bidClickSrc from '../assets/audio/bid-click.wav'
import cardFlipSrc from '../assets/audio/card-flip.wav'
import errorSrc from '../assets/audio/error.wav'
import packOpenSrc from '../assets/audio/pack-open.mp3'
import rareHitSrc from '../assets/audio/rare-hit.mp3'
import secretHitSrc from '../assets/audio/secret-hit.mp3'
import successSrc from '../assets/audio/success.wav'

export type BgmName = 'lobby' | 'pokemon' | 'onePiece'

export type SfxName =
  | 'bidClick'
  | 'packOpen'
  | 'cardFlip'
  | 'rareHit'
  | 'secretHit'
  | 'success'
  | 'error'

const AUDIO_ENABLED_KEY = 'tcg_audio_enabled'
const BGM_VOLUME_KEY = 'tcg_bgm_volume'
const SFX_VOLUME_KEY = 'tcg_sfx_volume'

const DEFAULT_BGM_VOLUME = 0.24
const DEFAULT_SFX_VOLUME = 0.85

const bgmSources: Record<BgmName, string> = {
  lobby: bgmLobbySrc,
  pokemon: pokemonBgmSrc,
  onePiece: onePieceBgmSrc,
}

const sfxSources: Record<SfxName, string> = {
  bidClick: bidClickSrc,
  packOpen: packOpenSrc,
  cardFlip: cardFlipSrc,
  rareHit: rareHitSrc,
  secretHit: secretHitSrc,
  success: successSrc,
  error: errorSrc,
}

const sfxVolumeMultipliers: Record<SfxName, number> = {
  bidClick: 0.85,
  packOpen: 0.9,
  cardFlip: 1.2,
  rareHit: 0.95,
  secretHit: 0.95,
  success: 0.9,
  error: 0.82,
}

const isBrowser = () => typeof window !== 'undefined'

const safeStoredVolume = (key: string, fallback: number) => {
  if (typeof window === 'undefined') return fallback

  const storedValue = Number(window.localStorage.getItem(key))

  if (!Number.isFinite(storedValue) || storedValue <= 0 || storedValue > 1) {
    window.localStorage.setItem(key, String(fallback))
    return fallback
  }

  return storedValue
}

class TcgAudioManager {
  private enabled = false
  private activeBgm: Howl | null = null
  private activeBgmName: BgmName | null = null
  private desiredBgmName: BgmName = 'lobby'
  private bgmHowls = new Map<BgmName, Howl>()
  private sfxHowls = new Map<SfxName, Howl>()
  private lastSfxPlayedAt = new Map<SfxName, number>()

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
      Howler.mute(false)
      this.preloadAll()
      return
    }

    this.stopBgm()
  }

  getBgmVolume() {
    return safeStoredVolume(BGM_VOLUME_KEY, DEFAULT_BGM_VOLUME)
  }

  getSfxVolume() {
    return safeStoredVolume(SFX_VOLUME_KEY, DEFAULT_SFX_VOLUME)
  }

  private getSfxEffectiveVolume(name: SfxName, requestedVolume?: number) {
    const baseVolume = requestedVolume ?? this.getSfxVolume()
    const multiplier = sfxVolumeMultipliers[name] ?? 1

    return Math.max(0.01, Math.min(1, baseVolume * multiplier))
  }

  setBgmVolume(volume: number) {
    const normalizedVolume = Math.max(0.01, Math.min(1, volume))

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(BGM_VOLUME_KEY, String(normalizedVolume))
    }

    if (this.activeBgm) {
      this.activeBgm.volume(normalizedVolume)
    }
  }

  setSfxVolume(volume: number) {
    if (typeof window === 'undefined') return

    const normalizedVolume = Math.max(0.01, Math.min(1, volume))
    window.localStorage.setItem(SFX_VOLUME_KEY, String(normalizedVolume))

    this.sfxHowls.forEach((sound, name) => {
      sound.volume(this.getSfxEffectiveVolume(name, normalizedVolume))
    })
  }

  resetAudioSettings() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUDIO_ENABLED_KEY)
      window.localStorage.setItem(BGM_VOLUME_KEY, String(DEFAULT_BGM_VOLUME))
      window.localStorage.setItem(SFX_VOLUME_KEY, String(DEFAULT_SFX_VOLUME))
    }

    Howler.stop()
    Howler.mute(false)
    this.enabled = false
    this.activeBgm = null
    this.activeBgmName = null
    this.desiredBgmName = 'lobby'
    this.lastSfxPlayedAt.clear()
  }

  async enableWithSound() {
    this.setEnabled(true)
    this.unlockHowler()
    void this.warmUpSfx()
    await this.playBgm('lobby')
    this.playSfx('success', { throttleMs: 0, volume: 0.82 })
  }

  continueMuted() {
    this.setEnabled(false)
  }

  private unlockHowler() {
    if (!isBrowser()) return

    try {
      Howler.mute(false)

      const context = Howler.ctx
      if (context?.state === 'suspended') {
        void context.resume().catch(() => undefined)
      }
    } catch {
      // Keep UI safe if a browser rejects audio unlock.
    }
  }

  private getBgmHowl(name: BgmName) {
    const existingSound = this.bgmHowls.get(name)
    if (existingSound) return existingSound

    const sound = new Howl({
      src: [bgmSources[name]],
      loop: true,
      html5: true,
      preload: false,
      volume: this.getBgmVolume(),
    })

    this.bgmHowls.set(name, sound)

    return sound
  }

  private getSfxHowl(name: SfxName) {
    const existingSound = this.sfxHowls.get(name)
    if (existingSound) return existingSound

    const sound = new Howl({
      src: [sfxSources[name]],
      html5: false,
      preload: true,
      pool: 6,
      volume: this.getSfxEffectiveVolume(name),
    })

    this.sfxHowls.set(name, sound)

    return sound
  }

  preloadAll() {
    if (!isBrowser()) return

    ;(Object.keys(sfxSources) as SfxName[]).forEach((name) => {
      this.getSfxHowl(name)
    })
  }

  async warmUpSfx() {
    if (!isBrowser()) return

    this.unlockHowler()
    this.preloadAll()
  }

  stopBgm() {
    this.bgmHowls.forEach((sound) => {
      try {
        sound.stop()
      } catch {
        // Ignore browser audio stop failures.
      }
    })

    this.activeBgm = null
    this.activeBgmName = null
  }

  async playBgm(name: BgmName) {
    this.desiredBgmName = name

    if (!isBrowser() || !this.enabled) return false

    this.unlockHowler()

    if (this.activeBgmName === name && this.activeBgm?.playing()) {
      return true
    }

    if (this.activeBgmName !== name) {
      this.stopBgm()
    }

    const bgm = this.getBgmHowl(name)
    bgm.loop(true)
    bgm.volume(this.getBgmVolume())

    this.activeBgm = bgm
    this.activeBgmName = name

    try {
      if (!bgm.playing()) {
        bgm.play()
      }

      return true
    } catch {
      return false
    }
  }

  ensureBgmLoop(name?: BgmName) {
    if (!isBrowser() || !this.enabled) return

    const targetName = name ?? this.desiredBgmName ?? this.activeBgmName ?? 'lobby'

    if (this.activeBgmName !== targetName || !this.activeBgm?.playing()) {
      void this.playBgm(targetName)
      return
    }

    this.activeBgm.loop(true)
    this.activeBgm.volume(this.getBgmVolume())
  }

  playSfx(name: SfxName, options?: { throttleMs?: number; volume?: number }) {
    if (!isBrowser() || !this.enabled) return

    this.unlockHowler()

    const throttleMs = options?.throttleMs ?? 80
    const now = Date.now()
    const lastPlayedAt = this.lastSfxPlayedAt.get(name) ?? 0

    if (now - lastPlayedAt < throttleMs) return

    this.lastSfxPlayedAt.set(name, now)

    const sound = this.getSfxHowl(name)
    sound.volume(this.getSfxEffectiveVolume(name, options?.volume))

    try {
      sound.play()
    } catch {
      // Ignore rejected sound play attempts so the UI never breaks.
    }
  }
}

export const audioManager = new TcgAudioManager()
