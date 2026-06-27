import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  Gem,
  PackageOpen,
  ShieldCheck,
  Sparkles,
  Stars,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { Pack, RevealCard } from '../data/cardPool'
import { getOpenedTime, getWeightedRandomCard } from '../data/cardPool'
import type { VaultCard } from './VaultDrawer'
import { audioManager } from '../lib/audioManager'

type PackOpeningModalProps = {
  pack: Pack | null
  onClose: () => void
  onBackToDetail?: () => void
  onAddToVault: (card: VaultCard) => void
}

type Stage = 'ready' | 'opening' | 'revealed'

const createVaultCard = (result: RevealCard, pack: Pack): VaultCard => ({
  id: `${Date.now()}-${result.id}-${Math.random().toString(16).slice(2)}`,
  name: result.name,
  rarity: result.rarity,
  grade: result.grade,
  image: result.image,
  sourcePack: pack.name,
  openedAt: getOpenedTime(),
  status: 'Stored',
})

export default function PackOpeningModal({
  pack,
  onClose,
  onBackToDetail,
  onAddToVault,
}: PackOpeningModalProps) {
  const [stage, setStage] = useState<Stage>('ready')
  const [result, setResult] = useState<RevealCard | null>(null)
  const savedResultIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!pack) return

    setStage('ready')
    setResult(getWeightedRandomCard(pack.name))
    savedResultIdRef.current = null
  }, [pack])

  useEffect(() => {
    if (!pack) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [pack, onClose])

  if (!pack || !result) return null

  const saveCurrentResultToVault = () => {
    if (savedResultIdRef.current === result.id) return

    onAddToVault(createVaultCard(result, pack))
    savedResultIdRef.current = result.id
  }

  const revealCard = () => {
    saveCurrentResultToVault()
    audioManager.playSfx('packOpen')
    setStage('opening')

    window.setTimeout(() => {
      audioManager.playSfx('cardFlip')

      if (result.rank >= 5) {
        audioManager.playSfx('secretHit')
      } else if (result.rank >= 2) {
        audioManager.playSfx('rareHit')
      }

      setStage('revealed')
    }, 650)
  }

  const isRevealed = stage === 'revealed'

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] flex items-end justify-center overflow-hidden bg-black/88 px-0 py-0 backdrop-blur-xl sm:items-center sm:overflow-y-auto sm:px-4 sm:py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="hud-panel relative flex h-[100svh] w-full max-w-5xl flex-col overflow-hidden rounded-none border-0 p-0 sm:h-auto sm:max-h-[92vh] sm:rounded-[2rem] sm:border sm:p-6"
          initial={{ scale: 0.96, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 24 }}
        >
          <div className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-cyan-300/10 bg-[#050b18]/95 px-4 backdrop-blur-xl sm:hidden">
            <button
              type="button"
              onClick={onBackToDetail ?? onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-cyan-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
                Open 1 Pack
              </p>
              <p className="max-w-[190px] truncate text-xs font-bold text-slate-400">
                {pack.name}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-cyan-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close opening modal"
            className="absolute right-5 top-5 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-950/95 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition hover:scale-105 hover:bg-cyan-300/10 sm:flex"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="hidden border-b border-cyan-300/10 pb-5 pr-14 sm:mb-6 sm:block">
            <div className="mb-3 flex items-center gap-2">
              <PackageOpen className="h-5 w-5 text-cyan-300" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                Pokémon Real Card Opening
              </p>
            </div>
            <h2 className="text-3xl font-black text-white">{pack.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Real Pokémon TCG card image reveals and saves directly into My Vault.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-[calc(94px+env(safe-area-inset-bottom))] pt-4 sm:overflow-visible sm:p-0">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-[360px_1fr]">
              <div className="relative hidden overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-black/70 p-5 lg:block">
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pack.glow} opacity-20`} />
                <div className="relative z-10">
                  <div className={`hud-scanline flex h-[430px] items-center justify-center rounded-3xl bg-gradient-to-br ${pack.glow} p-[1px]`}>
                    <div className="flex h-full w-full items-center justify-center rounded-3xl bg-black/85 p-4">
                      <img src={pack.cover} alt={pack.name} className="h-full w-full object-contain" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-col rounded-[1.5rem] border border-purple-300/10 bg-purple-300/[0.04] p-4 sm:min-h-[430px] sm:rounded-[2rem] sm:p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-200">
                    {stage === 'ready'
                      ? 'Ready'
                      : stage === 'opening'
                        ? 'Opening'
                        : 'Saved'}
                  </span>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-200">
                    Auto Vault
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-start">
                  <div className={`hud-rarity-glow flex h-[360px] items-center justify-center rounded-[1.4rem] bg-gradient-to-br ${result.glow} p-[1px] sm:h-[430px] sm:rounded-3xl`}>
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.4rem] bg-black/85 p-3 sm:rounded-3xl">
                      {isRevealed ? (
                        <motion.img
                          src={result.image}
                          alt={result.name}
                          className="h-full w-full object-contain"
                          initial={{ rotateY: 90, opacity: 0, scale: 0.86 }}
                          animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                          transition={{ duration: 0.52 }}
                        />
                      ) : (
                        <motion.div
                          className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.3rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_50%_22%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_50%_78%,rgba(168,85,247,0.18),transparent_38%),linear-gradient(145deg,#040816,#081126_45%,#050710)] text-center sm:rounded-3xl"
                          animate={
                            stage === 'opening'
                              ? { rotateY: [0, 120, 260, 360], scale: [1, 1.04, 0.96, 1] }
                              : { rotateY: 0, scale: 1 }
                          }
                          transition={{ duration: 0.65 }}
                        >
                          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(103,232,249,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.22)_1px,transparent_1px)] [background-size:34px_34px]" />
                          <div className="pointer-events-none absolute inset-5 rounded-[1.2rem] border border-cyan-300/20 bg-gradient-to-br from-slate-950/80 via-[#091129]/70 to-slate-950/80 shadow-[inset_0_0_55px_rgba(34,211,238,0.09)] sm:rounded-[1.6rem]" />
                          <div className="pointer-events-none absolute inset-4 rounded-[1.4rem] border border-purple-300/35 shadow-[0_0_45px_rgba(168,85,247,0.18)] sm:rounded-[1.9rem]" />
                          <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
                          <div className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-300/10 blur-3xl" />

                          <div className="pointer-events-none absolute left-[12%] top-[14%] h-2 w-2 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(103,232,249,0.85)]" />
                          <div className="pointer-events-none absolute right-[14%] top-[19%] h-1.5 w-1.5 rounded-full bg-purple-300/80 shadow-[0_0_18px_rgba(216,180,254,0.85)]" />
                          <div className="pointer-events-none absolute left-[18%] bottom-[20%] h-1.5 w-1.5 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(103,232,249,0.85)]" />
                          <div className="pointer-events-none absolute right-[17%] bottom-[15%] h-2 w-2 rounded-full bg-purple-300/80 shadow-[0_0_18px_rgba(216,180,254,0.85)]" />

                          <div className="relative z-10 flex w-full flex-col items-center justify-center px-6">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-200">
                              <Stars className="h-3.5 w-3.5" />
                              Premium Reveal
                            </div>

                            <div className="relative flex h-[220px] w-[78%] max-w-[260px] items-center justify-center rounded-[1.8rem] border border-cyan-300/35 bg-[linear-gradient(145deg,rgba(4,10,24,0.96),rgba(9,17,41,0.86),rgba(6,8,18,0.96))] shadow-[0_0_30px_rgba(34,211,238,0.14),0_0_65px_rgba(168,85,247,0.12)] sm:h-[270px]">
                              <div className="absolute inset-[8px] rounded-[1.45rem] border border-white/8 bg-gradient-to-br from-slate-950/90 via-[#081126]/85 to-slate-950/90" />
                              <div className="absolute inset-0 rounded-[1.8rem] bg-[conic-gradient(from_120deg,rgba(34,211,238,0.0),rgba(34,211,238,0.22),rgba(168,85,247,0.18),rgba(34,211,238,0.0))] opacity-80 blur-[1px]" />
                              <div className="relative z-10 flex flex-col items-center">
                                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.25)]">
                                  <Sparkles className="h-8 w-8" />
                                </div>
                                <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-200">
                                  Sealed Card
                                </p>
                                <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-purple-200">
                                  Vault Protected
                                </p>
                              </div>
                              <div className="absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-cyan-200/80" />
                              <div className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-purple-200/80" />
                            </div>

                            <div className="mt-6 flex items-center gap-2 rounded-full border border-purple-300/20 bg-purple-300/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-purple-200">
                              <Gem className="h-3.5 w-3.5" />
                              Tap to Reveal
                            </div>
                            <p className="mt-4 max-w-[240px] text-sm leading-6 text-slate-400">
                              A premium sealed reveal is waiting inside. Flip to uncover your card.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.2rem] border border-white/10 bg-black/25 p-3 sm:rounded-2xl sm:p-4">
                    {isRevealed ? (
                      <>
                        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-300">
                          Result
                        </p>
                        <h3 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">
                          {result.name}
                        </h3>
                        <p className="mt-2 text-sm font-bold text-cyan-200">
                          {result.rarity}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {result.setName}
                        </p>

                        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-200">
                          <CheckCircle2 className="h-5 w-5" />
                          Saved to Vault
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
                          Next Step
                        </p>
                        <h3 className="mt-2 text-2xl font-black leading-tight text-white">
                          Reveal Your Card
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          The result will save into Vault automatically after reveal.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 hidden gap-3 sm:flex">
                  {onBackToDetail && (
                    <button
                      type="button"
                      onClick={onBackToDetail}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-slate-300 transition hover:bg-white/[0.08]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Detail
                    </button>
                  )}

                  {!isRevealed ? (
                    <button
                      type="button"
                      onClick={revealCard}
                      className="hud-button inline-flex flex-[2] items-center justify-center gap-2 px-5 py-3 text-sm"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Reveal Card
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onClose}
                      className="hud-button inline-flex flex-[2] items-center justify-center gap-2 px-5 py-3 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Continue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-[#050b18]/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden">
            {!isRevealed ? (
              <button
                type="button"
                onClick={revealCard}
                className="hud-button flex w-full items-center justify-center gap-2 px-5 py-4 text-sm"
              >
                <ShieldCheck className="h-4 w-4" />
                Reveal Card
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="hud-button flex w-full items-center justify-center gap-2 px-5 py-4 text-sm"
              >
                <CheckCircle2 className="h-4 w-4" />
                Continue
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
