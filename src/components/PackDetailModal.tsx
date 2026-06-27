import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Box,
  Boxes,
  ChevronsUp,
  Coins,
  PackageOpen,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { useEffect } from 'react'

import type { Pack } from '../data/cardPool'
import { translations, type AppLanguage, type Translation } from '../lib/i18n'

type PackDetailModalProps = {
  language: AppLanguage
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
  t: Translation,
) => {
  const packCost = getPackCost(pack)
  const totalCost = packCost * quantity

  if (pack.remainingQuantity <= 0) {
    return {
      disabled: true,
      label: t.soldOut,
      compactLabel: t.soldOut,
      reason: t.noStock,
      subLabel: t.noStock,
      needsTopUp: false,
    }
  }

  if (pack.remainingQuantity < quantity) {
    return {
      disabled: true,
      label: t.notEnoughStock,
      compactLabel: t.stock,
      reason: `${pack.remainingQuantity} ${t.packsLeft}.`,
      subLabel: `${pack.remainingQuantity} ${t.leftShort}`,
      needsTopUp: false,
    }
  }

  if (walletBalance < totalCost) {
    return {
      disabled: false,
      label: `${t.topUpForOpen} ${quantity}`,
      compactLabel: t.topUp,
      reason: `${t.need} ${totalCost.toLocaleString()} ${t.points}.`,
      subLabel: `${totalCost.toLocaleString()} pts`,
      needsTopUp: true,
    }
  }

  return {
    disabled: false,
    label: `${t.openLabel} ${quantity} · ${totalCost.toLocaleString()} pts`,
    compactLabel: `${t.openLabel} ${quantity}`,
    reason: `${quantity} ${t.navPacks} ${t.willOpenInstantly}`,
    subLabel: `${totalCost.toLocaleString()} pts`,
    needsTopUp: false,
  }
}

const getQuantityIcon = (quantity: number) => {
  if (quantity === 1) return PackageOpen
  if (quantity === 10) return Boxes
  return ChevronsUp
}

function getLocalizedPackCategory(category: string, t: Translation) {
  if (category === 'Pokémon Inspired') return t.pokemonInspired
  if (category === 'One Piece Inspired') return t.onePieceInspired
  if (category === 'Premium Mystery Pack') return t.premiumMysteryPack
  if (category === 'Creator Drops') return t.creatorDrops

  return category
}

function getLocalizedPackBadge(badge: string, t: Translation) {
  if (badge === 'Charizard Chase') return t.charizardChase
  if (badge === 'Creator Drop') return t.creatorDrop
  if (badge === 'Emperor Pack') return t.emperorPack
  if (badge === 'Flame Kick') return t.flameKick
  if (badge === 'Gold Chase') return t.goldChase
  if (badge === 'Gold Map') return t.goldMap
  if (badge === 'Kanto Drop') return t.kantoDrop
  if (badge === 'Luffy Chase') return t.luffyChase
  if (badge === 'Pikachu Chase') return t.pikachuChase
  if (badge === 'Sword Drop') return t.swordDrop
  if (badge === 'Treasure Drop') return t.treasureDrop
  if (badge === 'Vaulted') return t.vaulted
  if (badge === 'Vintage Holo') return t.vintageHolo
  if (badge === 'Weekly Drop') return t.weeklyDrop

  return badge
}


