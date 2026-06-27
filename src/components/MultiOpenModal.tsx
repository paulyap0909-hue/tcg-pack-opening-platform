import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Crown, PackageOpen, X } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'

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

  const results = useMemo(() => {
    if (!pack) return []
    return createWeightedResults(quantity, pack.name)
  }, [pack, quantity])

  const bestPull = results.length > 0 ? getBestPull(results) : null

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
        className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/85 px-4 py-6 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="hud-panel hud-corners relative w-full max-w-6xl rounded-[2rem] p-6"
          initial={{ scale: 0.94, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 24 }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close multi opening modal"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-950/95 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition hover:scale-105 hover:bg-cyan-300/10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-6 border-b border-cyan-300/10 pb-5 pr-14">
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
              All revealed cards use real Pokémon TCG image URLs and are saved automatically into My Vault.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="rounded-[2rem] border border-amber-300/15 bg-amber-300/[0.04] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-300" />
                <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
                  Best Pull
                </p>
              </div>

              <div className={`hud-rarity-glow flex h-[420px] items-center justify-center rounded-3xl bg-gradient-to-br ${bestPull.glow} p-[1px]`}>
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-black/85 p-3">
                  <img src={bestPull.image} alt={bestPull.name} className="h-full w-full object-contain" />
                </div>
              </div>

              <h3 className="mt-5 text-2xl font-black text-white">{bestPull.name}</h3>
              <p className="mt-2 text-sm text-amber-200">{bestPull.rarity} · {bestPull.setName}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                {quantity} cards saved to Vault
              </div>
            </div>

            <div className="min-h-0 rounded-[2rem] border border-cyan-300/10 bg-cyan-300/[0.03] p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="hud-label text-sm">Results Grid</p>
                  <h3 className="mt-1 text-2xl font-black text-white">Real Pokémon Pulls</h3>
                </div>
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black text-cyan-200">
                  {results.length} cards
                </span>
              </div>

              <div className="max-h-[560px] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                  {results.map((card, index) => (
                    <motion.div
                      key={`${card.id}-${index}`}
                      className="rounded-2xl border border-cyan-300/10 bg-black/45 p-2"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.01, 0.5) }}
                    >
                      <div className={`rounded-xl bg-gradient-to-br ${card.glow} p-[1px]`}>
                        <div className="flex aspect-[0.72] items-center justify-center overflow-hidden rounded-xl bg-black/85 p-1.5">
                          <img src={card.image} alt={card.name} className="h-full w-full object-contain" />
                        </div>
                      </div>
                      <p className="mt-2 truncate text-xs font-black text-white">{card.name}</p>
                      <p className="truncate text-[10px] text-cyan-300">{card.rarity}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onBackToDetail ?? onClose}
              className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-4 font-black text-cyan-200 transition hover:scale-[1.02] hover:bg-cyan-300/20"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Pack Details
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-400 px-6 py-4 font-black text-black shadow-[0_0_40px_rgba(34,211,238,0.28)] transition hover:scale-[1.02]"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
