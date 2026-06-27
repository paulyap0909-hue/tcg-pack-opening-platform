import { AnimatePresence, motion } from 'framer-motion'
import {
  Clock,
  Hash,
  PackageOpen,
  Search,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

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

type VaultFilter = 'all' | 'rare' | 'stored' | 'locked'

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

function getStatusStyle(status: ShippingStatus) {
  if (status === 'Stored') {
    return 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200'
  }

  if (status === 'Listed on Marketplace') {
    return 'border-amber-300/20 bg-amber-300/10 text-amber-200'
  }

  return 'border-purple-300/20 bg-purple-300/10 text-purple-200'
}

function shortPackName(packName: string) {
  return packName.replace('Pokémon ', '').replace('SEA ', '').replace(' Weekly Drop', '')
}

const vaultFilters: Array<{ id: VaultFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'rare', label: 'Rare+' },
  { id: 'stored', label: 'Stored' },
  { id: 'locked', label: 'Locked' },
]

export default function VaultDrawer({
  isOpen,
  cards,
  onClose,
  onSellBackCard,
  onRequestShippingCard,
  onListForSaleCard,
  onCancelMarketplaceListing,
}: VaultDrawerProps) {
  const [activeFilter, setActiveFilter] = useState<VaultFilter>('all')

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

  const stats = useMemo(
    () => ({
      total: cards.length,
      rare: cards.filter(isRareOrAbove).length,
      locked: cards.filter((card) => card.status !== 'Stored').length,
    }),
    [cards],
  )

  const filteredCards = useMemo(() => {
    if (activeFilter === 'rare') return cards.filter(isRareOrAbove)
    if (activeFilter === 'stored') {
      return cards.filter((card) => card.status === 'Stored')
    }
    if (activeFilter === 'locked') {
      return cards.filter((card) => card.status !== 'Stored')
    }

    return cards
  }, [activeFilter, cards])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] overflow-hidden bg-black/75 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.aside
            className="ml-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden border-l border-cyan-300/20 bg-[#030712]/95 shadow-[0_0_60px_rgba(34,211,238,0.18)] sm:max-w-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 150, damping: 24 }}
          >
            <div className="sticky top-0 z-20 shrink-0 border-b border-cyan-300/10 bg-[#030712]/90 px-4 pb-3 pt-4 backdrop-blur-xl">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close vault"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/30 bg-slate-950/90 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.25)] transition active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>

              <p className="hud-label pr-14 text-[10px] tracking-[0.32em] text-cyan-300">
                Player Inventory
              </p>
              <h2 className="mt-2 pr-14 text-3xl font-black text-white">
                My Vault
              </h2>
              <p className="mt-1 pr-14 text-xs text-slate-400">
                {stats.total} cards · {stats.rare} rare+ · {stats.locked} locked
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.05] px-3 py-2">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
                    Cards
                  </p>
                  <p className="mt-1 text-xl font-black text-white">
                    {stats.total}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.05] px-3 py-2">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
                    Rare+
                  </p>
                  <p className="mt-1 text-xl font-black text-amber-300">
                    {stats.rare}
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.05] px-3 py-2">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
                    Locked
                  </p>
                  <p className="mt-1 text-xl font-black text-purple-300">
                    {stats.locked}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                {vaultFilters.map((filter) => {
                  const isActive = filter.id === activeFilter

                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveFilter(filter.id)}
                      className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition active:scale-95 ${
                        isActive
                          ? 'border-cyan-300/60 bg-cyan-300/15 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.18)]'
                          : 'border-white/10 bg-white/[0.04] text-slate-400'
                      }`}
                    >
                      {filter.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-4">
              {cards.length === 0 ? (
                <div className="rounded-[1.6rem] border border-cyan-300/15 bg-white/[0.04] p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10">
                    <PackageOpen className="h-7 w-7 text-cyan-300" />
                  </div>
                  <h3 className="text-xl font-black text-white">Vault is Empty</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Open a pack and your cards will be saved here automatically.
                  </p>
                </div>
              ) : filteredCards.length === 0 ? (
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-6 text-center">
                  <Search className="mx-auto h-8 w-8 text-slate-500" />
                  <h3 className="mt-3 text-lg font-black text-white">
                    No cards in this filter
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Try another vault category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {filteredCards.map((card, index) => {
                    const sellBackPoints = getSellBackPoints(card)
                    const isListed = card.status === 'Listed on Marketplace'
                    const isLocked = card.status !== 'Stored'

                    return (
                      <motion.article
                        key={card.id}
                        className="overflow-hidden rounded-[1.4rem] border border-cyan-300/12 bg-slate-950/70 shadow-[0_0_28px_rgba(34,211,238,0.08)]"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.015 }}
                      >
                        <div className="relative flex h-36 items-center justify-center overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.16),rgba(15,23,42,0.25)_42%,rgba(0,0,0,0.55))] p-2 sm:h-40">
                          <img
                            src={card.image}
                            alt={card.name}
                            className="h-full w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]"
                          />
                          <span
                            className={`absolute left-2 top-2 rounded-full border px-2 py-1 text-[8px] font-black uppercase tracking-wider ${getStatusStyle(card.status)}`}
                          >
                            {card.status === 'Stored' ? 'Stored' : 'Locked'}
                          </span>
                        </div>

                        <div className="p-3">
                          <div className="mb-2 flex flex-wrap gap-1.5">
                            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-amber-200">
                              {card.rarity}
                            </span>
                            <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-purple-200">
                              {sellBackPoints} pts
                            </span>
                          </div>

                          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-black leading-5 text-white">
                            {card.name}
                          </h3>
                          <p className="mt-1 line-clamp-1 text-[10px] uppercase tracking-[0.2em] text-cyan-300">
                            {shortPackName(card.sourcePack)}
                          </p>

                          <div className="mt-3 grid grid-cols-3 gap-1.5">
                            <button
                              type="button"
                              disabled={isLocked}
                              onClick={() => onSellBackCard?.(card)}
                              className={`flex h-9 items-center justify-center rounded-xl border text-[10px] font-black transition active:scale-95 ${
                                isLocked
                                  ? 'cursor-not-allowed border-slate-500/15 bg-slate-500/10 text-slate-500'
                                  : 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200'
                              }`}
                            >
                              Sell
                            </button>
                            <button
                              type="button"
                              disabled={isLocked}
                              onClick={() => onRequestShippingCard?.(card)}
                              className={`flex h-9 items-center justify-center rounded-xl border text-[10px] font-black transition active:scale-95 ${
                                isLocked
                                  ? 'cursor-not-allowed border-slate-500/15 bg-slate-500/10 text-slate-500'
                                  : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-200'
                              }`}
                            >
                              Ship
                            </button>
                            <button
                              type="button"
                              disabled={isLocked && !isListed}
                              onClick={() =>
                                isListed
                                  ? onCancelMarketplaceListing?.(card)
                                  : onListForSaleCard?.(card)
                              }
                              className={`flex h-9 items-center justify-center rounded-xl border text-[10px] font-black transition active:scale-95 ${
                                isListed
                                  ? 'border-rose-300/25 bg-rose-300/10 text-rose-200'
                                  : isLocked
                                    ? 'cursor-not-allowed border-slate-500/15 bg-slate-500/10 text-slate-500'
                                    : 'border-amber-300/25 bg-amber-300/10 text-amber-200'
                              }`}
                            >
                              {isListed ? 'Cancel' : 'List'}
                            </button>
                          </div>

                          <div className="mt-3 space-y-1.5 text-[10px] text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3 text-cyan-300" />
                              <span className="line-clamp-1">{card.openedAt}</span>
                            </div>
                            {card.fairnessId && (
                              <div className="flex items-center gap-1.5">
                                <Hash className="h-3 w-3 text-emerald-300" />
                                <span className="line-clamp-1">{card.fairnessId}</span>
                              </div>
                            )}
                            {card.shippingInfo?.trackingNumber && (
                              <div className="flex items-center gap-1.5 text-emerald-300">
                                <Truck className="h-3 w-3" />
                                <span className="line-clamp-1">
                                  {card.shippingInfo.trackingNumber}
                                </span>
                              </div>
                            )}
                            {isListed && card.listingPrice && (
                              <div className="flex items-center gap-1.5 text-amber-300">
                                <ShoppingBag className="h-3 w-3" />
                                <span>{card.listingPrice.toLocaleString()} pts</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    )
                  })}
                </div>
              )}

              {cards.length > 0 && (
                <div className="mt-4 rounded-2xl border border-purple-300/10 bg-purple-400/[0.05] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-300">
                    Vault Notice
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Sell Back converts cards into points. Shipping or Marketplace actions lock the card until completed or cancelled.
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
