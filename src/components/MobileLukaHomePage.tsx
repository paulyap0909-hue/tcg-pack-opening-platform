import { useState } from 'react'
import {
  ChevronRight,
  Flame,
  Gift,
  Medal,
  Share2,
  Sparkles,
  Trophy,
  UserPlus,
  X,
} from 'lucide-react'

import type { Pack } from '../data/cardPool'

type MobileLukaHomePageProps = {
  packs: Pack[]
  walletBalance: number
  raffleTickets: number
  vaultCount: number
  onOpenPack: (pack: Pack) => void
  onOpenPacks: () => void
  onRaffles: () => void
  onInvite: () => void
  onSignIn: () => void
}

const rewardRows = [
  { rank: 'Top 1', reward: '15,000 pts' },
  { rank: 'Top 2', reward: '10,000 pts' },
  { rank: 'Top 3', reward: '8,000 pts' },
  { rank: 'Top 4', reward: '5,000 pts' },
  { rank: 'Top 5', reward: '3,000 pts' },
]

const liveTicker = [
  {
    user: 'dark viper420',
    action: 'just pulled',
    prize: 'Charizard ex',
    time: '5m ago',
    seed: 'darkviper420',
  },
  {
    user: 'KaiTanVault',
    action: 'won auction',
    prize: 'Pikachu VMAX',
    time: '8m ago',
    seed: 'kaitanhub',
  },
  {
    user: 'SEAChaser',
    action: 'opened 10 packs',
    prize: 'Rare hit',
    time: '12m ago',
    seed: 'seachaser',
  },
]

const packDisplay = [
  {
    tier: 'GREAT',
    value: 'Up to 2,495 pts',
    accent: 'from-slate-700/80 to-slate-950',
    border: 'border-white/16',
  },
  {
    tier: 'ULTRA',
    value: 'Up to 6,176 pts',
    accent: 'from-cyan-500/55 to-slate-950',
    border: 'border-cyan-300/26',
  },
  {
    tier: 'MASTER',
    value: 'Up to 22,157 pts',
    accent: 'from-orange-300/70 via-orange-600/45 to-slate-950',
    border: 'border-orange-300/40',
  },
]

const formatPackCost = (pack: Pack) => {
  const cost = Number(pack.price.replace(/[^0-9]/g, '')) || 0
  return cost.toLocaleString()
}

