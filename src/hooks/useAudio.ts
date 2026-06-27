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
        void audioManager.playBgm('lobby')
      }

      window.addEventListener('pointerdown', unlockAudio, { once: true })
      window.addEventListener('keydown', unlockAudio, { once: true })

      return () => {
        window.removeEventListener('pointerdown', unlockAudio)
        window.removeEventListener('keydown', unlockAudio)
      }
    }

    audioManager.setEnabled(false, false)

    return undefined
  }, [])

  useEffect(() => {
    const handleGlobalButtonClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return

      const clickableElement = target.closest('button, a, [role="button"]')
      if (!clickableElement) return
      if (clickableElement.getAttribute('data-audio-silent') === 'true') return

      audioManager.playSfx('buttonClick')
    }

    document.addEventListener('click', handleGlobalButtonClick, true)

    return () => {
      document.removeEventListener('click', handleGlobalButtonClick, true)
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
