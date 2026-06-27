import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  AlertTriangle,
  Coins,
  ShieldCheck,
  Sparkles,
  PackageOpen,
} from 'lucide-react'
import { useEffect } from 'react'
import { translations, type AppLanguage } from '../lib/i18n'

import { type VaultCard, getLocalizedCardGrade, getLocalizedCardRarity, getSellBackPoints } from './VaultDrawer'

type SellBackConfirmModalProps = {
  language: AppLanguage
  card: VaultCard | null
  onClose: () => void
  onConfirm: () => void
}

export default function SellBackConfirmModal({
  language,
  card,
  onClose,
  onConfirm,
}: SellBackConfirmModalProps) {
  const t = translations[language]

  useEffect(() => {
    if (!card) return

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
  }, [card, onClose])

  if (!card) return null

  const sellBackPoints = getSellBackPoints(card)

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999999] flex items-end justify-center bg-black/85 px-3 pb-3 pt-6 backdrop-blur-xl sm:items-center sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="hud-panel hud-corners flex max-h-[92svh] w-full max-w-md flex-col overflow-hidden rounded-[1.45rem]"
          initial={{ y: 80, scale: 0.98 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 80, scale: 0.98 }}
          transition={{ type: 'spring', damping: 26, stiffness: 260 }}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-cyan-300/10 px-4 py-4">
            <div className="min-w-0">
              <div className="mb-1.5 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-300" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">
                  {t.confirmSellBack}
                </p>
              </div>
              <h2 className="text-xl font-black leading-tight text-white">
                {t.sellThisCardBack}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.cancel}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-slate-950/95 text-cyan-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <div className="grid grid-cols-[92px_1fr] gap-3 rounded-2xl border border-cyan-300/12 bg-cyan-300/[0.035] p-3">
              <div className="hud-rarity-glow flex h-[126px] items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/15 bg-black/55 p-2">
                <img
                  src={card.image}
                  alt={card.name}
                  className="max-h-[118px] w-auto object-contain"
                />
              </div>

              <div className="min-w-0 self-center">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-amber-200">
                    {getLocalizedCardRarity(card.rarity, t)}
                  </span>
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-cyan-200">
                    {getLocalizedCardGrade(card.grade, t)}
                  </span>
                </div>

                <h3 className="truncate text-lg font-black text-white">{card.name}</h3>

                <div className="mt-2 flex items-start gap-1.5 text-xs leading-4 text-slate-400">
                  <PackageOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-300" />
                  <span className="line-clamp-2">{card.sourcePack}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Coins className="h-4 w-4 text-emerald-300" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">
                  {t.sellBackValue}
                </p>
              </div>

              <p className="text-3xl font-black text-emerald-300">
                +{sellBackPoints.toLocaleString()} {t.pointsShort}
              </p>
            </div>

            <div className="mt-3 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">
                  {t.important}
                </p>
              </div>

              <p className="text-xs leading-5 text-slate-300">
                {t.sellBackImportant}
              </p>
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-[#07111f]/95 p-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-200"
              >
                {t.cancel}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-300 to-cyan-400 px-4 py-3 text-sm font-black text-black shadow-[0_0_30px_rgba(16,185,129,0.24)]"
              >
                <ShieldCheck className="h-4 w-4" />
                {t.confirmSellBackButton}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
