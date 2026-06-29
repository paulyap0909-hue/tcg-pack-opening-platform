import { useCallback, useEffect, useState } from 'react'

import { audioManager, type SfxName } from '../lib/audioManager'

export default function useAudio() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() =>
    audioManager.getSavedPreference() ?? false,
  )
  const [isAudioGateOpen, setIsAudioGateOpen] = useState(() =>
    !audioManager.hasSavedPreference,
  )

  useEffect(() => {
    const savedPreference = audioManager.getSavedPreference()

    if (savedPreference === true) {
      audioManager.setEnabled(true, false)

      const unlockAudio = () => {
        void audioManager.warmUpSfx()
        audioManager.ensureBgmLoop()
      }

      window.addEventListener('pointerdown', unlockAudio, { once: true })
      window.addEventListener('touchstart', unlockAudio, { once: true })
      window.addEventListener('click', unlockAudio, { once: true })
      window.addEventListener('keydown', unlockAudio, { once: true })

      return () => {
        window.removeEventListener('pointerdown', unlockAudio)
        window.removeEventListener('touchstart', unlockAudio)
        window.removeEventListener('click', unlockAudio)
        window.removeEventListener('keydown', unlockAudio)
      }
    }

    audioManager.setEnabled(false, false)

    return undefined
  }, [])

  useEffect(() => {
    const keepBgmLooping = () => {
      if (document.visibilityState === 'hidden') return

      audioManager.ensureBgmLoop()
    }

    document.addEventListener('visibilitychange', keepBgmLooping)
    window.addEventListener('focus', keepBgmLooping)
    window.addEventListener('pageshow', keepBgmLooping)

    return () => {
      document.removeEventListener('visibilitychange', keepBgmLooping)
      window.removeEventListener('focus', keepBgmLooping)
      window.removeEventListener('pageshow', keepBgmLooping)
    }
  }, [])

  const enterWithSound = useCallback(async () => {
    setIsSoundEnabled(true)
    setIsAudioGateOpen(false)
    await audioManager.enableWithSound()
  }, [])

  const continueMuted = useCallback(() => {
    audioManager.continueMuted()
    setIsSoundEnabled(false)
    setIsAudioGateOpen(false)
  }, [])

  const toggleSound = useCallback(async () => {
    const nextSoundState = !audioManager.isEnabled

    if (nextSoundState) {
      setIsSoundEnabled(true)
      await audioManager.enableWithSound()
      return
    }

    audioManager.setEnabled(false)
    setIsSoundEnabled(false)
  }, [])

  const playSfx = useCallback((name: SfxName) => {
    audioManager.playSfx(name)
  }, [])

  return {
    isAudioGateOpen,
    isSoundEnabled,
    enterWithSound,
    continueMuted,
    toggleSound,
    playSfx,
  }
}
