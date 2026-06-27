import { AnimatePresence, motion } from 'framer-motion'
import {
  Coins,
  Gavel,
  PackageOpen,
  ReceiptText,
  RefreshCcw,
  ShoppingBag,
  Ticket,
  Truck,
  Wallet,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { translations, type AppLanguage, type Translation } from '../lib/i18n'

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
  language: AppLanguage
  transactions: TransactionRecord[]
  onClose: () => void
}

type TransactionFilter = 'all' | 'top-up' | 'spent' | 'reward' | 'raffle'

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
    return 'border-sky-300/20 bg-sky-300/10 text-sky-300'
  }

  if (type === 'auction') {
    return 'border-orange-300/20 bg-orange-300/10 text-orange-300'
  }

  return 'border-slate-300/20 bg-slate-300/10 text-slate-300'
}

function getAmountMeta(transaction: TransactionRecord) {
  const isPositive = transaction.type === 'top-up' || transaction.type === 'sell-back'
  const isZero = transaction.amount === 0
  const sign = isZero ? '' : isPositive ? '+' : '-'
  const color = isZero
    ? 'text-slate-400'
    : isPositive
      ? 'text-emerald-300'
      : 'text-rose-300'

  return {
    color,
    label: `${sign}${transaction.amount.toLocaleString()}`,
  }
}

function getFilterMatch(filter: TransactionFilter, transaction: TransactionRecord) {
  if (filter === 'all') return true
  if (filter === 'top-up') return transaction.type === 'top-up'
  if (filter === 'spent') {
    return (
      transaction.type === 'open-1' ||
      transaction.type === 'open-10' ||
      transaction.type === 'auction'
    )
  }
  if (filter === 'reward') return transaction.type === 'sell-back'
  if (filter === 'raffle') return transaction.type === 'raffle'

  return true
}

function getTextAfterSeparator(value: string) {
  return value.includes('·') ? value.split('·').slice(1).join('·').trim() : ''
}

function getOpenQuantity(transaction: TransactionRecord) {
  if (transaction.type === 'open-1') return 1

  const match = transaction.title.match(/Open\s+(\d+)/i)
  return match ? Number(match[1]) : 10
}

function getLocalizedTransactionStatus(
  status: TransactionRecord['status'],
  t: Translation,
) {
  if (status === 'Completed') return t.transactionStatusCompleted
  if (status === 'Pending') return t.transactionStatusPending
  if (status === 'Failed') return t.transactionStatusFailed

  return status
}

function getLocalizedTransactionTitle(transaction: TransactionRecord, t: Translation) {
  const itemName = getTextAfterSeparator(transaction.title)

  if (transaction.type === 'top-up') {
    if (transaction.title.includes('Daily Login')) {
      const dayMatch = transaction.title.match(/Day\s+(\d+)/i)
      return dayMatch
        ? `${t.txDailyLoginTitle} · ${t.day} ${dayMatch[1]}`
        : t.txDailyLoginTitle
    }

    if (transaction.title.includes('Quest XP')) return t.txQuestXpRewardTitle
    if (transaction.title.includes('Quest')) return t.txQuestRewardTitle

    return t.txWalletTopUpTitle
  }

  if (transaction.type === 'open-1') {
    return itemName ? `${t.txOpenPackTitle} · ${itemName}` : t.txOpenPackTitle
  }

  if (transaction.type === 'open-10') {
    const quantity = getOpenQuantity(transaction)
    return itemName
      ? `${t.txOpenMultiTitle} ${quantity} · ${itemName}`
      : `${t.txOpenMultiTitle} ${quantity}`
  }

  if (transaction.type === 'sell-back') {
    return itemName ? `${t.txSellBackTitle} · ${itemName}` : t.txSellBackTitle
  }

  if (transaction.type === 'shipping') {
    if (transaction.title.includes('Request')) {
      return itemName
        ? `${t.txShippingRequestTitle} · ${itemName}`
        : t.txShippingRequestTitle
    }

    return itemName
      ? `${t.txShippingStatusTitle} · ${itemName}`
      : t.txShippingStatusTitle
  }

  if (transaction.type === 'raffle') {
    return itemName ? `${t.txRaffleEntryTitle} · ${itemName}` : t.txRaffleEntryTitle
  }

  if (transaction.type === 'marketplace') {
    if (transaction.title.includes('Cancelled')) {
      return itemName
        ? `${t.txCancelledListingTitle} · ${itemName}`
        : t.txCancelledListingTitle
    }

    return itemName
      ? `${t.txListedMarketplaceTitle} · ${itemName}`
      : t.txListedMarketplaceTitle
  }

  if (transaction.type === 'auction') {
    return itemName ? `${t.txAuctionBidTitle} · ${itemName}` : t.txAuctionBidTitle
  }

  return transaction.title
}

function getLocalizedTransactionDescription(
  transaction: TransactionRecord,
  t: Translation,
) {
  if (transaction.type === 'top-up') {
    if (transaction.title.includes('Daily Login')) return t.txDailyLoginDesc
    if (transaction.title.includes('Quest')) return t.txQuestRewardDesc
    return t.txWalletTopUpDesc
  }

  if (transaction.type === 'open-1') return t.txOpenPackDesc
  if (transaction.type === 'open-10') return t.txOpenMultiDesc
  if (transaction.type === 'sell-back') return t.txSellBackDesc

  if (transaction.type === 'shipping') {
    return transaction.title.includes('Request')
      ? t.txShippingRequestDesc
      : t.txShippingStatusDesc
  }

  if (transaction.type === 'raffle') return t.txRaffleEntryDesc

  if (transaction.type === 'marketplace') {
    return transaction.title.includes('Cancelled')
      ? t.txCancelledListingDesc
      : t.txListedMarketplaceDesc
  }

  if (transaction.type === 'auction') return t.txAuctionBidDesc

  return transaction.description || t.txGenericTransactionDesc
}

