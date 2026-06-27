import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Flame, Gift, Sparkles, Ticket, X, Zap } from 'lucide-react'
import { useEffect } from 'react'

import {
  dailyLoginRewards,
  getDailyRewardForStreak,
  hasClaimedDailyRewardToday,
  type DailyLoginState,
} from '../data/dailyLoginRewards'

type DailyLoginRewardModalProps = {
  isOpen: boolean
  dailyLoginState: DailyLoginState
  onClose: () => void
  onClaim: () => void
}

function getRewardIcon(kind: string) {
  if (kind === 'gem') return Sparkles
  if (kind === 'bonus') return Zap
  if (kind === 'free-pull') return Flame

  return Gift
}

export default function DailyLoginRewardModal({
  isOpen,
  dailyLoginState,
  onClose,
  onClaim,
}: DailyLoginRewardModalProps) {
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

  const claimedToday = hasClaimedDailyRewardToday(dailyLoginState)
  const currentReward = getDailyRewardForStreak(dailyLoginState.streakDay)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000000] flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-8 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose()
            }
          }}
        >
          <motion.div
            className="relative w-full max-w-[430px] overflow-visible rounded-[2rem] border border-orange-300/40 bg-gradient-to-b from-[#2c1208] via-[#431609] to-[#f05a2b] p-[1px] shadow-[0_0_80px_rgba(249,115,22,0.35)]"
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute -top-16 left-1/2 flex -translate-x-1/2 gap-2">
              <motion.div
                className="h-16 w-14 rotate-[-18deg] rounded-[1rem] bg-gradient-to-br from-yellow-200 via-orange-400 to-red-600 shadow-[0_0_35px_rgba(251,146,60,0.8)]"
                animate={{ y: [0, -8, 0], rotate: [-18, -12, -18] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="h-20 w-16 rounded-[1rem] bg-gradient-to-br from-yellow-100 via-orange-300 to-red-500 shadow-[0_0_45px_rgba(251,146,60,0.95)]"
                animate={{ y: [0, -10, 0], rotate: [0, 7, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="h-14 w-12 rotate-[18deg] rounded-[1rem] bg-gradient-to-br from-yellow-200 via-orange-400 to-red-600 shadow-[0_0_35px_rgba(251,146,60,0.8)]"
                animate={{ y: [0, -7, 0], rotate: [18, 12, 18] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#230b05] via-[#341007] to-[#ea5128] p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,146,60,0.26),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.18),transparent_45%)]" />

              <button
                type="button"
                onClick={onClose}
                aria-label="Close daily login rewards"
                className="absolute right-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-black/55 text-white shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:scale-105 hover:bg-white/15"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative z-10 pt-8 text-center">
                <p className="text-xs font-black uppercase tracking-[0.35em] text-orange-200">
                  Daily Login Rewards
                </p>
                <h2 className="mt-2 text-3xl font-black text-white">
                  Day {currentReward.day} Reward
                </h2>
                <p className="mt-2 text-sm text-orange-100/80">
                  Claim once per day. Streak loops after Day 7.
                </p>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {dailyLoginRewards.slice(0, 6).map((reward) => {
                    const Icon = getRewardIcon(reward.kind)
                    const isCurrent = reward.day === currentReward.day && !claimedToday
                    const isClaimed = claimedToday && reward.day === currentReward.day

                    return (
                      <div
                        key={reward.day}
                        className={`relative min-h-[108px] rounded-xl border p-3 text-center ${
                          isCurrent
                            ? 'border-orange-200 bg-white/12 shadow-[0_0_24px_rgba(251,146,60,0.22)]'
                            : 'border-white/10 bg-black/28'
                        }`}
                      >
                        {isClaimed && (
                          <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-emerald-300" />
                        )}
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
                          Day {reward.day}
                        </p>
                        <Icon className="mx-auto mt-3 h-7 w-7 text-orange-200" />
                        <p className="mt-2 text-xs font-black text-white">
                          {reward.title}
                        </p>
                        <p className="mt-1 text-[10px] leading-4 text-orange-100/70">
                          {reward.subtitle}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-2 rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-200/80">
                        Day 7 Bonus
                      </p>
                      <p className="mt-1 text-xl font-black text-white">
                        Free Pull Reward
                      </p>
                      <p className="text-xs text-orange-100/70">
                        350 pts + 10 raffle tickets + 150 XP
                      </p>
                    </div>
                    <div className="flex h-16 w-14 items-center justify-center rounded-xl border border-orange-200/30 bg-orange-300/10">
                      <Flame className="h-8 w-8 text-orange-200" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Points</p>
                    <p className="mt-1 text-lg font-black text-white">+{currentReward.points}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">XP</p>
                    <p className="mt-1 text-lg font-black text-purple-100">+{currentReward.xp}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Tickets</p>
                    <p className="mt-1 flex items-center justify-center gap-1 text-lg font-black text-amber-100 sm:justify-start">
                      <Ticket className="h-4 w-4" /> +{currentReward.raffleTickets}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={claimedToday}
                  onClick={onClaim}
                  className={`mt-5 w-full rounded-full px-6 py-4 text-base font-black uppercase tracking-wider shadow-[inset_0_2px_8px_rgba(255,255,255,0.25)] transition ${
                    claimedToday
                      ? 'cursor-not-allowed border border-white/15 bg-black/30 text-white/45'
                      : 'border border-orange-200/50 bg-gradient-to-r from-orange-500 to-orange-300 text-white hover:scale-[1.02]'
                  }`}
                >
                  {claimedToday ? 'Claimed Today' : `Claim Day ${currentReward.day} Reward`}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full rounded-full border border-white/15 bg-black/25 px-6 py-3 text-sm font-black uppercase tracking-wider text-orange-100 transition hover:scale-[1.01] hover:bg-white/10"
                >
                  Close Rewards
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
