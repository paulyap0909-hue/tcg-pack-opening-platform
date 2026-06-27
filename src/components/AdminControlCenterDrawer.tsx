import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  Boxes,
  CheckCircle2,
  Database,
  Gem,
  Hash,
  MapPin,
  PackageCheck,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  Truck,
  Wallet,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import type { Pack } from '../data/cardPool'
import type { FairnessRecord } from './FairnessCenterPanel'
import type { MarketplaceListing } from './MarketplacePanel'
import type { QuestStats } from './QuestLeaderboardPanel'
import type { RaffleEntry } from './RaffleCenterPanel'
import type { TransactionRecord } from './TransactionDrawer'
import type { ShippingStatus, VaultCard } from './VaultDrawer'

type AdminTab =
  | 'overview'
  | 'packs'
  | 'shipping'
  | 'marketplace'
  | 'raffle'
  | 'fairness'
  | 'transactions'

type AdminControlCenterDrawerProps = {
  isOpen: boolean
  packs: Pack[]
  vaultCards: VaultCard[]
  transactions: TransactionRecord[]
  marketplaceListings: MarketplaceListing[]
  raffleTickets: number
  raffleEntries: RaffleEntry[]
  fairnessRecords: FairnessRecord[]
  questStats: QuestStats
  walletBalance: number
  onClose: () => void
  onUpdateShippingStatus: (
    cardId: string,
    nextStatus: ShippingStatus,
    trackingNumber?: string,
  ) => void
  onResetDemoData: () => void
}

const adminTabs: { id: AdminTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'packs', label: 'Packs' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'raffle', label: 'Raffle' },
  { id: 'fairness', label: 'Fairness' },
  { id: 'transactions', label: 'Transactions' },
]

const shippingStatusSteps: ShippingStatus[] = [
  'Shipping Requested',
  'Preparing',
  'Shipped',
  'Delivered',
]

const getNextShippingStatus = (status: ShippingStatus): ShippingStatus | null => {
  if (status === 'Shipping Requested') return 'Preparing'
  if (status === 'Preparing') return 'Shipped'
  if (status === 'Shipped') return 'Delivered'

  return null
}

const isShippingCard = (card: VaultCard) => {
  return card.status !== 'Stored' && card.status !== 'Listed on Marketplace'
}

const isNearlySoldOut = (pack: Pack) => {
  return pack.remainingQuantity > 0 && pack.remainingQuantity <= 10
}

const getPackCost = (pack: Pack) => {
  return Number(pack.price.replace(/[^0-9]/g, '')) || 0
}

