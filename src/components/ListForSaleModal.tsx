import { AnimatePresence, motion } from 'framer-motion'
import { Coins, PackageOpen, Store, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { translations, type AppLanguage } from '../lib/i18n'

import type { VaultCard } from './VaultDrawer'
import { getLocalizedCardGrade, getLocalizedCardRarity, getSellBackPoints } from './VaultDrawer'

type ListForSaleModalProps = {
  language: AppLanguage
  card: VaultCard | null
  onClose: () => void
  onConfirm: (price: number) => void
}

export default function ListForSaleModal({
  language,
  card,
  onClose,
  onConfirm,
}: ListForSaleModalProps) {
  const t = translations[language]
  const suggestedPrice = useMemo(() => {
    if (!card) return 100

    return Math.max(getSellBackPoints(card) * 2, 100)
  }, [card])

  const quickPriceOptions = useMemo(() => {
    const values = [
      suggestedPrice,
      Math.max(suggestedPrice + 50, 150),
      Math.max(suggestedPrice * 2, 200),
      Math.max(suggestedPrice * 3, 300),
    ]

    return Array.from(new Set(values.map((value) => Math.round(value))))
  }, [suggestedPrice])

  const [price, setPrice] = useState(String(suggestedPrice))

  useEffect(() => {
    setPrice(String(suggestedPrice))
  }, [suggestedPrice])

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

  const parsedPrice = Number(price)
  const isInvalidPrice = Number.isNaN(parsedPrice) || parsedPrice <= 0
  const sellBackPoints = getSellBackPoints(card)

  const handleSubmit = () => {
    if (isInvalidPrice) return

    onConfirm(Math.round(parsedPrice))
  }

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
                <Store className="h-4 w-4 text-cyan-300" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                  {t.listOnMarketplace}
                </p>
              </div>

              <h2 className="text-xl font-black leading-tight text-white">
                {t.setSellingPrice}
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

            <div className="mt-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.05] p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <Coins className="h-4 w-4 text-emerald-300" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">
                  {t.sellBackValue}
                </p>
              </div>

              <p className="text-xl font-black text-emerald-200">
                {sellBackPoints.toLocaleString()} {t.pointsShort}
              </p>
            </div>

            <label className="mt-4 block">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                {t.marketplacePricePoints}
              </span>

              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                type="number"
                min="1"
                className="mt-2 h-14 w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 text-xl font-black text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
                placeholder={t.enterPointsPrice}
              />
            </label>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {quickPriceOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPrice(String(option))}
                  className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-2 py-2 text-[11px] font-black text-cyan-100"
                >
                  {option}
                </button>
              ))}
            </div>

            {isInvalidPrice && (
              <p className="mt-3 text-sm font-bold text-rose-300">
                {t.invalidSellingPrice}
              </p>
            )}

            <p className="mt-3 rounded-2xl border border-amber-300/15 bg-amber-300/[0.055] px-3 py-2 text-xs leading-5 text-amber-100/85">
              {t.listForSaleLockNotice}
            </p>
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
                disabled={isInvalidPrice}
                onClick={handleSubmit}
                className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
                  isInvalidPrice
                    ? 'cursor-not-allowed border border-slate-500/20 bg-slate-500/10 text-slate-500'
                    : 'bg-gradient-to-r from-cyan-300 to-purple-400 text-black shadow-[0_0_30px_rgba(34,211,238,0.24)]'
                }`}
              >
                <Store className="h-4 w-4" />
                {t.confirmListing}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
