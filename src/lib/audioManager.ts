import bgmLobbySrc from '../assets/audio/bgm-lobby.mp3'
import bidClickSrc from '../assets/audio/bid-click.mp3'
import buttonClickSrc from '../assets/audio/button-click.mp3'
import cardFlipSrc from '../assets/audio/card-flip.mp3'
import errorSrc from '../assets/audio/error.mp3'
import navSwitchSrc from '../assets/audio/nav-switch.mp3'
import packOpenSrc from '../assets/audio/pack-open.mp3'
import rareHitSrc from '../assets/audio/rare-hit.mp3'
import secretHitSrc from '../assets/audio/secret-hit.mp3'
import successSrc from '../assets/audio/success.mp3'

export type BgmName = 'lobby'

export type SfxName =
  | 'buttonClick'
  | 'navSwitch'
  | 'packOpen'
  | 'cardFlip'
  | 'rareHit'
  | 'secretHit'
  | 'bidClick'
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
  navSwitch: navSwitchSrc,
  packOpen: packOpenSrc,
  cardFlip: cardFlipSrc,
  rareHit: rareHitSrc,
  secretHit: secretHitSrc,
  bidClick: bidClickSrc,
  success: successSrc,
  error: errorSrc,
}

const isBrowser = () => typeof window !== 'undefined' && typeof Audio !== 'undefined'

const getStoredNumber = (key: string, fallback: number) => {
  if (typeof window === 'undefined') return fallback

  const storedValue = Number(window.localStorage.getItem(key))
  return Number.isFinite(storedValue) ? storedValue : fallback
}

class TcgAudioManager {
  private enabled = false
  private activeBgm: HTMLAudioElement | null = null
  private activeBgmName: BgmName | null = null
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

    if (!enabled) {
      this.stopBgm()
    }
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
    await this.playBgm('lobby')
    this.playSfx('success', { throttleMs: 0 })
  }

  continueMuted() {
    this.setEnabled(false)
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

  playSfx(name: SfxName, options?: { throttleMs?: number; volume?: number }) {
    if (!isBrowser() || !this.enabled) return

    const throttleMs = options?.throttleMs ?? 80
    const now = Date.now()
    const lastPlayedAt = this.lastSfxPlayedAt.get(name) ?? 0

    if (now - lastPlayedAt < throttleMs) return

    this.lastSfxPlayedAt.set(name, now)

    const sfx = new Audio(sfxSources[name])
    sfx.volume = options?.volume ?? this.getSfxVolume()
    sfx.preload = 'auto'

    void sfx.play().catch(() => undefined)
  }
}

export const audioManager = new TcgAudioManager()
