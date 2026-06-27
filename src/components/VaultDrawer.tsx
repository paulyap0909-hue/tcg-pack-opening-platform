import { AnimatePresence, motion } from 'framer-motion'
import {
  Clock,
  Coins,
  PackageOpen,
  RotateCcw,
  ShoppingBag,
  ShieldCheck,
  Hash,
  Sparkles,
  Truck,
  X,
} from 'lucide-react'
import { useEffect } from 'react'

export type ShippingStatus =
  | 'Stored'
  | 'Listed on Marketplace'
  | 'Shipping Requested'
  | 'Preparing'
  | 'Shipped'
  | 'Delivered'

export type ShippingInfo = {
  fullName: string
  phone: string
  email: string
  address: string
  postcode: string
  city: string
  state: string
  remark?: string
  trackingNumber?: string
}

export type VaultCard = {
  id: string
  name: string
  rarity: string
  grade: string
  image: string
  sourcePack: string
  openedAt: string
  status: ShippingStatus
  shippingInfo?: ShippingInfo
  shippingRequestedAt?: string
  shippingUpdatedAt?: string
  listingPrice?: number
  listedAt?: string
  listedSeller?: string
  fairnessId?: string
  serverSeedHash?: string
  clientSeed?: string
  nonce?: number
}

type VaultDrawerProps = {
  isOpen: boolean
  cards: VaultCard[]
  onClose: () => void
  onSellBackCard?: (card: VaultCard) => void
  onRequestShippingCard?: (card: VaultCard) => void
  onListForSaleCard?: (card: VaultCard) => void
  onCancelMarketplaceListing?: (card: VaultCard) => void
}

function isRareOrAbove(card: VaultCard) {
  return card.rarity.toLowerCase() !== 'common'
}

export function getSellBackPoints(card: VaultCard) {
  const rarity = card.rarity.toLowerCase()

  if (rarity.includes('secret')) return 800
  if (rarity.includes('super')) return 250
  if (rarity.includes('rare')) return 30

  return 5
}

