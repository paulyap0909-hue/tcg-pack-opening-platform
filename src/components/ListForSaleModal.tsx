import { AnimatePresence, motion } from 'framer-motion'
import { Coins, Store, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import type { VaultCard } from './VaultDrawer'
import { getSellBackPoints } from './VaultDrawer'

type ListForSaleModalProps = {
  card: VaultCard | null
  onClose: () => void
  onConfirm: (price: number) => void
}

export default function ListForSaleModal({
  card,
  onClose,
  onConfirm,
}: ListForSaleModalProps) {
  const suggestedPrice = useMemo(() => {
    if (!card) return 100

    return Math.max(getSellBackPoints(card) * 2, 100)
  }, [card])

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

  const handleSubmit = () => {
    if (isInvalidPrice) return

    onConfirm(Math.round(parsedPrice))
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999999] flex items-center justify-center overflow-y-auto bg-black/85 px-4 py-6 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="hud-panel hud-corners relative w-full max-w-2xl rounded-[2rem] p-6"
          initial={{ scale: 0.92, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 24 }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close list for sale modal"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-950/95 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition hover:scale-105 hover:bg-cyan-300/10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="border-b border-cyan-300/10 pb-5 pr-14">
            <div className="mb-3 flex items-center gap-2">
              <Store className="h-5 w-5 text-cyan-300" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                List on Marketplace
              </p>
            </div>

            <h2 className="text-3xl font-black text-white">
              Set selling price
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Listing this card will lock Sell Back and Shipping until you cancel
              the listing.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-[180px_1fr]">
            <div className="hud-rarity-glow flex min-h-[240px] items-center justify-center overflow-hidden rounded-3xl border border-cyan-300/15 bg-black/60 p-3">
              <img
                src={card.image}
                alt={card.name}
                className="max-h-[230px] w-auto object-contain"
              />
            </div>

            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200">
                  {card.rarity}
                </span>

                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-200">
                  {card.grade}
                </span>
              </div>

              <h3 className="text-2xl font-black text-white">{card.name}</h3>

              <div className="mt-5 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.05] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Coins className="h-5 w-5 text-emerald-300" />
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                    Sell Back Value
                  </p>
                </div>

                <p className="text-2xl font-black text-emerald-200">
                  {getSellBackPoints(card).toLocaleString()} Points
                </p>
              </div>

              <label className="mt-5 block">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                  Marketplace Price / Points
                </span>

                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  type="number"
                  min="1"
                  className="mt-3 w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-4 text-lg font-black text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
                  placeholder="Enter points price"
                />
              </label>

              {isInvalidPrice && (
                <p className="mt-3 text-sm font-bold text-rose-300">
                  Please enter a valid selling price.
                </p>
              )}
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-4 font-black text-cyan-200 transition hover:scale-[1.02] hover:bg-cyan-300/20"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isInvalidPrice}
              onClick={handleSubmit}
              className={`flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-black transition ${
                isInvalidPrice
                  ? 'cursor-not-allowed border border-slate-500/20 bg-slate-500/10 text-slate-500'
                  : 'bg-gradient-to-r from-cyan-300 to-purple-400 text-black shadow-[0_0_40px_rgba(34,211,238,0.28)] hover:scale-[1.02]'
              }`}
            >
              <Store className="h-5 w-5" />
              Confirm Listing
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
