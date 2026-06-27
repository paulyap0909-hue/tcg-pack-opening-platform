import {
  CheckCircle2,
  Gift,
  PackageOpen,
  Target,
  Ticket,
  Trophy,
  Wallet,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import {
  hasClaimedDailyRewardToday,
  type DailyLoginState,
} from '../data/dailyLoginRewards'
import type {
  QuestReward,
  QuestStats,
} from './QuestLeaderboardPanel'

type CompactQuest = {
  id: string
  title: string
  current: number
  target: number
  reward: QuestReward
  icon: LucideIcon
  accent: string
}

type MobileHomeProgressPanelProps = {
  questStats: QuestStats
  walletBalance: number
  raffleTickets: number
  dailyLoginState?: DailyLoginState
  onClaimQuest: (questId: string, reward: QuestReward) => void
  onOpenDailyLogin: () => void
  onOpenPacks: () => void
  onOpenAuction: () => void
}

const compactQuests = (questStats: QuestStats): CompactQuest[] => [
  {
    id: 'open-1-pack',
    title: 'Open 1 Pack',
    current: questStats.open1,
    target: 1,
    reward: { points: 50, xp: 25 },
    icon: Target,
    accent: 'cyan',
  },
  {
    id: 'open-10-total-packs',
    title: 'Open 10 Packs',
    current: questStats.openPacks,
    target: 10,
    reward: { points: 120, xp: 80 },
    icon: Zap,
    accent: 'amber',
  },
  {
    id: 'sell-back-1-card',
    title: 'Sell Back',
    current: questStats.sellBack,
    target: 1,
    reward: { points: 75, xp: 60 },
    icon: Gift,
    accent: 'emerald',
  },
  {
    id: 'top-up-wallet',
    title: 'Top Up',
    current: questStats.topUp,
    target: 1,
    reward: { points: 100, xp: 40 },
    icon: Wallet,
    accent: 'purple',
  },
  {
    id: 'request-shipping-1-card',
    title: 'Shipping',
    current: questStats.shipping,
    target: 1,
    reward: { points: 0, xp: 150 },
    icon: PackageOpen,
    accent: 'pink',
  },
  {
    id: 'open-100-burst',
    title: 'Open 100',
    current: questStats.open100,
    target: 1,
    reward: { points: 500, xp: 300 },
    icon: Trophy,
    accent: 'blue',
  },
]

const accentClasses: Record<string, string> = {
  cyan: 'border-cyan-300/25 bg-cyan-300/[0.08] text-cyan-300',
  amber: 'border-amber-300/25 bg-amber-300/[0.08] text-amber-300',
  emerald: 'border-emerald-300/25 bg-emerald-300/[0.08] text-emerald-300',
  purple: 'border-purple-300/25 bg-purple-300/[0.08] text-purple-300',
  pink: 'border-pink-300/25 bg-pink-300/[0.08] text-pink-300',
  blue: 'border-blue-300/25 bg-blue-300/[0.08] text-blue-300',
}

const clampProgress = (current: number, target: number) => {
  return Math.min(Math.max(current, 0), target)
}

export default function MobileHomeProgressPanel({
  questStats,
  walletBalance,
  raffleTickets,
  dailyLoginState,
  onClaimQuest,
  onOpenDailyLogin,
  onOpenPacks,
  onOpenAuction,
}: MobileHomeProgressPanelProps) {
  const quests = compactQuests(questStats)
  const level = Math.floor(questStats.xp / 500)
  const xpIntoLevel = questStats.xp % 500
  const xpTarget = 500
  const xpPercent = Math.round((xpIntoLevel / xpTarget) * 100)
  const claimedCount = questStats.claimedQuestIds.length
  const completedCount = quests.filter((quest) => quest.current >= quest.target).length
  const claimedToday = dailyLoginState
    ? hasClaimedDailyRewardToday(dailyLoginState)
    : false

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-8 lg:hidden">
      <div className="rounded-[1.5rem] border border-cyan-300/16 bg-[#061120]/94 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">
              Player Hub
            </p>
            <h2 className="mt-1 text-xl font-black text-white">
              Level & Daily Quest
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenDailyLogin}
            className={`shrink-0 rounded-2xl border px-3 py-2 text-xs font-black ${
              claimedToday
                ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200'
                : 'border-orange-300/25 bg-orange-300/10 text-orange-200'
            }`}
          >
            {claimedToday ? 'Claimed' : 'Daily Login'}
          </button>
        </div>

        <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.045] p-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                Player Level
              </p>
              <div className="mt-1 flex items-end gap-2">
                <p className="text-4xl font-black leading-none text-white">
                  LV {level}
                </p>
                <p className="pb-1 text-xs font-black text-orange-200">
                  🔥 {xpTarget - xpIntoLevel} XP left
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-300/14 bg-cyan-300/[0.06] px-3 py-2 text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Done
              </p>
              <p className="text-lg font-black text-emerald-200">
                {claimedCount}/6
              </p>
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              <span>{xpIntoLevel} XP</span>
              <span>{xpTarget} XP</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-cyan-300 to-purple-400"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-white/8 bg-black/20 p-2">
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                Wallet
              </p>
              <p className="mt-1 text-lg font-black text-white">
                {walletBalance.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-2">
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                Tickets
              </p>
              <p className="mt-1 text-lg font-black text-amber-200">
                {raffleTickets}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-2">
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                Quest
              </p>
              <p className="mt-1 text-lg font-black text-cyan-200">
                {completedCount}/{quests.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenPacks}
            className="rounded-2xl border border-cyan-300/16 bg-cyan-300/[0.06] p-3 text-left"
          >
            <PackageOpen className="h-5 w-5 text-cyan-300" />
            <p className="mt-2 text-sm font-black text-white">Open Packs</p>
            <p className="mt-0.5 text-[11px] text-slate-500">Complete open quests</p>
          </button>

          <button
            type="button"
            onClick={onOpenAuction}
            className="rounded-2xl border border-amber-300/16 bg-amber-300/[0.06] p-3 text-left"
          >
            <Ticket className="h-5 w-5 text-amber-300" />
            <p className="mt-2 text-sm font-black text-white">Auction Bid</p>
            <p className="mt-0.5 text-[11px] text-slate-500">Use points to bid</p>
          </button>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
                Daily Quest
              </p>
              <p className="text-xs text-slate-500">
                Swipe to view all missions
              </p>
            </div>
            <p className="text-xs font-black text-emerald-200">
              {completedCount}/{quests.length}
            </p>
          </div>

          <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 [-webkit-overflow-scrolling:touch]">
            {quests.map((quest) => {
              const progress = clampProgress(quest.current, quest.target)
              const progressPercent = Math.round((progress / quest.target) * 100)
              const isCompleted = quest.current >= quest.target
              const isClaimed = questStats.claimedQuestIds.includes(quest.id)
              const canClaim = isCompleted && !isClaimed
              const Icon = quest.icon

              return (
                <div
                  key={quest.id}
                  className="w-[190px] shrink-0 snap-start rounded-2xl border border-white/10 bg-white/[0.035] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      accentClasses[quest.accent]
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    {isClaimed && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    )}
                  </div>

                  <p className="mt-2 line-clamp-1 text-sm font-black text-white">
                    {quest.title}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-black text-slate-400">
                    <span>Progress</span>
                    <span className="text-slate-200">
                      {progress}/{quest.target}
                    </span>
                  </div>

                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-purple-400"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-[11px] font-black text-amber-200">
                      {quest.reward.points} pts
                      <span className="text-purple-200"> + {quest.reward.xp} XP</span>
                    </p>

                    <button
                      type="button"
                      disabled={!canClaim}
                      onClick={() => onClaimQuest(quest.id, quest.reward)}
                      className={`rounded-xl px-3 py-1.5 text-[11px] font-black ${
                        canClaim
                          ? 'bg-amber-300 text-black'
                          : isClaimed
                            ? 'bg-emerald-300/10 text-emerald-200'
                            : 'bg-white/[0.06] text-slate-500'
                      }`}
                    >
                      {isClaimed ? 'Done' : canClaim ? 'Claim' : 'Locked'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
