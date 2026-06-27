import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Coins,
  PackageOpen,
  ReceiptText,
  ShoppingBag,
  RefreshCcw,
  Ticket,
  Truck,
  Wallet,
  Gavel,
} from 'lucide-react'
import { useEffect } from 'react'

export type TransactionType =
  | 'top-up'
  | 'open-1'
  | 'open-10'
  | 'sell-back'
  | 'shipping'
  | 'raffle'
  | 'marketplace'
  | 'auction'

export type TransactionRecord = {
  id: string
  type: TransactionType
  title: string
  description: string
  amount: number
  balanceAfter: number
  createdAt: string
  status: 'Completed' | 'Pending' | 'Failed'
}

type TransactionDrawerProps = {
  isOpen: boolean
  transactions: TransactionRecord[]
  onClose: () => void
}

function getTransactionIcon(type: TransactionType) {
  if (type === 'top-up') return Wallet
  if (type === 'open-1' || type === 'open-10') return PackageOpen
  if (type === 'sell-back') return Coins
  if (type === 'shipping') return Truck
  if (type === 'raffle') return Ticket
  if (type === 'marketplace') return ShoppingBag
  if (type === 'auction') return Gavel

  return ReceiptText
}

function getTransactionStyle(type: TransactionType) {
  if (type === 'top-up') {
    return 'border-emerald-300/20 bg-emerald-300/10 text-emerald-300'
  }

  if (type === 'open-1' || type === 'open-10') {
    return 'border-cyan-300/20 bg-cyan-300/10 text-cyan-300'
  }

  if (type === 'sell-back') {
    return 'border-amber-300/20 bg-amber-300/10 text-amber-300'
  }

  if (type === 'shipping') {
    return 'border-purple-300/20 bg-purple-300/10 text-purple-300'
  }

  if (type === 'raffle') {
    return 'border-pink-300/20 bg-pink-300/10 text-pink-300'
  }

  if (type === 'marketplace') {
    return 'border-cyan-300/20 bg-cyan-300/10 text-cyan-300'
  }

  if (type === 'auction') {
    return 'border-orange-300/20 bg-orange-300/10 text-orange-300'
  }

  return 'border-slate-300/20 bg-slate-300/10 text-slate-300'
}

export default function TransactionDrawer({
  isOpen,
  transactions,
  onClose,
}: TransactionDrawerProps) {
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

  const totalTopUp = transactions
    .filter((transaction) => transaction.type === 'top-up')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const totalSpent = transactions
    .filter(
      (transaction) =>
        transaction.type === 'open-1' || transaction.type === 'open-10',
    )
    .reduce((total, transaction) => total + transaction.amount, 0)

  const raffleEntries = transactions.filter(
    (transaction) => transaction.type === 'raffle',
  ).length

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
            className="hud-panel hud-corners ml-auto flex h-screen w-full max-w-2xl flex-col overflow-hidden rounded-l-[2rem] border-l border-purple-300/20 p-6"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 150, damping: 24 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close transaction history"
              className="absolute right-6 top-6 z-[9999] flex h-12 w-12 items-center justify-center rounded-full border border-purple-300/40 bg-slate-950/95 text-purple-100 shadow-[0_0_35px_rgba(168,85,247,0.35)] backdrop-blur transition hover:scale-105 hover:bg-purple-300/10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="shrink-0 border-b border-purple-300/10 pb-5 pr-16">
              <p className="hud-label text-sm">Ledger</p>

              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black">Transaction History</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Wallet, pack openings, sell back, shipping, quest rewards,
                    raffle entries, and marketplace trades.
                  </p>
                </div>

                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl border border-purple-300/30 bg-purple-300/10 sm:flex">
                  <ReceiptText className="h-7 w-7 text-purple-300" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid shrink-0 grid-cols-3 gap-3">
              <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Top Up
                </p>
                <p className="mt-2 text-2xl font-black text-emerald-300">
                  {totalTopUp.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Spent
                </p>
                <p className="mt-2 text-2xl font-black text-cyan-300">
                  {totalSpent.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl border border-pink-300/10 bg-pink-300/[0.04] p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Raffle
                </p>
                <p className="mt-2 text-2xl font-black text-pink-300">
                  {raffleEntries}
                </p>
              </div>
            </div>

            <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-2">
              {transactions.length === 0 ? (
                <div className="hud-card hud-corners rounded-[2rem] p-8 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-300/30 bg-purple-300/10">
                    <RefreshCcw className="h-8 w-8 text-purple-300" />
                  </div>

                  <h3 className="text-2xl font-black text-white">
                    No Transactions Yet
                  </h3>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                    Open packs, top up, sell back, request shipping, enter a raffle, or trade cards to generate transaction history.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pb-8">
                  {transactions.map((transaction, index) => {
                    const Icon = getTransactionIcon(transaction.type)
                    const style = getTransactionStyle(transaction.type)

                    return (
                      <motion.div
                        key={transaction.id}
                        className="hud-card hud-corners rounded-[2rem] p-4"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <div className="flex gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${style}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <h3 className="break-words text-base font-black text-white">
                                  {transaction.title}
                                </h3>

                                <p className="mt-1 break-words text-sm leading-6 text-slate-400">
                                  {transaction.description}
                                </p>
                              </div>

                              <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${style}`}>
                                {transaction.status}
                              </span>
                            </div>

                            <div className="mt-4 grid gap-2 sm:grid-cols-3">
                              <div className="rounded-xl border border-slate-300/10 bg-slate-300/[0.04] px-3 py-2">
                                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                  Time
                                </p>
                                <p className="mt-1 text-xs text-slate-300">
                                  {transaction.createdAt}
                                </p>
                              </div>

                              <div className="rounded-xl border border-slate-300/10 bg-slate-300/[0.04] px-3 py-2">
                                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                  Amount
                                </p>
                                <p className="mt-1 text-xs font-black text-slate-300">
                                  {transaction.amount.toLocaleString()}
                                </p>
                              </div>

                              <div className="rounded-xl border border-slate-300/10 bg-slate-300/[0.04] px-3 py-2">
                                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                  Balance
                                </p>
                                <p className="mt-1 text-xs font-black text-slate-300">
                                  {transaction.balanceAfter.toLocaleString()}
                                </p>
                              </div>
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