export default function MobileLukaHomePage({
  packs,
  walletBalance,
  raffleTickets,
  vaultCount,
  onOpenPack,
  onOpenPacks,
  onRaffles,
  onInvite,
  onSignIn,
}: MobileLukaHomePageProps) {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const featuredPacks = packs.slice(0, 3)

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-8 pt-3 lg:hidden">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-2xl font-black italic tracking-[-0.04em] text-white">
            JOMLUFFYZ
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-orange-200">
            Treasure Pack Lobby
          </p>
        </div>

        <button
          type="button"
          onClick={onSignIn}
          className="rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-sm font-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
        >
          Profile
        </button>
      </div>

      <div className="relative overflow-hidden rounded-[1.35rem] border border-orange-300/30 bg-[#1a0c08] shadow-[0_24px_70px_rgba(249,115,22,0.16)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(251,146,60,0.45),transparent_26%),radial-gradient(circle_at_20%_70%,rgba(251,191,36,0.28),transparent_30%),linear-gradient(135deg,#2a1009,#0b0d14_52%,#351407)]" />
        <div className="absolute -bottom-10 right-2 text-[7rem] opacity-20">🏆</div>
        <div className="relative z-10 p-4">
          <div className="grid grid-cols-[1fr_118px] gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-orange-200">
                Weekly Event
              </p>
              <h2 className="mt-1 text-2xl font-black leading-[1.05] text-white">
                1 Week Pack Opening Leaderboard
              </h2>
              <p className="mt-2 text-xs leading-5 text-orange-100/80">
                Pull more, rank higher, unlock the legend.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-orange-200/30 bg-orange-300/10 px-3 py-2">
                <Sparkles className="h-4 w-4 text-orange-200" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-orange-100/60">
                    Prize Pool
                  </p>
                  <p className="text-lg font-black text-white">
                    41,000 pts
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-200/20 bg-black/30 p-3 backdrop-blur">
              {rewardRows.map((row) => (
                <div
                  key={row.rank}
                  className="flex items-center justify-between gap-2 border-b border-white/8 py-1.5 last:border-b-0"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-orange-100/75">
                    {row.rank}
                  </span>
                  <span className="text-[10px] font-black text-white">
                    {row.reward}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-2">
              <p className="text-[9px] uppercase tracking-[0.18em] text-orange-100/55">
                Wallet
              </p>
              <p className="mt-1 text-lg font-black text-white">
                {walletBalance}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-2">
              <p className="text-[9px] uppercase tracking-[0.18em] text-orange-100/55">
                Tickets
              </p>
              <p className="mt-1 text-lg font-black text-yellow-200">
                {raffleTickets}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-2">
              <p className="text-[9px] uppercase tracking-[0.18em] text-orange-100/55">
                Vault
              </p>
              <p className="mt-1 text-lg font-black text-cyan-200">
                {vaultCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [-webkit-overflow-scrolling:touch]">
        {liveTicker.map((item) => (
          <div
            key={`${item.user}-${item.prize}`}
            className="flex min-w-[235px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-2.5"
          >
            <img
              src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${item.seed}&radius=50&backgroundColor=f97316`}
              alt={item.user}
              loading="lazy"
              className="h-9 w-9 rounded-full"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black text-white">
                {item.user}
              </p>
              <p className="truncate text-[11px] text-slate-400">
                {item.action} · {item.prize}
              </p>
            </div>
            <p className="text-[10px] font-bold text-slate-500">{item.time}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onInvite}
          className="relative overflow-hidden rounded-2xl border border-orange-300/25 bg-orange-300/[0.09] p-3 text-left"
        >
          <UserPlus className="h-5 w-5 text-orange-200" />
          <p className="mt-2 text-sm font-black text-white">Invite</p>
          <p className="text-[10px] text-orange-100/65">Friends</p>
          <Share2 className="absolute -right-1 -top-1 h-12 w-12 text-orange-200/10" />
        </button>

        <button
          type="button"
          onClick={onRaffles}
          className="relative overflow-hidden rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.08] p-3 text-left"
        >
          <Gift className="h-5 w-5 text-cyan-200" />
          <p className="mt-2 text-sm font-black text-white">Raffles</p>
          <p className="text-[10px] text-cyan-100/65">{raffleTickets} tickets</p>
          <Sparkles className="absolute -right-1 -top-1 h-12 w-12 text-cyan-200/10" />
        </button>

        <button
          type="button"
          onClick={() => setIsLeaderboardOpen(true)}
          className="relative overflow-hidden rounded-2xl border border-purple-300/25 bg-purple-300/[0.09] p-3 text-left"
        >
          <Trophy className="h-5 w-5 text-purple-200" />
          <p className="mt-2 text-sm font-black text-white">Leaderboard</p>
          <p className="text-[10px] text-purple-100/65">Top rewards</p>
          <Medal className="absolute -right-1 -top-1 h-12 w-12 text-purple-200/10" />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-center text-2xl font-black uppercase tracking-[0.08em] text-white">
          Packs
        </h2>
        <button
          type="button"
          onClick={onOpenPacks}
          className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-200"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {featuredPacks.map((pack, index) => {
          const display = packDisplay[index] ?? packDisplay[0]
          const isMaster = index === 2

          return (
            <button
              key={pack.name}
              type="button"
              onClick={() => onOpenPack(pack)}
              className={`relative overflow-hidden rounded-[1.3rem] border ${display.border} bg-gradient-to-br ${display.accent} p-3 text-left shadow-[0_18px_50px_rgba(0,0,0,0.25)] ${
                isMaster ? 'col-span-2 min-h-[210px]' : 'min-h-[156px]'
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.16),transparent_28%)]" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-lg font-black uppercase tracking-[-0.03em] text-white">
                        {display.tier}
                      </p>
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/35 text-[10px] font-black text-white/80">
                        i
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-white/65">
                      {display.value}
                    </p>
                  </div>

                  <div className="rounded-full bg-black/35 px-2 py-1 text-[10px] font-black text-white">
                    PSA 10
                  </div>
                </div>

                <div className={`flex flex-1 items-center justify-center ${isMaster ? 'py-2' : 'py-1'}`}>
                  <img
                    src={pack.cover}
                    alt={pack.name}
                    loading="lazy"
                    className={`${isMaster ? 'max-h-[128px]' : 'max-h-[84px]'} w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.42)]`}
                  />
                </div>

                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-lg font-black text-orange-100">
                    <Flame className="h-4 w-4 fill-orange-300 text-orange-300" />
                    {formatPackCost(pack)}
                  </div>

                  <span className="rounded-full border border-white/35 bg-black/30 px-4 py-1.5 text-xs font-black uppercase text-white">
                    Pull
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {isLeaderboardOpen && (
        <div className="fixed inset-0 z-[1000000] flex items-end bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full rounded-[1.6rem] border border-orange-300/25 bg-[#170b07] p-4 shadow-[0_-20px_80px_rgba(249,115,22,0.22)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-orange-200">
                  Weekly Leaderboard
                </p>
                <h3 className="mt-1 text-2xl font-black text-white">
                  Opening Race Rewards
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLeaderboardOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="space-y-2">
              {rewardRows.map((row, index) => (
                <div
                  key={`modal-${row.rank}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-300/12 text-sm font-black text-orange-200">
                      #{index + 1}
                    </div>
                    <p className="font-black text-white">{row.rank}</p>
                  </div>
                  <p className="font-black text-orange-200">{row.reward}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