const transactionFilters: Array<{ id: TransactionFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'top-up', label: 'Top Up' },
  { id: 'spent', label: 'Spent' },
  { id: 'reward', label: 'Rewards' },
  { id: 'raffle', label: 'Raffle' },
]

export default function TransactionDrawer({
  isOpen,
  language,
  transactions,
  onClose,
}: TransactionDrawerProps) {
  const t = translations[language]
  const [activeFilter, setActiveFilter] = useState<TransactionFilter>('all')

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

  const stats = useMemo(() => {
    const totalTopUp = transactions
      .filter((transaction) => transaction.type === 'top-up')
      .reduce((total, transaction) => total + transaction.amount, 0)

    const totalSpent = transactions
      .filter(
        (transaction) =>
          transaction.type === 'open-1' ||
          transaction.type === 'open-10' ||
          transaction.type === 'auction',
      )
      .reduce((total, transaction) => total + transaction.amount, 0)

    const raffleEntries = transactions.filter(
      (transaction) => transaction.type === 'raffle',
    ).length

    return { totalTopUp, totalSpent, raffleEntries }
  }, [transactions])

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) =>
        getFilterMatch(activeFilter, transaction),
      ),
    [activeFilter, transactions],
  )

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
            className="ml-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden border-l border-purple-300/20 bg-[#030712]/95 shadow-[0_0_60px_rgba(168,85,247,0.18)] sm:max-w-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 150, damping: 24 }}
          >
            <div className="sticky top-0 z-20 shrink-0 border-b border-purple-300/10 bg-[#030712]/90 px-4 pb-3 pt-4 backdrop-blur-xl">
              <button
                type="button"
                onClick={onClose}
                aria-label={t.cancel}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-purple-300/30 bg-slate-950/90 text-purple-100 shadow-[0_0_28px_rgba(168,85,247,0.25)] transition active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>

              <p className="hud-label pr-14 text-[10px] tracking-[0.32em] text-purple-300">
                {t.ledger}
              </p>
              <h2 className="mt-2 pr-14 text-3xl font-black text-white">
                {t.transactionHistory}
              </h2>
              <p className="mt-1 pr-14 text-xs text-slate-400">
                {t.transactionHistoryDesc}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.05] px-3 py-2">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
                    {t.topUp}
                  </p>
                  <p className="mt-1 text-lg font-black text-emerald-300">
                    {stats.totalTopUp.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.05] px-3 py-2">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
                    {t.spent}
                  </p>
                  <p className="mt-1 text-lg font-black text-cyan-300">
                    {stats.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl border border-pink-300/10 bg-pink-300/[0.05] px-3 py-2">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
                    {t.raffleCenter}
                  </p>
                  <p className="mt-1 text-lg font-black text-pink-300">
                    {stats.raffleEntries}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                {transactionFilters.map((filter) => {
                  const isActive = filter.id === activeFilter

                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveFilter(filter.id)}
                      className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition active:scale-95 ${
                        isActive
                          ? 'border-purple-300/60 bg-purple-300/15 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.18)]'
                          : 'border-white/10 bg-white/[0.04] text-slate-400'
                      }`}
                    >
                      {filter.id === 'all' ? t.all : filter.id === 'top-up' ? t.topUp : filter.id === 'spent' ? t.spent : filter.id === 'reward' ? t.navRewards : t.raffleCenter}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-4">
              {transactions.length === 0 ? (
                <div className="rounded-[1.6rem] border border-purple-300/15 bg-white/[0.04] p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-300/25 bg-purple-300/10">
                    <RefreshCcw className="h-7 w-7 text-purple-300" />
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {t.noTransactionsYet}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {t.noTransactionsDesc}
                  </p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-6 text-center">
                  <ReceiptText className="mx-auto h-8 w-8 text-slate-500" />
                  <h3 className="mt-3 text-lg font-black text-white">
                    {t.noActivityHere}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {t.tryAnotherTransactionCategory}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="px-1 text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                    {t.latestActivity}
                  </p>

                  {filteredTransactions.map((transaction, index) => {
                    const Icon = getTransactionIcon(transaction.type)
                    const style = getTransactionStyle(transaction.type)
                    const amount = getAmountMeta(transaction)

                    return (
                      <motion.article
                        key={transaction.id}
                        className="rounded-[1.35rem] border border-white/10 bg-slate-950/70 p-3 shadow-[0_0_24px_rgba(15,23,42,0.45)]"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.012 }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${style}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="line-clamp-1 text-sm font-black text-white">
                                  {getLocalizedTransactionTitle(transaction, t)}
                                </h3>
                                <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                                  {transaction.createdAt} · {getLocalizedTransactionStatus(transaction.status, t)}
                                </p>
                              </div>

                              <div className="shrink-0 text-right">
                                <p className={`text-sm font-black ${amount.color}`}>
                                  {amount.label}
                                </p>
                                <p className="mt-1 text-[10px] text-slate-500">
                                  {t.bal} {transaction.balanceAfter.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                              {getLocalizedTransactionDescription(transaction, t)}
                            </p>
                          </div>
                        </div>
                      </motion.article>
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