export default function AdminControlCenterDrawer({
  isOpen,
  packs,
  vaultCards,
  transactions,
  marketplaceListings,
  raffleTickets,
  raffleEntries,
  fairnessRecords,
  questStats,
  walletBalance,
  onClose,
  onUpdateShippingStatus,
  onResetDemoData,
}: AdminControlCenterDrawerProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({})

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

  const shippingCards = useMemo(
    () => vaultCards.filter(isShippingCard),
    [vaultCards],
  )

  const totalStockLeft = packs.reduce(
    (total, pack) => total + pack.remainingQuantity,
    0,
  )

  const totalStock = packs.reduce((total, pack) => total + pack.totalQuantity, 0)
  const totalPointsSpent = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0)
  const activeListings = marketplaceListings.length
  const playerListings = marketplaceListings.filter(
    (listing) => listing.source === 'player',
  ).length
  const totalRaffleEntryTickets = raffleEntries.reduce(
    (total, entry) => total + entry.tickets,
    0,
  )
  const rareFairnessRecords = fairnessRecords.filter((record) => {
    const rarity = record.rarity.toLowerCase()

    return rarity.includes('secret') || rarity.includes('super')
  })

  const metrics = [
    {
      label: 'Packs Opened',
      value: questStats.openPacks.toLocaleString(),
      icon: Boxes,
      tone: 'text-cyan-300 border-cyan-300/20 bg-cyan-300/10',
    },
    {
      label: 'Points Spent',
      value: totalPointsSpent.toLocaleString(),
      icon: Wallet,
      tone: 'text-amber-300 border-amber-300/20 bg-amber-300/10',
    },
    {
      label: 'Vault Cards',
      value: vaultCards.length.toLocaleString(),
      icon: Gem,
      tone: 'text-purple-300 border-purple-300/20 bg-purple-300/10',
    },
    {
      label: 'Shipping Queue',
      value: shippingCards.length.toLocaleString(),
      icon: Truck,
      tone: 'text-emerald-300 border-emerald-300/20 bg-emerald-300/10',
    },
    {
      label: 'Marketplace',
      value: activeListings.toLocaleString(),
      icon: ShoppingBag,
      tone: 'text-sky-300 border-sky-300/20 bg-sky-300/10',
    },
    {
      label: 'Raffle Entries',
      value: totalRaffleEntryTickets.toLocaleString(),
      icon: Ticket,
      tone: 'text-rose-300 border-rose-300/20 bg-rose-300/10',
    },
    {
      label: 'Fairness Logs',
      value: fairnessRecords.length.toLocaleString(),
      icon: ShieldCheck,
      tone: 'text-lime-300 border-lime-300/20 bg-lime-300/10',
    },
    {
      label: 'Transactions',
      value: transactions.length.toLocaleString(),
      icon: ReceiptText,
      tone: 'text-fuchsia-300 border-fuchsia-300/20 bg-fuchsia-300/10',
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[99999] overflow-hidden bg-black/75 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.aside
            className="hud-panel hud-corners ml-auto flex h-screen w-full max-w-6xl flex-col overflow-hidden rounded-l-[2rem] border-l border-cyan-300/20 p-6"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 150, damping: 24 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close admin control center"
              className="absolute right-6 top-6 z-[9999] flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-950/95 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition hover:scale-105 hover:bg-cyan-300/10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="shrink-0 border-b border-cyan-300/10 pb-5 pr-16">
              <p className="hud-label text-sm">Platform Admin</p>

              <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-3xl font-black sm:text-4xl">
                    Admin Control Center
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                    Monitor pack stock, shipping requests, marketplace listings,
                    raffle activity, fairness records, and transaction flow in one
                    operating dashboard.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
                  <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-amber-200">
                      Demo Wallet
                    </p>
                    <p className="mt-2 text-2xl font-black text-amber-300">
                      {walletBalance.toLocaleString()} pts
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onResetDemoData}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-rose-300/30 bg-rose-300/10 px-4 py-4 text-sm font-black uppercase tracking-wider text-rose-200 transition hover:scale-[1.02] hover:bg-rose-300/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Demo
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 shrink-0 overflow-x-auto pb-2">
              <div className="flex min-w-max gap-2">
                {adminTabs.map((tab) => {
                  const isActive = activeTab === tab.id

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-[0.2em] transition ${
                        isActive
                          ? 'border-cyan-300/40 bg-cyan-300/20 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.18)]'
                          : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-cyan-300/30 hover:text-cyan-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-2">
              {activeTab === 'overview' && (
                <div className="space-y-5 pb-8">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => {
                      const Icon = metric.icon

                      return (
                        <div
                          key={metric.label}
                          className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4"
                        >
                          <div
                            className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl border ${metric.tone}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                            {metric.label}
                          </p>
                          <p className="mt-2 text-2xl font-black text-white">
                            {metric.value}
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  <div className="grid gap-5 xl:grid-cols-3">
                    <div className="hud-card hud-corners rounded-[2rem] p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-cyan-300" />
                        <h3 className="text-xl font-black text-white">
                          Stock Snapshot
                        </h3>
                      </div>
                      <p className="text-sm leading-6 text-slate-400">
                        {totalStockLeft.toLocaleString()} of{' '}
                        {totalStock.toLocaleString()} packs remain across all
                        active drops.
                      </p>
                      <div className="mt-4 space-y-3">
                        {packs.slice(0, 5).map((pack) => (
                          <div key={pack.name}>
                            <div className="mb-1 flex justify-between gap-4 text-xs">
                              <span className="truncate font-bold text-white">
                                {pack.name}
                              </span>
                              <span className="text-slate-400">
                                {pack.remainingQuantity}/{pack.totalQuantity}
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-cyan-300"
                                style={{
                                  width: `${Math.max(
                                    (pack.remainingQuantity / pack.totalQuantity) *
                                      100,
                                    3,
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="hud-card hud-corners rounded-[2rem] p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <Truck className="h-5 w-5 text-emerald-300" />
                        <h3 className="text-xl font-black text-white">
                          Shipping Pipeline
                        </h3>
                      </div>
                      <div className="grid gap-3">
                        {shippingStatusSteps.map((status) => (
                          <div
                            key={status}
                            className="flex items-center justify-between rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] px-4 py-3"
                          >
                            <span className="text-sm font-bold text-slate-300">
                              {status}
                            </span>
                            <span className="text-xl font-black text-emerald-300">
                              {
                                shippingCards.filter(
                                  (card) => card.status === status,
                                ).length
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="hud-card hud-corners rounded-[2rem] p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <Database className="h-5 w-5 text-purple-300" />
                        <h3 className="text-xl font-black text-white">
                          System Readiness
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {[
                          'Player pack opening loop',
                          'Vault / sell back / shipping',
                          'Marketplace economy',
                          'Quest / raffle engagement',
                          'Provably fair records',
                          'Admin operations dashboard',
                        ].map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-3 rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] px-4 py-3"
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                            <span className="text-sm text-slate-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'packs' && (
                <div className="space-y-4 pb-8">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Active Packs
                      </p>
                      <p className="mt-2 text-2xl font-black text-cyan-300">
                        {packs.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Nearly Sold Out
                      </p>
                      <p className="mt-2 text-2xl font-black text-amber-300">
                        {packs.filter(isNearlySoldOut).length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-rose-300/10 bg-rose-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Sold Out
                      </p>
                      <p className="mt-2 text-2xl font-black text-rose-300">
                        {packs.filter((pack) => pack.remainingQuantity <= 0).length}
                      </p>
                    </div>
                  </div>

                  {packs.map((pack) => {
                    const sold = pack.totalQuantity - pack.remainingQuantity
                    const soldPercent = Math.round((sold / pack.totalQuantity) * 100)

                    return (
                      <div
                        key={pack.name}
                        className="hud-card hud-corners rounded-[2rem] p-5"
                      >
                        <div className="grid gap-5 lg:grid-cols-[110px_1fr]">
                          <div className="flex h-[140px] items-center justify-center rounded-2xl border border-cyan-300/15 bg-black/50 p-2">
                            <img
                              src={pack.cover}
                              alt={pack.name}
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <div>
                            <div className="mb-3 flex flex-wrap gap-2">
                              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-200">
                                {pack.category}
                              </span>
                              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-200">
                                {pack.badge}
                              </span>
                              {isNearlySoldOut(pack) && (
                                <span className="rounded-full border border-rose-300/20 bg-rose-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-200">
                                  Nearly Sold Out
                                </span>
                              )}
                            </div>

                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                              <div>
                                <h3 className="text-2xl font-black text-white">
                                  {pack.name}
                                </h3>
                                <p className="mt-2 text-sm text-slate-400">
                                  Price: {getPackCost(pack).toLocaleString()} pts ·
                                  Sold: {sold.toLocaleString()} packs
                                </p>
                              </div>
                              <div className="text-left md:text-right">
                                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                                  Stock Left
                                </p>
                                <p className="text-2xl font-black text-cyan-300">
                                  {pack.remainingQuantity}/{pack.totalQuantity}
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-purple-400"
                                style={{ width: `${Math.max(soldPercent, 2)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4 pb-8">
                  <div className="grid gap-3 sm:grid-cols-4">
                    {shippingStatusSteps.map((status) => (
                      <div
                        key={status}
                        className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] p-4"
                      >
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          {status}
                        </p>
                        <p className="mt-2 text-2xl font-black text-emerald-300">
                          {
                            shippingCards.filter((card) => card.status === status)
                              .length
                          }
                        </p>
                      </div>
                    ))}
                  </div>

                  {shippingCards.length === 0 ? (
                    <div className="hud-card hud-corners rounded-[2rem] p-8 text-center">
                      <Truck className="mx-auto mb-4 h-12 w-12 text-emerald-300" />
                      <h3 className="text-2xl font-black text-white">
                        No Shipping Requests
                      </h3>
                      <p className="mt-3 text-sm text-slate-400">
                        Player shipping requests will appear here after they submit
                        the shipping address form from the Vault.
                      </p>
                    </div>
                  ) : (
                    shippingCards.map((card, index) => {
                      const nextStatus = getNextShippingStatus(card.status)
                      const trackingInput = trackingInputs[card.id] ?? ''

                      return (
                        <motion.div
                          key={card.id}
                          className="hud-card hud-corners rounded-[2rem] p-5"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <div className="grid gap-5 xl:grid-cols-[120px_1fr]">
                            <div className="hud-rarity-glow flex min-h-[170px] items-center justify-center rounded-2xl border border-emerald-300/15 bg-black/60 p-2">
                              <img
                                src={card.image}
                                alt={card.name}
                                className="max-h-[160px] w-auto object-contain"
                              />
                            </div>

                            <div>
                              <div className="mb-3 flex flex-wrap gap-2">
                                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-200">
                                  {card.rarity}
                                </span>
                                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-200">
                                  {card.grade}
                                </span>
                                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-200">
                                  {card.status}
                                </span>
                              </div>

                              <h3 className="text-2xl font-black text-white">
                                {card.name}
                              </h3>
                              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-cyan-300">
                                {card.sourcePack}
                              </p>

                              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                                <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                                  <div className="mb-2 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-cyan-300" />
                                    <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                                      Recipient
                                    </p>
                                  </div>
                                  <p className="text-sm font-bold text-white">
                                    {card.shippingInfo?.fullName ?? 'No name'}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-400">
                                    {card.shippingInfo?.phone ?? 'No phone'}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-400">
                                    {card.shippingInfo?.email ?? 'No email'}
                                  </p>
                                </div>

                                <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-4 lg:col-span-2">
                                  <div className="mb-2 flex items-center gap-2">
                                    <PackageCheck className="h-4 w-4 text-purple-300" />
                                    <p className="text-xs uppercase tracking-[0.22em] text-purple-300">
                                      Address
                                    </p>
                                  </div>
                                  <p className="text-sm leading-6 text-slate-300">
                                    {card.shippingInfo?.address ?? 'No address'}
                                    <br />
                                    {card.shippingInfo?.postcode ?? ''}{' '}
                                    {card.shippingInfo?.city ?? ''}{' '}
                                    {card.shippingInfo?.state ?? ''}
                                  </p>
                                  {card.shippingInfo?.remark && (
                                    <p className="mt-2 text-sm text-slate-400">
                                      Remark: {card.shippingInfo.remark}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
                                <input
                                  value={trackingInput}
                                  onChange={(event) =>
                                    setTrackingInputs((currentInputs) => ({
                                      ...currentInputs,
                                      [card.id]: event.target.value,
                                    }))
                                  }
                                  placeholder="Tracking number, required before Shipped"
                                  className="rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                                />

                                <button
                                  type="button"
                                  disabled={!nextStatus}
                                  onClick={() =>
                                    nextStatus &&
                                    onUpdateShippingStatus(
                                      card.id,
                                      nextStatus,
                                      trackingInput.trim() || undefined,
                                    )
                                  }
                                  className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
                                    nextStatus
                                      ? 'border border-emerald-300/30 bg-emerald-300/10 text-emerald-200 hover:scale-[1.02] hover:bg-emerald-300/20'
                                      : 'cursor-not-allowed border border-slate-500/20 bg-slate-500/10 text-slate-500'
                                  }`}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  {nextStatus ? `Mark ${nextStatus}` : 'Completed'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                </div>
              )}

              {activeTab === 'marketplace' && (
                <div className="space-y-4 pb-8">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-sky-300/10 bg-sky-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Active Listings
                      </p>
                      <p className="mt-2 text-2xl font-black text-sky-300">
                        {activeListings}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Player Listings
                      </p>
                      <p className="mt-2 text-2xl font-black text-emerald-300">
                        {playerListings}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Demo Listings
                      </p>
                      <p className="mt-2 text-2xl font-black text-amber-300">
                        {marketplaceListings.filter((listing) => listing.source === 'demo').length}
                      </p>
                    </div>
                  </div>

                  {marketplaceListings.length === 0 ? (
                    <div className="hud-card hud-corners rounded-[2rem] p-8 text-center">
                      <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-sky-300" />
                      <h3 className="text-2xl font-black text-white">
                        No Marketplace Listings
                      </h3>
                      <p className="mt-3 text-sm text-slate-400">
                        Player and demo listings will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 xl:grid-cols-2">
                      {marketplaceListings.map((listing) => (
                        <div
                          key={listing.id}
                          className="hud-card hud-corners rounded-[2rem] p-4"
                        >
                          <div className="flex gap-4">
                            <div className="flex h-[120px] w-[90px] shrink-0 items-center justify-center rounded-2xl border border-sky-300/15 bg-black/50 p-2">
                              <img
                                src={listing.card.image}
                                alt={listing.card.name}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-2 flex flex-wrap gap-2">
                                <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-sky-200">
                                  {listing.source === 'player' ? 'Player' : 'Demo'}
                                </span>
                                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-200">
                                  {listing.card.rarity}
                                </span>
                              </div>
                              <h3 className="truncate text-lg font-black text-white">
                                {listing.card.name}
                              </h3>
                              <p className="mt-1 text-sm text-slate-400">
                                Seller: {listing.seller} · {listing.listedAt}
                              </p>
                              <p className="mt-3 text-2xl font-black text-sky-300">
                                {listing.price.toLocaleString()} pts
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'raffle' && (
                <div className="space-y-4 pb-8">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Ticket Balance
                      </p>
                      <p className="mt-2 text-2xl font-black text-amber-300">
                        {raffleTickets}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Entry Records
                      </p>
                      <p className="mt-2 text-2xl font-black text-purple-300">
                        {raffleEntries.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-rose-300/10 bg-rose-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Tickets Entered
                      </p>
                      <p className="mt-2 text-2xl font-black text-rose-300">
                        {totalRaffleEntryTickets}
                      </p>
                    </div>
                  </div>

                  {raffleEntries.length === 0 ? (
                    <div className="hud-card hud-corners rounded-[2rem] p-8 text-center">
                      <Ticket className="mx-auto mb-4 h-12 w-12 text-amber-300" />
                      <h3 className="text-2xl font-black text-white">
                        No Raffle Entries
                      </h3>
                      <p className="mt-3 text-sm text-slate-400">
                        Raffle entries will appear after players spend tickets in
                        Raffle Center.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {raffleEntries.slice(0, 12).map((entry) => (
                        <div
                          key={entry.id}
                          className="flex flex-col gap-2 rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-black text-white">
                              {entry.prizeName}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              {entry.createdAt} · {entry.status}
                            </p>
                          </div>
                          <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm font-black text-amber-200">
                            {entry.tickets} tickets
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'fairness' && (
                <div className="space-y-4 pb-8">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-lime-300/10 bg-lime-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Records
                      </p>
                      <p className="mt-2 text-2xl font-black text-lime-300">
                        {fairnessRecords.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Rare+ Records
                      </p>
                      <p className="mt-2 text-2xl font-black text-amber-300">
                        {rareFairnessRecords.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Demo Status
                      </p>
                      <p className="mt-2 text-xl font-black text-cyan-300">
                        Verified
                      </p>
                    </div>
                  </div>

                  {fairnessRecords.length === 0 ? (
                    <div className="hud-card hud-corners rounded-[2rem] p-8 text-center">
                      <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-lime-300" />
                      <h3 className="text-2xl font-black text-white">
                        No Fairness Records
                      </h3>
                      <p className="mt-3 text-sm text-slate-400">
                        Open packs to generate verification records.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {fairnessRecords.slice(0, 12).map((record) => (
                        <div
                          key={record.id}
                          className="rounded-2xl border border-lime-300/10 bg-lime-300/[0.04] p-4"
                        >
                          <div className="mb-2 flex flex-wrap gap-2">
                            <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-lime-200">
                              {record.verificationId}
                            </span>
                            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-200">
                              {record.rarity}
                            </span>
                          </div>
                          <p className="font-black text-white">
                            {record.resultSummary}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {record.packName} · Nonce {record.nonce} ·{' '}
                            {record.openedAt}
                          </p>
                          <div className="mt-3 flex items-center gap-2 rounded-xl border border-lime-300/10 bg-black/30 px-3 py-2 text-xs text-slate-400">
                            <Hash className="h-4 w-4 text-lime-300" />
                            <span className="truncate">{record.serverSeedHash}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="space-y-3 pb-8">
                  {transactions.length === 0 ? (
                    <div className="hud-card hud-corners rounded-[2rem] p-8 text-center">
                      <ReceiptText className="mx-auto mb-4 h-12 w-12 text-purple-300" />
                      <h3 className="text-2xl font-black text-white">
                        No Transactions
                      </h3>
                      <p className="mt-3 text-sm text-slate-400">
                        Wallet, opening, sell back, raffle, marketplace, and
                        shipping transactions will appear here.
                      </p>
                    </div>
                  ) : (
                    transactions.slice(0, 16).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex flex-col gap-2 rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-black text-white">
                            {transaction.title}
                          </p>
                          <p className="mt-1 max-w-2xl text-sm text-slate-400">
                            {transaction.description}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-black text-purple-300">
                            {transaction.amount.toLocaleString()} pts
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {transaction.createdAt}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
