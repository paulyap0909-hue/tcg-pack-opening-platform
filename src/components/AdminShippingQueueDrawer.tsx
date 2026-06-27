import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  MapPin,
  PackageCheck,
  Send,
  Settings,
  Truck,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import type { ShippingStatus, VaultCard } from './VaultDrawer'

type AdminShippingQueueDrawerProps = {
  isOpen: boolean
  cards: VaultCard[]
  onClose: () => void
  onUpdateShippingStatus: (
    cardId: string,
    nextStatus: ShippingStatus,
    trackingNumber?: string,
  ) => void
}

const statusSteps: ShippingStatus[] = [
  'Shipping Requested',
  'Preparing',
  'Shipped',
  'Delivered',
]

const getNextStatus = (status: ShippingStatus): ShippingStatus | null => {
  if (status === 'Shipping Requested') return 'Preparing'
  if (status === 'Preparing') return 'Shipped'
  if (status === 'Shipped') return 'Delivered'
  return null
}

export default function AdminShippingQueueDrawer({
  isOpen,
  cards,
  onClose,
  onUpdateShippingStatus,
}: AdminShippingQueueDrawerProps) {
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>(
    {},
  )

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

  const shippingCards = cards.filter(
    (card) => card.status !== 'Stored' && card.status !== 'Listed on Marketplace',
  )

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
            className="hud-panel hud-corners ml-auto flex h-screen w-full max-w-5xl flex-col overflow-hidden rounded-l-[2rem] border-l border-emerald-300/20 p-6"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 150, damping: 24 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close admin shipping queue"
              className="absolute right-6 top-6 z-[9999] flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/40 bg-slate-950/95 text-emerald-100 shadow-[0_0_35px_rgba(16,185,129,0.35)] transition hover:scale-105 hover:bg-emerald-300/10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="shrink-0 border-b border-emerald-300/10 pb-5 pr-16">
              <p className="hud-label text-sm">Admin Control Center</p>

              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black">Shipping Queue</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Review shipping requests, recipient details, and update
                    fulfillment status.
                  </p>
                </div>

                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-300/10 sm:flex">
                  <Settings className="h-7 w-7 text-emerald-300" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid shrink-0 grid-cols-4 gap-3">
              {statusSteps.map((status) => (
                <div
                  key={status}
                  className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] p-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    {status}
                  </p>
                  <p className="mt-2 text-2xl font-black text-emerald-300">
                    {shippingCards.filter((card) => card.status === status).length}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-2">
              {shippingCards.length === 0 ? (
                <div className="hud-card hud-corners rounded-[2rem] p-8 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-300/10">
                    <Truck className="h-8 w-8 text-emerald-300" />
                  </div>

                  <h3 className="text-2xl font-black text-white">
                    No Shipping Requests
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                    Player shipping requests will appear here after they submit
                    the shipping address form from the Vault.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pb-8">
                  {shippingCards.map((card, index) => {
                    const nextStatus = getNextStatus(card.status)
                    const trackingInput = trackingInputs[card.id] ?? ''

                    return (
                      <motion.div
                        key={card.id}
                        className="hud-card hud-corners rounded-[2rem] p-5"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <div className="grid gap-5 lg:grid-cols-[120px_1fr]">
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

                            <div className="mt-5 grid gap-3 md:grid-cols-2">
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

                              <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-4">
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
                                placeholder="Tracking number optional"
                                className="rounded-2xl border border-emerald-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60"
                              />

                              {nextStatus ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateShippingStatus(
                                      card.id,
                                      nextStatus,
                                      trackingInput || undefined,
                                    )
                                  }
                                  className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-sm font-black text-emerald-200 transition hover:scale-[1.02] hover:bg-emerald-300/20"
                                >
                                  {nextStatus === 'Shipped' ? (
                                    <Send className="h-4 w-4" />
                                  ) : nextStatus === 'Delivered' ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <Clock className="h-4 w-4" />
                                  )}
                                  Mark {nextStatus}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  className="flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-slate-500/20 bg-slate-500/10 px-5 py-3 text-sm font-black text-slate-500"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  Completed
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
