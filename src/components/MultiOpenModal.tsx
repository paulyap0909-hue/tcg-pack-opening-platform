import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  Crown,
  Grid2X2,
  PackageOpen,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { Pack, RevealCard } from '../data/cardPool'
import { createWeightedResults, getBestPull, getOpenedTime } from '../data/cardPool'
import type { VaultCard } from './VaultDrawer'

type MultiOpenModalProps = {
  pack: Pack | null
  quantity: number
  onClose: () => void
  onBackToDetail?: () => void
  onAddAllToVault: (cards: VaultCard[]) => void
}

const createVaultCards = (
  results: RevealCard[],
  pack: Pack,
): VaultCard[] => {
  const openedAt = getOpenedTime()

  return results.map((result, index) => ({
    id: `${Date.now()}-${result.id}-${index}-${Math.random().toString(16).slice(2)}`,
    name: result.name,
    rarity: result.rarity,
    grade: result.grade,
    image: result.image,
    sourcePack: pack.name,
    openedAt,
    status: 'Stored',
  }))
}

export default function MultiOpenModal({
  pack,
  quantity,
  onClose,
  onBackToDetail,
  onAddAllToVault,
}: MultiOpenModalProps) {
  const savedBatchRef = useRef<string | null>(null)
  const [viewMode, setViewMode] = useState<'best' | 'grid'>('best')

  const results = useMemo(() => {
    if (!pack) return []
    return createWeightedResults(quantity, pack.name)
  }, [pack, quantity])

  const bestPull = results.length > 0 ? getBestPull(results) : null
  const rarePlusCount = results.filter((card) => card.rank >= 2).length

  useEffect(() => {
    if (!pack || results.length === 0) return

    const batchId = `${pack.name}-${quantity}-${results.map((card) => card.id).join('-')}`

    if (savedBatchRef.current === batchId) return

    onAddAllToVault(createVaultCards(results, pack))
    savedBatchRef.current = batchId
  }, [pack, quantity, results, onAddAllToVault])

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

  if (!pack || !bestPull) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] flex items-end justify-center overflow-hidden bg-black/88 px-0 py-0 backdrop-blur-xl sm:items-center sm:overflow-y-auto sm:px-4 sm:py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="hud-panel relative flex h-[100svh] w-full max-w-6xl flex-col overflow-hidden rounded-none border-0 p-0 sm:h-auto sm:max-h-[92vh] sm:rounded-[2rem] sm:border sm:p-6"
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
                Open {quantity} Packs
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
            aria-label="Close multi opening modal"
            className="absolute right-5 top-5 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-950/95 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition hover:scale-105 hover:bg-cyan-300/10 sm:flex"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="hidden border-b border-cyan-300/10 pb-5 pr-14 sm:mb-6 sm:block">
            <div className="mb-3 flex items-center gap-2">
              <PackageOpen className="h-5 w-5 text-cyan-300" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                Pokémon Real Card Batch Opening
              </p>
            </div>
            <h2 className="text-3xl font-black text-white">
              Open {quantity} · {pack.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              All revealed cards are saved automatically into My Vault.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-[calc(94px+env(safe-area-inset-bottom))] pt-4 sm:overflow-y-auto sm:px-0 sm:pb-0 sm:pt-0">
            <div className="mb-3 grid grid-cols-3 gap-2 sm:mb-6 sm:gap-4">
              <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.05] p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Saved
                </p>
                <p className="mt-1 text-xl font-black text-cyan-200">
                  {quantity}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.05] p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Rare+
                </p>
                <p className="mt-1 text-xl font-black text-amber-200">
                  {rarePlusCount}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.05] p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Vault
                </p>
                <p className="mt-1 text-xl font-black text-emerald-200">
                  Auto
                </p>
              </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => setViewMode('best')}
                className={`rounded-2xl px-4 py-2.5 text-sm font-black ${
                  viewMode === 'best'
                    ? 'bg-amber-300 text-black'
                    : 'border border-white/10 bg-white/[0.05] text-slate-300'
                }`}
              >
                Best Pull
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded-2xl px-4 py-2.5 text-sm font-black ${
                  viewMode === 'grid'
                    ? 'bg-cyan-300 text-black'
                    : 'border border-white/10 bg-white/[0.05] text-slate-300'
                }`}
              >
                All Cards
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
              <div className={`${viewMode === 'grid' ? 'hidden sm:block' : 'block'} rounded-[1.5rem] border border-amber-300/15 bg-amber-300/[0.04] p-4 sm:rounded-[2rem] sm:p-5`}>
                <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-300" />
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300">
                      Best Pull
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200">
                    {quantity} saved
                  </span>
                </div>

                <div className={`hud-rarity-glow flex h-[360px] items-center justify-center rounded-[1.4rem] bg-gradient-to-br ${bestPull.glow} p-[1px] sm:h-[420px] sm:rounded-3xl`}>
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.4rem] bg-black/85 p-3 sm:rounded-3xl">
                    <img src={bestPull.image} alt={bestPull.name} className="h-full w-full object-contain" />
                  </div>
                </div>

                <h3 className="mt-4 text-2xl font-black text-white">{bestPull.name}</h3>
                <p className="mt-2 text-sm text-amber-200">{bestPull.rarity} · {bestPull.setName}</p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-200">
                  <CheckCircle2 className="h-5 w-5" />
                  {quantity} cards saved to Vault
                </div>
              </div>

              <div className={`${viewMode === 'best' ? 'hidden sm:block' : 'block'} rounded-[1.5rem] border border-cyan-300/10 bg-cyan-300/[0.035] p-4 sm:rounded-[2rem] sm:p-5`}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">
                      Results Grid
                    </p>
                    <h3 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                      Real Pokémon Pulls
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-200">
                    <Grid2X2 className="h-4 w-4" />
                    {quantity}
                  </div>
                </div>

                <div className="grid max-h-none grid-cols-2 gap-3 overflow-visible pr-0 sm:max-h-[520px] sm:grid-cols-3 sm:overflow-y-auto sm:pr-2 xl:grid-cols-4">
                  {results.map((card, index) => (
                    <div
                      key={`${card.id}-${index}`}
                      className={`rounded-[1.2rem] border bg-black/45 p-2 ${
                        card.rank >= 2
                          ? 'border-amber-300/45 shadow-[0_0_25px_rgba(251,191,36,0.16)]'
                          : 'border-cyan-300/12'
                      }`}
                    >
                      <div className={`flex h-[158px] items-center justify-center rounded-xl bg-gradient-to-br ${card.glow} p-[1px] sm:h-[180px]`}>
                        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-black/85 p-2">
                          <img src={card.image} alt={card.name} loading="lazy" className="h-full w-full object-contain" />
                        </div>
                      </div>
                      <p className="mt-2 line-clamp-1 text-sm font-black text-white">
                        {card.name}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-cyan-200">
                        {card.rarity}
                      </p>
                    </div>
                  ))}
                </div>
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

              <button
                type="button"
                onClick={onClose}
                className="hud-button inline-flex flex-[2] items-center justify-center gap-2 px-5 py-3 text-sm"
              >
                <CheckCircle2 className="h-4 w-4" />
                Continue
              </button>
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-[#050b18]/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden">
            <button
              type="button"
              onClick={onClose}
              className="hud-button flex w-full items-center justify-center gap-2 px-5 py-4 text-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              Continue
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
