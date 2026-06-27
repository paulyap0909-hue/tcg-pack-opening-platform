import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, PackageOpen, ShieldCheck, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { Pack, RevealCard } from '../data/cardPool'
import { getOpenedTime, getWeightedRandomCard } from '../data/cardPool'
import type { VaultCard } from './VaultDrawer'

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
    setStage('opening')

    window.setTimeout(() => {
      setStage('revealed')
    }, 650)
  }

  const isRevealed = stage === 'revealed'

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/85 px-4 py-6 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="hud-panel hud-corners relative w-full max-w-5xl rounded-[2rem] p-6"
          initial={{ scale: 0.94, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 24 }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close opening modal"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-950/95 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition hover:scale-105 hover:bg-cyan-300/10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-6 border-b border-cyan-300/10 pb-5 pr-14">
            <div className="mb-3 flex items-center gap-2">
              <PackageOpen className="h-5 w-5 text-cyan-300" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                Pokémon Real Card Opening
              </p>
            </div>
            <h2 className="text-3xl font-black text-white">{pack.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              This demo now reveals real Pokémon TCG card images by URL and saves the result directly into My Vault.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-black/70 p-5">
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pack.glow} opacity-20`} />
              <div className="relative z-10">
                <div className={`hud-scanline flex h-[430px] items-center justify-center rounded-3xl bg-gradient-to-br ${pack.glow} p-[1px]`}>
                  <div className="flex h-full w-full items-center justify-center rounded-3xl bg-black/85 p-4">
                    <img src={pack.cover} alt={pack.name} className="h-full w-full object-contain" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-h-[430px] flex-col justify-between rounded-[2rem] border border-purple-300/10 bg-purple-300/[0.04] p-5">
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-200">
                    {result.setName}
                  </span>
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-200">
                    {result.rarity}
                  </span>
                  <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-purple-200">
                    {result.cardNumber}
                  </span>
                </div>

                <div className="flex justify-center">
                  <motion.div
                    className={`hud-rarity-glow flex h-[360px] w-full max-w-[260px] items-center justify-center rounded-3xl bg-gradient-to-br ${result.glow} p-[1px]`}
                    animate={stage === 'opening' ? { rotateY: [0, 180, 360], scale: [1, 1.04, 1] } : { rotateY: 0, scale: 1 }}
                    transition={{ duration: 0.65 }}
                  >
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-black/85 p-3">
                      {isRevealed ? (
                        <img src={result.image} alt={result.name} className="h-full w-full object-contain" />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] text-center">
                          <Sparkles className="mb-4 h-12 w-12 text-cyan-300" />
                          <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">Ready to Reveal</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {isRevealed && (
                  <div className="mt-5 text-center">
                    <h3 className="text-3xl font-black text-white">{result.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{result.description}</p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      Saved to Vault
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onBackToDetail ?? onClose}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-4 font-black text-cyan-200 transition hover:scale-[1.02] hover:bg-cyan-300/20"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Pack Details
                </button>

                <button
                  type="button"
                  disabled={stage === 'opening' || isRevealed}
                  onClick={revealCard}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-black transition ${
                    stage === 'opening' || isRevealed
                      ? 'cursor-not-allowed border border-slate-500/20 bg-slate-500/10 text-slate-500'
                      : 'bg-gradient-to-r from-cyan-300 to-purple-400 text-black shadow-[0_0_40px_rgba(34,211,238,0.28)] hover:scale-[1.02]'
                  }`}
                >
                  <ShieldCheck className="h-5 w-5" />
                  {isRevealed ? 'Revealed' : stage === 'opening' ? 'Opening...' : 'Reveal Card'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
