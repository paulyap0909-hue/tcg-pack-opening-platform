import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Box,
  Boxes,
  ChevronsUp,
  Coins,
  Flame,
  PackageOpen,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { useEffect } from 'react'

import type { Pack } from '../data/cardPool'

type PackDetailModalProps = {
  pack: Pack | null
  onClose: () => void
  onOpenPack: (pack: Pack) => void
  onOpenMultiPack: (pack: Pack, quantity: number) => void
  walletBalance: number
  onNeedTopUp: () => void
}

const getPackCost = (pack: Pack) => {
  return Number(pack.price.replace(/[^0-9]/g, '')) || 0
}

const getButtonState = (
  pack: Pack,
  quantity: number,
  walletBalance: number,
) => {
  const packCost = getPackCost(pack)
  const totalCost = packCost * quantity

  if (pack.remainingQuantity <= 0) {
    return {
      disabled: true,
      label: 'Sold Out',
      reason: 'This drop has no stock remaining.',
      needsTopUp: false,
    }
  }

  if (pack.remainingQuantity < quantity) {
    return {
      disabled: true,
      label: 'Not Enough Stock',
      reason: `Only ${pack.remainingQuantity} packs left.`,
      needsTopUp: false,
    }
  }

  if (walletBalance < totalCost) {
    return {
      disabled: false,
      label: `Top Up for Open ${quantity}`,
      reason: `Need ${totalCost.toLocaleString()} points.`,
      needsTopUp: true,
    }
  }

  return {
    disabled: false,
    label: `Open ${quantity} · ${totalCost.toLocaleString()} pts`,
    reason: `${quantity} pack${quantity > 1 ? 's' : ''} will be opened instantly.`,
    needsTopUp: false,
  }
}

export default function PackDetailModal({
  pack,
  onClose,
  onOpenPack,
  onOpenMultiPack,
  walletBalance,
  onNeedTopUp,
}: PackDetailModalProps) {
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

  if (!pack) return null

  const packCost = getPackCost(pack)
  const openOptions = [1, 10, 100]
  const isNearlySoldOut =
    pack.remainingQuantity > 0 && pack.remainingQuantity <= 10

  const handleOpen = (quantity: number) => {
    const buttonState = getButtonState(pack, quantity, walletBalance)

    if (buttonState.disabled) return

    if (buttonState.needsTopUp) {
      onNeedTopUp()
      return
    }

    if (quantity === 1) {
      onOpenPack(pack)
      return
    }

    onOpenMultiPack(pack, quantity)
  }

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
            aria-label="Close pack details"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-950/95 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition hover:scale-105 hover:bg-cyan-300/10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-black/70 p-5">
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pack.glow} opacity-20`}
              />

              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] ${
                      isNearlySoldOut
                        ? 'border-amber-300/30 bg-amber-300/10 text-amber-200'
                        : 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200'
                    }`}
                  >
                    {isNearlySoldOut ? 'Nearly Sold Out' : pack.badge}
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                    {pack.category}
                  </span>
                </div>

                <div
                  className={`hud-scanline flex h-[420px] items-center justify-center rounded-3xl bg-gradient-to-br ${pack.glow} p-[1px]`}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-3xl bg-black/85 p-4">
                    <img
                      src={pack.cover}
                      alt={pack.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-4 flex flex-wrap gap-3">
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-200">
                    Pack Details
                  </span>
                  <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-purple-200">
                    Open 1 / 10 / 100
                  </span>
                </div>

                <h2 className="text-4xl font-black leading-tight text-white">
                  {pack.name}
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                  Choose your opening quantity. Every revealed card will be
                  automatically saved into My Vault, where you can sell back for
                  points or request physical shipping.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
                      <Coins className="h-5 w-5 text-cyan-300" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                      Price
                    </p>
                    <p className="mt-2 text-2xl font-black text-cyan-200">
                      {packCost} pts
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10">
                      <Box className="h-5 w-5 text-amber-300" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                      Remaining
                    </p>
                    <p className="mt-2 text-2xl font-black text-amber-300">
                      {pack.remainingQuantity}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-purple-300/20 bg-purple-300/10">
                      <Wallet className="h-5 w-5 text-purple-300" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                      Wallet
                    </p>
                    <p className="mt-2 text-2xl font-black text-purple-300">
                      {walletBalance.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-amber-300/15 bg-amber-300/[0.05] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-300" />
                    <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
                      Conversion Note
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-slate-300">
                    Open 100 is designed for high-volume pack opening users and
                    creator drop campaigns. Stock and wallet checks apply before
                    opening.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-3">
                {openOptions.map((quantity) => {
                  const buttonState = getButtonState(
                    pack,
                    quantity,
                    walletBalance,
                  )

                  return (
                    <button
                      key={quantity}
                      type="button"
                      disabled={buttonState.disabled}
                      onClick={() => handleOpen(quantity)}
                      className={`flex items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left font-black transition ${
                        buttonState.disabled
                          ? 'cursor-not-allowed border border-slate-600 bg-slate-800 text-slate-500'
                          : quantity === 100
                            ? 'border border-purple-300/30 bg-purple-300/10 text-purple-100 hover:scale-[1.01] hover:bg-purple-300/20'
                            : 'hud-button hover:scale-[1.01]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {quantity === 1 && <PackageOpen className="h-5 w-5" />}
                        {quantity === 10 && <Boxes className="h-5 w-5" />}
                        {quantity === 100 && <ChevronsUp className="h-5 w-5" />}
                        <span>{buttonState.label}</span>
                      </span>

                      <span className="hidden text-xs font-bold uppercase tracking-wider opacity-70 sm:inline">
                        {buttonState.reason}
                      </span>
                    </button>
                  )
                })}

                <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-4 text-sm leading-6 text-slate-300">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-300" />
                  All opened cards are automatically added to Vault and saved in
                  local storage for this demo version.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
