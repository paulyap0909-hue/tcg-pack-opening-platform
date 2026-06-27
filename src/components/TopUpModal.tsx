import { AnimatePresence, motion } from 'framer-motion'
import { X, Wallet, Sparkles, Zap, Crown, ShieldCheck } from 'lucide-react'
import { useEffect } from 'react'

type TopUpPackage = {
  name: string
  price: string
  points: number
  bonus: number
  tag: string
  highlight?: boolean
  icon: 'starter' | 'popular' | 'best'
}

type TopUpModalProps = {
  isOpen: boolean
  onClose: () => void
  onTopUp: (points: number) => void
}

const topUpPackages: TopUpPackage[] = [
  {
    name: 'Starter',
    price: 'RM25',
    points: 500,
    bonus: 0,
    tag: 'Quick reload',
    icon: 'starter',
  },
  {
    name: 'Most Popular',
    price: 'RM60',
    points: 1200,
    bonus: 100,
    tag: 'Best for Open 10',
    highlight: true,
    icon: 'popular',
  },
  {
    name: 'Best Value',
    price: 'RM138',
    points: 2800,
    bonus: 300,
    tag: 'High chase mode',
    icon: 'best',
  },
]

function getPackageIcon(icon: TopUpPackage['icon']) {
  if (icon === 'popular') return <Zap className="h-6 w-6 text-amber-300" />
  if (icon === 'best') return <Crown className="h-6 w-6 text-purple-300" />
  return <Wallet className="h-6 w-6 text-cyan-300" />
}

export default function TopUpModal({
  isOpen,
  onClose,
  onTopUp,
}: TopUpModalProps) {
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

  const handleSelectPackage = (topUpPackage: TopUpPackage) => {
    const totalPoints = topUpPackage.points + topUpPackage.bonus

    onTopUp(totalPoints)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999999] flex items-center justify-center overflow-y-auto bg-black/85 px-4 py-8 text-white backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_36%)]"
            onClick={onClose}
          />

          <motion.div
            className="relative z-[1000000] w-full max-w-5xl rounded-[2rem] border border-cyan-300/25 bg-[#050914] p-5 shadow-[0_0_80px_rgba(34,211,238,0.28)] sm:p-7"
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close top up modal"
              className="absolute right-5 top-5 z-[1000001] flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-950 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition hover:scale-105 hover:bg-cyan-300/10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="pr-14">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
                Wallet Top Up
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Add Points
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Choose a points package to continue opening packs. This is a mock
                wallet flow for the MVP version.
              </p>
            </div>

            <div className="mt-7 grid items-stretch gap-5 md:grid-cols-3">
              {topUpPackages.map((topUpPackage) => {
                const totalPoints = topUpPackage.points + topUpPackage.bonus

                return (
                  <button
                    key={topUpPackage.name}
                    type="button"
                    onClick={() => handleSelectPackage(topUpPackage)}
                    className={`group flex h-full min-h-[420px] flex-col rounded-[2rem] border p-5 text-left transition hover:-translate-y-1 hover:scale-[1.01] ${
                      topUpPackage.highlight
                        ? 'border-amber-300/45 bg-amber-300/[0.08] shadow-[0_0_45px_rgba(251,191,36,0.16)]'
                        : 'border-cyan-300/15 bg-cyan-300/[0.04] hover:border-cyan-300/35 hover:bg-cyan-300/[0.07]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-black/45">
                        {getPackageIcon(topUpPackage.icon)}
                      </div>

                      {topUpPackage.highlight && (
                        <span className="rounded-full border border-amber-300/30 bg-amber-300/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-amber-200">
                          Popular
                        </span>
                      )}
                    </div>

                    <div className="mt-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                        {topUpPackage.tag}
                      </p>

                      <h3 className="mt-2 text-2xl font-black text-white">
                        {topUpPackage.name}
                      </h3>

                      <p className="mt-4 text-4xl font-black text-cyan-200">
                        {topUpPackage.price}
                      </p>
                    </div>

                    <div className="mt-5 flex min-h-[168px] flex-col justify-between rounded-2xl border border-cyan-300/10 bg-black/35 p-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                          Receive
                        </p>

                        <p className="mt-2 text-3xl font-black text-white">
                          {topUpPackage.points.toLocaleString()}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          base points
                        </p>
                      </div>

                      {topUpPackage.bonus > 0 ? (
                        <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-black text-emerald-300">
                          +{topUpPackage.bonus.toLocaleString()} Bonus Points
                        </div>
                      ) : (
                        <div className="mt-4 rounded-xl border border-slate-500/20 bg-slate-500/10 px-3 py-2 text-sm font-black text-slate-400">
                          No Bonus
                        </div>
                      )}
                    </div>

                    <div className="mt-5 rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                        Total
                      </p>

                      <p className="mt-2 text-2xl font-black text-purple-200">
                        {totalPoints.toLocaleString()} Points
                      </p>
                    </div>

                    <div
                      className={`mt-auto flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-wider transition ${
                        topUpPackage.highlight
                          ? 'bg-gradient-to-r from-amber-300 to-red-500 text-black group-hover:shadow-[0_0_35px_rgba(251,191,36,0.3)]'
                          : 'bg-gradient-to-r from-cyan-300 to-blue-500 text-black group-hover:shadow-[0_0_35px_rgba(34,211,238,0.3)]'
                      }`}
                    >
                      <Sparkles className="h-4 w-4" />
                      Select Package
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-5">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                  MVP Notice
                </p>
              </div>

              <p className="text-sm leading-6 text-slate-400">
                This top up modal is currently simulated. Later, it can connect to
                Stripe, ToyyibPay, Billplz, FPX, or another payment gateway.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}