export default function PackDetailModal({
  language,
  pack,
  onClose,
  onOpenPack,
  onOpenMultiPack,
  walletBalance,
  onNeedTopUp,
}: PackDetailModalProps) {
  const t = translations[language]

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
    const buttonState = getButtonState(pack, quantity, walletBalance, t)

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
        className="fixed inset-0 z-[99999] flex items-end justify-center overflow-hidden bg-black/85 px-0 py-0 backdrop-blur-xl sm:items-center sm:overflow-y-auto sm:px-4 sm:py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="hud-panel relative flex h-[100svh] w-full max-w-5xl flex-col overflow-hidden rounded-none border-x-0 border-y-0 p-0 shadow-[0_-20px_90px_rgba(0,0,0,0.55)] sm:h-auto sm:max-h-[92vh] sm:rounded-[2rem] sm:border sm:p-6"
          initial={{ scale: 0.96, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 24 }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t.cancel}
            className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/30 bg-slate-950/95 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.28)] transition hover:scale-105 hover:bg-cyan-300/10 sm:right-5 sm:top-5 sm:h-11 sm:w-11"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex-1 overflow-y-auto px-4 pb-[calc(116px+env(safe-area-inset-bottom))] pt-4 sm:overflow-visible sm:p-0">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-[360px_1fr]">
              <div className="relative overflow-hidden rounded-[1.35rem] border border-cyan-300/15 bg-black/70 p-3 sm:rounded-[2rem] sm:p-5">
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pack.glow} opacity-20`}
                />

                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
                    <span
                      className={`rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.22em] sm:text-[10px] ${
                        isNearlySoldOut
                          ? 'border-amber-300/30 bg-amber-300/10 text-amber-200'
                          : 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200'
                      }`}
                    >
                      {isNearlySoldOut ? t.nearlySoldOut : getLocalizedPackBadge(pack.badge, t)}
                    </span>

                    <span className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:text-xs sm:tracking-[0.22em]">
                      {getLocalizedPackCategory(pack.category, t)}
                    </span>
                  </div>

                  <div
                    className={`hud-scanline flex h-[185px] items-center justify-center rounded-[1.15rem] bg-gradient-to-br ${pack.glow} p-[1px] sm:h-[420px] sm:rounded-3xl`}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-[1.15rem] bg-black/85 p-3 sm:rounded-3xl sm:p-4">
                      <img
                        src={pack.cover}
                        alt={pack.name}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2 sm:mb-4 sm:gap-3">
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.25em]">
                      {t.packDetails}
                    </span>
                    <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-purple-200 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.25em]">
                      {t.openOneTenHundred}
                    </span>
                  </div>

                  <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                    {pack.name}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400 sm:mt-4 sm:max-w-2xl sm:leading-7">
                    {t.chooseQuantityVault}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4">
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3 sm:p-4">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 sm:mb-3 sm:h-10 sm:w-10">
                        <Coins className="h-4 w-4 text-cyan-300 sm:h-5 sm:w-5" />
                      </div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:text-[10px] sm:tracking-[0.25em]">
                        {t.price}
                      </p>
                      <p className="mt-1 text-lg font-black text-cyan-200 sm:mt-2 sm:text-2xl">
                        {packCost}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-3 sm:p-4">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10 sm:mb-3 sm:h-10 sm:w-10">
                        <Box className="h-4 w-4 text-amber-300 sm:h-5 sm:w-5" />
                      </div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:text-[10px] sm:tracking-[0.25em]">
                        {t.left}
                      </p>
                      <p className="mt-1 text-lg font-black text-amber-300 sm:mt-2 sm:text-2xl">
                        {pack.remainingQuantity}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-3 sm:p-4">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl border border-purple-300/20 bg-purple-300/10 sm:mb-3 sm:h-10 sm:w-10">
                        <Wallet className="h-4 w-4 text-purple-300 sm:h-5 sm:w-5" />
                      </div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:text-[10px] sm:tracking-[0.25em]">
                        {t.wallet}
                      </p>
                      <p className="mt-1 text-lg font-black text-purple-300 sm:mt-2 sm:text-2xl">
                        {walletBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 hidden rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-4 text-sm leading-6 text-slate-300 sm:flex sm:items-center sm:gap-2">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-300" />
                    {t.vaultAutoSaveNotice}
                  </div>
                </div>

                <div className="mt-5 hidden gap-3 sm:grid">
                  {openOptions.map((quantity) => {
                    const buttonState = getButtonState(
                      pack,
                      quantity,
                      walletBalance,
                      t,
                    )
                    const QuantityIcon = getQuantityIcon(quantity)

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
                          <QuantityIcon className="h-5 w-5" />
                          <span>{buttonState.label}</span>
                        </span>

                        <span className="hidden text-xs font-bold uppercase tracking-wider opacity-70 sm:inline">
                          {buttonState.reason}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-[#050b18]/95 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
                {t.openQuantity}
              </p>
              <p className="text-xs font-bold text-slate-400">
                {packCost} {t.ptsEach}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {openOptions.map((quantity) => {
                const buttonState = getButtonState(pack, quantity, walletBalance, t)
                const QuantityIcon = getQuantityIcon(quantity)

                return (
                  <button
                    key={quantity}
                    type="button"
                    disabled={buttonState.disabled}
                    onClick={() => handleOpen(quantity)}
                    className={`min-h-[72px] rounded-2xl border p-2 text-center transition ${
                      buttonState.disabled
                        ? 'border-slate-700 bg-slate-800/80 text-slate-500'
                        : quantity === 100
                          ? 'border-purple-300/30 bg-purple-300/12 text-purple-100 active:scale-95'
                          : 'border-cyan-300/25 bg-cyan-300/12 text-cyan-100 active:scale-95'
                    }`}
                  >
                    <QuantityIcon className="mx-auto h-4 w-4" />
                    <p className="mt-1 text-xs font-black">
                      {buttonState.compactLabel}
                    </p>
                    <p className="mt-0.5 text-[10px] font-bold opacity-70">
                      {buttonState.subLabel}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