export default function VaultDrawer({
  isOpen,
  cards,
  onClose,
  onSellBackCard,
  onRequestShippingCard,
  onListForSaleCard,
  onCancelMarketplaceListing,
}: VaultDrawerProps) {
  useEffect(() => {
    if (!isOpen) return

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
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.aside
            className="hud-panel hud-corners ml-auto flex h-screen w-full max-w-2xl flex-col overflow-hidden rounded-l-[2rem] border-l border-cyan-300/20 p-6"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 150, damping: 24 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close vault"
              className="absolute right-6 top-6 z-[9999] flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-950/95 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.35)] backdrop-blur transition hover:scale-105 hover:bg-cyan-300/10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="shrink-0 border-b border-cyan-300/10 pb-5 pr-16">
              <p className="hud-label text-sm">Player Inventory</p>

              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black">My Vault</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Cards revealed from pack openings. Sell back for points or
                    request physical shipping, or list cards on the marketplace.
                  </p>
                </div>

                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 sm:flex">
                  <ShieldCheck className="h-7 w-7 text-cyan-300" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid shrink-0 grid-cols-3 gap-3">
              <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Cards
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {cards.length}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Rare+
                </p>
                <p className="mt-2 text-2xl font-black text-amber-300">
                  {cards.filter(isRareOrAbove).length}
                </p>
              </div>

              <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Locked
                </p>
                <p className="mt-2 text-2xl font-black text-purple-300">
                  {cards.filter((card) => card.status !== 'Stored').length}
                </p>
              </div>
            </div>

            <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-2">
              {cards.length === 0 ? (
                <div className="hud-card hud-corners rounded-[2rem] p-8 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10">
                    <PackageOpen className="h-8 w-8 text-cyan-300" />
                  </div>

                  <h3 className="text-2xl font-black text-white">
                    Vault is Empty
                  </h3>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                    Open a pack and your revealed cards will be automatically
                    stored here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pb-8">
                  {cards.map((card, index) => {
                    const sellBackPoints = getSellBackPoints(card)
                    const isListed = card.status === 'Listed on Marketplace'
                    const isLocked = card.status !== 'Stored'

                    return (
                      <motion.div
                        key={card.id}
                        className="hud-card hud-corners rounded-[2rem] p-4"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.025 }}
                      >
                        <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                          <div className="hud-rarity-glow flex min-h-[165px] items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/15 bg-black/60 p-2">
                            <img
                              src={card.image}
                              alt={card.name}
                              className="max-h-[160px] w-auto object-contain"
                            />
                          </div>

                          <div className="flex min-w-0 flex-col justify-between">
                            <div>
                              <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200">
                                  {card.rarity}
                                </span>

                                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-200">
                                  {card.grade}
                                </span>

                                <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-200">
                                  {sellBackPoints} pts
                                </span>

                                {card.fairnessId && (
                                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                                    Fair
                                  </span>
                                )}
                              </div>

                              <h3 className="break-words text-xl font-black text-white">
                                {card.name}
                              </h3>

                              <p className="mt-2 break-words text-xs uppercase tracking-[0.22em] text-cyan-300">
                                {card.sourcePack}
                              </p>

                              {card.fairnessId && (
                                <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.04] px-3 py-2 text-xs text-emerald-300">
                                  <Hash className="h-4 w-4 shrink-0" />
                                  <span className="break-all">
                                    Fairness ID: {card.fairnessId}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <div className="flex items-center gap-2 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.04] px-3 py-2 text-xs text-slate-300">
                                <Clock className="h-4 w-4 shrink-0 text-cyan-300" />
                                {card.openedAt}
                              </div>

                              <div
                                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${
                                  isLocked
                                    ? 'border-purple-300/20 bg-purple-300/10 text-purple-300'
                                    : 'border-emerald-300/10 bg-emerald-300/[0.04] text-emerald-300'
                                }`}
                              >
                                <Truck className="h-4 w-4 shrink-0" />
                                {card.status}
                              </div>
                            </div>

                            {card.shippingInfo?.trackingNumber && (
                              <div className="mt-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.04] px-3 py-2 text-xs text-emerald-300">
                                Tracking: {card.shippingInfo.trackingNumber}
                              </div>
                            )}

                            {isListed && card.listingPrice && (
                              <div className="mt-3 rounded-xl border border-amber-300/10 bg-amber-300/[0.04] px-3 py-2 text-xs font-black text-amber-300">
                                Listed Price: {card.listingPrice.toLocaleString()} pts
                              </div>
                            )}

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <button
                                type="button"
                                disabled={isLocked}
                                onClick={() => onSellBackCard?.(card)}
                                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${
                                  isLocked
                                    ? 'cursor-not-allowed border border-slate-500/20 bg-slate-500/10 text-slate-500'
                                    : 'border border-emerald-300/30 bg-emerald-300/10 text-emerald-300 hover:scale-[1.02] hover:bg-emerald-300/20'
                                }`}
                              >
                                <Coins className="h-4 w-4" />
                                {isLocked
                                  ? 'Locked'
                                  : `Sell Back +${sellBackPoints} pts`}
                              </button>

                              <button
                                type="button"
                                disabled={isLocked}
                                onClick={() => onRequestShippingCard?.(card)}
                                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${
                                  isLocked
                                    ? 'cursor-not-allowed border border-purple-300/20 bg-purple-300/10 text-purple-300'
                                    : 'border border-cyan-300/30 bg-cyan-300/10 text-cyan-300 hover:scale-[1.02] hover:bg-cyan-300/20'
                                }`}
                              >
                                <RotateCcw className="h-4 w-4" />
                                {isLocked ? card.status : 'Request Shipping'}
                              </button>
                            </div>

                            {isListed ? (
                              <button
                                type="button"
                                onClick={() => onCancelMarketplaceListing?.(card)}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-sm font-black text-rose-200 transition hover:scale-[1.02] hover:bg-rose-300/20"
                              >
                                <ShoppingBag className="h-4 w-4" />
                                Cancel Marketplace Listing
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isLocked}
                                onClick={() => onListForSaleCard?.(card)}
                                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${
                                  isLocked
                                    ? 'cursor-not-allowed border border-slate-500/20 bg-slate-500/10 text-slate-500'
                                    : 'border border-amber-300/30 bg-amber-300/10 text-amber-300 hover:scale-[1.02] hover:bg-amber-300/20'
                                }`}
                              >
                                <ShoppingBag className="h-4 w-4" />
                                List for Sale
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}

                  <div className="rounded-2xl border border-purple-300/15 bg-purple-400/[0.05] p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-300" />
                      <p className="text-xs uppercase tracking-[0.28em] text-purple-300">
                        Vault Notice
                      </p>
                    </div>

                    <p className="text-sm leading-6 text-slate-300">
                      Sell Back converts the card into points. Request Shipping or Marketplace Listing locks the card until the request is completed or cancelled.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
