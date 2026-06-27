import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  CreditCard,
  Gem,
  Sparkles,
  Wallet,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type TopUpModalProps = {
  isOpen: boolean
  onClose: () => void
  onTopUp: (points: number) => void
}

type TopUpPackage = {
  id: string
  label: string
  price: string
  points: number
  bonus: number
  icon: 'gem' | 'spark' | 'wallet' | 'zap'
  popular?: boolean
}

const topUpPackages: TopUpPackage[] = [
  {
    id: 'starter',
    label: 'Starter',
    price: 'RM10',
    points: 300,
    bonus: 30,
    icon: 'gem',
  },
  {
    id: 'open10',
    label: 'Open 10',
    price: 'RM50',
    points: 1500,
    bonus: 150,
    icon: 'spark',
    popular: true,
  },
  {
    id: 'chase',
    label: 'Chase',
    price: 'RM200',
    points: 6000,
    bonus: 600,
    icon: 'wallet',
  },
  {
    id: 'highroller',
    label: 'High Roller',
    price: 'RM800',
    points: 24000,
    bonus: 2400,
    icon: 'zap',
  },
  {
    id: 'vault',
    label: 'Vault',
    price: 'RM2000',
    points: 60000,
    bonus: 6000,
    icon: 'wallet',
  },
  {
    id: 'legend',
    label: 'Legend',
    price: 'RM5000',
    points: 150000,
    bonus: 15000,
    icon: 'spark',
  },
]

const packageIconMap = {
  gem: Gem,
  spark: Sparkles,
  wallet: Wallet,
  zap: Zap,
}

const formatPoints = (value: number) => value.toLocaleString()

export default function TopUpModal({
  isOpen,
  onClose,
  onTopUp,
}: TopUpModalProps) {
  const [selectedPackageId, setSelectedPackageId] = useState('open10')

  const selectedPackage = useMemo(() => {
    return (
      topUpPackages.find((item) => item.id === selectedPackageId) ??
      topUpPackages[0]
    )
  }, [selectedPackageId])

  const totalPoints = selectedPackage.points + selectedPackage.bonus

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleConfirm = () => {
    onTopUp(totalPoints)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000000] flex items-end justify-center bg-black/78 px-0 py-0 backdrop-blur-xl sm:items-center sm:px-4 sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative flex h-[86svh] w-full max-w-[540px] flex-col overflow-hidden rounded-t-[2rem] border border-orange-300/25 bg-[#120906] text-white shadow-[0_-30px_120px_rgba(249,115,22,0.22)] sm:h-auto sm:max-h-[88vh] sm:rounded-[2rem]"
            initial={{ y: 80, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 80, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.28),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_28%)]" />

            <div className="relative z-10 flex h-12 shrink-0 items-center justify-center border-b border-white/8">
              <div className="absolute top-3 h-1 w-14 rounded-full bg-white/25" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close top up"
                className="absolute right-4 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-4">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-orange-200/80">
                  Wallet Top Up
                </p>
                <h2 className="mt-1 text-3xl font-black tracking-tight">
                  Top Up
                </h2>
                <p className="mt-1 text-xs text-orange-100/60">
                  Choose a points package to continue opening packs.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {topUpPackages.map((item) => {
                  const isSelected = item.id === selectedPackageId
                  const Icon = packageIconMap[item.icon]

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedPackageId(item.id)}
                      className={`relative min-h-[128px] rounded-2xl border p-2.5 text-center transition active:scale-95 ${
                        isSelected
                          ? 'border-orange-200 bg-orange-300/16 shadow-[0_0_32px_rgba(249,115,22,0.22)]'
                          : 'border-orange-200/28 bg-white/[0.045]'
                      }`}
                    >
                      {item.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-orange-400 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.16em] text-black">
                          Hot
                        </span>
                      )}

                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-200/20 bg-black/25">
                        <Icon className="h-5 w-5 text-orange-200" />
                      </div>

                      <p className="mt-2 text-xl font-black text-orange-300">
                        {formatPoints(item.points)}
                      </p>

                      <p className="mt-1 rounded-full border border-orange-200/18 bg-orange-200/8 px-1 py-0.5 text-[10px] font-black text-orange-100/85">
                        +{formatPoints(item.bonus)} bonus
                      </p>

                      <p className="mt-2 text-sm font-black text-white">
                        {item.price}
                      </p>
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                className="mt-3 flex w-full items-center justify-between rounded-2xl border border-orange-200/28 bg-white/[0.06] px-4 py-3 text-left"
              >
                <div>
                  <p className="text-lg font-black text-white">Custom Amount</p>
                  <p className="text-xs text-orange-100/55">min. RM10,000</p>
                </div>
                <Gem className="h-8 w-8 text-orange-300" />
              </button>

              <div className="mt-3 rounded-2xl border border-orange-200/18 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-orange-100/45">
                      Selected Package
                    </p>
                    <p className="mt-1 text-lg font-black text-white">
                      {selectedPackage.label} · {selectedPackage.price}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-100/45">
                      Receive
                    </p>
                    <p className="mt-1 text-lg font-black text-orange-200">
                      {formatPoints(totalPoints)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-emerald-300/18 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-200">
                  <CheckCircle2 className="mr-1 inline h-4 w-4" />
                  Demo top up only. Payment gateway can be connected later.
                </div>
              </div>
            </div>

            <div className="relative z-10 shrink-0 border-t border-white/8 bg-[#120906]/95 px-4 pb-[calc(14px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
              <button
                type="button"
                onClick={handleConfirm}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-300 px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-black shadow-[0_16px_38px_rgba(249,115,22,0.32)]"
              >
                <CreditCard className="h-5 w-5" />
                Select Package
              </button>

              <p className="mt-2 text-center text-[10px] text-orange-100/45">
                + RM1 processing fee shown later in real payment flow.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
