import { useState } from 'react'
import {
  ChevronRight,
  Clock3,
  Flame,
  Gift,
  HelpCircle,
  Medal,
  RefreshCw,
  Share2,
  Sparkles,
  Trophy,
  UserPlus,
  X,
} from 'lucide-react'

import type { Pack } from '../data/cardPool'
import onePieceMasterPackCover from '../assets/decks/onepiece-pack-07.png'
import { translations, type AppLanguage } from '../lib/i18n'

type MobileLukaHomePageProps = {
  language: AppLanguage
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

type LeaderboardPlayer = {
  rank: number
  name: string
  seed: string
  level: number
  score: number
  title: string
}

const rewardRows = [
  { rank: 'Top 1', reward: '15,000 pts' },
  { rank: 'Top 2', reward: '10,000 pts' },
  { rank: 'Top 3', reward: '8,000 pts' },
  { rank: 'Top 4', reward: '5,000 pts' },
  { rank: 'Top 5', reward: '3,000 pts' },
]

const leaderboardPlayers: LeaderboardPlayer[] = [
  {
    rank: 1,
    name: 'Enoch',
    seed: 'enoch crystal tcg champion',
    level: 320,
    score: 3834300,
    title: 'Crystal Champion',
  },
  {
    rank: 2,
    name: 'Ryan the Rizzler',
    seed: 'ryan rizzler aqua card hunter',
    level: 259,
    score: 3411480,
    title: 'Vault Runner',
  },
  {
    rank: 3,
    name: 'Pikazard',
    seed: 'pikazard thunder collector',
    level: 185,
    score: 1544230,
    title: 'Rare Chaser',
  },
  {
    rank: 4,
    name: 'William G',
    seed: 'william galaxy holo pack',
    level: 137,
    score: 990000,
    title: 'Foil Hunter',
  },
  {
    rank: 5,
    name: 'LuckyBurst',
    seed: 'lucky burst neon card',
    level: 118,
    score: 805415,
    title: 'Pack Grinder',
  },
  {
    rank: 6,
    name: 'SEAChaser',
    seed: 'sea chaser blue rare pull',
    level: 104,
    score: 742800,
    title: 'Auction Shark',
  },
  {
    rank: 7,
    name: 'VaultRider',
    seed: 'vault rider purple deck',
    level: 96,
    score: 628200,
    title: 'Vault Builder',
  },
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
    value: '2,495 pts',
    accent: 'from-slate-700/80 to-slate-950',
    border: 'border-white/16',
  },
  {
    tier: 'ULTRA',
    value: '6,176 pts',
    accent: 'from-cyan-500/55 to-slate-950',
    border: 'border-cyan-300/26',
  },
  {
    tier: 'MASTER',
    value: '22,157 pts',
    accent: 'from-orange-300/70 via-orange-600/45 to-slate-950',
    border: 'border-orange-300/40',
  },
]

const formatPackCost = (pack: Pack) => {
  const cost = Number(pack.price.replace(/[^0-9]/g, '')) || 0
  return cost.toLocaleString()
}

const formatScore = (score: number) => score.toLocaleString()

const avatarUrl = (seed: string, backgroundColor = '1e163f') =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
    seed,
  )}&radius=50&backgroundColor=${backgroundColor}`

function LeaderboardPodiumCard({ player }: { player: LeaderboardPlayer }) {
  const isChampion = player.rank === 1
  const ringTheme =
    player.rank === 1
      ? 'border-cyan-200/70 bg-cyan-300/15 shadow-[0_0_55px_rgba(103,232,249,0.48)]'
      : player.rank === 2
        ? 'border-violet-200/55 bg-violet-300/12 shadow-[0_0_40px_rgba(196,181,253,0.35)]'
        : 'border-amber-200/55 bg-amber-300/12 shadow-[0_0_40px_rgba(251,191,36,0.32)]'
  const bodyTheme =
    player.rank === 1
      ? 'from-cyan-300/35 via-violet-400/30 to-[#35225f] min-h-[170px] pt-14'
      : player.rank === 2
        ? 'from-violet-400/24 via-slate-600/28 to-[#2b1c2e] min-h-[132px] pt-11'
        : 'from-amber-300/22 via-slate-600/24 to-[#2c2a16] min-h-[132px] pt-11'

  return (
    <div className={`relative flex flex-col items-center ${isChampion ? 'mt-0' : 'mt-16'}`}>
      <div className="pointer-events-none absolute -top-7 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />
      <div
        className={`absolute z-20 rounded-full border-2 p-1.5 ${ringTheme} ${
          isChampion ? '-top-8 h-[104px] w-[104px]' : '-top-7 h-[82px] w-[82px]'
        }`}
      >
        <div className="absolute inset-[-10px] rounded-full border border-white/10" />
        <img
          src={avatarUrl(player.seed, player.rank === 1 ? '7dd3fc' : player.rank === 2 ? 'c4b5fd' : 'fde68a')}
          alt={player.name}
          loading="lazy"
          className="h-full w-full rounded-full object-cover"
        />
      </div>

      <div
        className={`relative w-full overflow-hidden rounded-[1.65rem] border border-white/12 bg-gradient-to-b px-2.5 pb-4 text-center shadow-[0_18px_42px_rgba(0,0,0,0.34)] ${bodyTheme}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.24),transparent_34%)]" />
        <div className="relative z-10">
          <p className="truncate text-xs font-black text-white">
            {player.name}
          </p>
          <div className="mx-auto mt-1 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/30 px-2 py-1">
            <Sparkles className="h-3 w-3 text-cyan-200" />
            <span className="text-[10px] font-black text-cyan-100">
              {player.level}
            </span>
          </div>
          <p className="mt-2 text-[11px] font-bold text-white/58">
            {player.title}
          </p>
          <p className={`mt-2 font-black text-white ${isChampion ? 'text-5xl' : 'text-4xl'}`}>
            {player.rank}
          </p>
        </div>
      </div>
    </div>
  )
}

function LeaderboardRow({ player }: { player: LeaderboardPlayer }) {
  const rowTheme =
    player.rank === 1
      ? 'border-cyan-300/30 bg-gradient-to-r from-cyan-300/22 via-violet-300/18 to-cyan-300/12'
      : player.rank === 2
        ? 'border-violet-300/25 bg-gradient-to-r from-violet-300/18 via-slate-600/16 to-violet-300/8'
        : player.rank === 3
          ? 'border-amber-300/25 bg-gradient-to-r from-amber-300/18 via-slate-600/14 to-amber-300/8'
          : 'border-white/8 bg-white/[0.045]'

  return (
    <div className={`grid grid-cols-[28px_42px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-3 py-2.5 shadow-[0_10px_26px_rgba(0,0,0,0.18)] ${rowTheme}`}>
      <p className="text-sm font-black text-white/85">{player.rank}</p>
      <img
        src={avatarUrl(player.seed, player.rank === 1 ? '7dd3fc' : player.rank === 2 ? 'c4b5fd' : player.rank === 3 ? 'fde68a' : '334155')}
        alt={player.name}
        loading="lazy"
        className="h-10 w-10 rounded-full border border-white/12 object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-white">{player.name}</p>
        <div className="mt-0.5 flex items-center gap-1 text-[10px] font-black text-cyan-100/75">
          <Sparkles className="h-3 w-3" />
          Lv.{player.level} · {player.title}
        </div>
      </div>
      <div className="flex items-center gap-1 text-sm font-black text-amber-200">
        <Flame className="h-4 w-4 fill-amber-200 text-amber-200" />
        {formatScore(player.score)}
      </div>
    </div>
  )
}

export default function MobileLukaHomePage({
  language,
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
  const t = translations[language]
  const featuredPacks = packs.slice(0, 3)
  const topThree = leaderboardPlayers.slice(0, 3)

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-8 pt-3 lg:hidden">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-2xl font-black italic tracking-[-0.04em] text-white">
            JOMLUFFYZ
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-orange-200">
            {t.treasurePackLobby}
          </p>
        </div>

        <button
          type="button"
          onClick={onSignIn}
          className="rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-sm font-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
        >
          {t.profile}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-[1.35rem] border border-orange-300/30 bg-[#1a0c08] shadow-[0_24px_70px_rgba(249,115,22,0.16)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(251,146,60,0.45),transparent_26%),radial-gradient(circle_at_20%_70%,rgba(251,191,36,0.28),transparent_30%),linear-gradient(135deg,#2a1009,#0b0d14_52%,#351407)]" />
        <div className="absolute -bottom-10 right-2 text-[7rem] opacity-20">🏆</div>
        <div className="relative z-10 p-4">
          <div className="grid grid-cols-[1fr_118px] gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-orange-200">
                {t.weeklyEvent}
              </p>
              <h2 className="mt-1 text-2xl font-black leading-[1.05] text-white">
                {t.oneWeekPackOpeningLeaderboard}
              </h2>
              <p className="mt-2 text-xs leading-5 text-orange-100/80">
                {t.pullMoreRankHigher}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-orange-200/30 bg-orange-300/10 px-3 py-2">
                <Sparkles className="h-4 w-4 text-orange-200" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-orange-100/60">
                    {t.prizePool}
                  </p>
                  <p className="text-lg font-black text-white">
                    41,000 {t.pointsShort}
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
                    {t.topRank} {row.rank.replace('Top ', '')}
                  </span>
                  <span className="text-[10px] font-black text-white">
                    {row.reward.replace(' pts', ` ${t.pointsShort}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-2">
              <p className="text-[9px] uppercase tracking-[0.18em] text-orange-100/55">
                {t.wallet}
              </p>
              <p className="mt-1 text-lg font-black text-white">
                {walletBalance}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-2">
              <p className="text-[9px] uppercase tracking-[0.18em] text-orange-100/55">
                {t.tickets}
              </p>
              <p className="mt-1 text-lg font-black text-yellow-200">
                {raffleTickets}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-2">
              <p className="text-[9px] uppercase tracking-[0.18em] text-orange-100/55">
                {t.myVault}
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
                {item.action === 'just pulled' ? t.justPulled : item.action === 'won auction' ? t.wonAuction : t.openedTenPacks} · {item.prize === 'Rare hit' ? t.rareHit : item.prize}
              </p>
            </div>
            <p className="text-[10px] font-bold text-slate-500">{item.time.replace('m ago', ` ${t.minutesAgoShort}`)}</p>
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
          <p className="mt-2 text-sm font-black text-white">{t.invite}</p>
          <p className="text-[10px] text-orange-100/65">{t.friends}</p>
          <Share2 className="absolute -right-1 -top-1 h-12 w-12 text-orange-200/10" />
        </button>

        <button
          type="button"
          onClick={onRaffles}
          className="relative overflow-hidden rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.08] p-3 text-left"
        >
          <Gift className="h-5 w-5 text-cyan-200" />
          <p className="mt-2 text-sm font-black text-white">{t.raffles}</p>
          <p className="text-[10px] text-cyan-100/65">{raffleTickets} {t.tickets.toLowerCase()}</p>
          <Sparkles className="absolute -right-1 -top-1 h-12 w-12 text-cyan-200/10" />
        </button>

        <button
          type="button"
          onClick={() => setIsLeaderboardOpen(true)}
          className="relative overflow-hidden rounded-2xl border border-purple-300/25 bg-purple-300/[0.09] p-3 text-left"
        >
          <Trophy className="h-5 w-5 text-purple-200" />
          <p className="mt-2 text-sm font-black text-white">{t.leaderboard}</p>
          <p className="text-[10px] text-purple-100/65">{t.topRewards}</p>
          <Medal className="absolute -right-1 -top-1 h-12 w-12 text-purple-200/10" />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-center text-2xl font-black uppercase tracking-[0.08em] text-white">
          {t.navPacks}
        </h2>
        <button
          type="button"
          onClick={onOpenPacks}
          className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-200"
        >
          {t.viewAll}
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
                      {t.upTo} {display.value}
                    </p>
                  </div>

                  <div className="rounded-full bg-black/35 px-2 py-1 text-[10px] font-black text-white">
                    PSA 10
                  </div>
                </div>

                <div className={`flex flex-1 items-center justify-center ${isMaster ? 'py-2' : 'py-1'}`}>
                  <img
                    src={isMaster ? onePieceMasterPackCover : pack.cover}
                    alt={isMaster ? 'One Piece Master Pack' : pack.name}
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
                    {t.pull}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {isLeaderboardOpen && (
        <div className="fixed inset-0 z-[1000000] bg-[#030712] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_20%,rgba(168,85,247,0.26),transparent_34%),radial-gradient(circle_at_20%_36%,rgba(34,211,238,0.2),transparent_28%),radial-gradient(circle_at_78%_8%,rgba(249,115,22,0.28),transparent_30%),linear-gradient(180deg,#050816,#070915_46%,#020617)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(103,232,249,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.18)_1px,transparent_1px)] [background-size:54px_54px]" />

          <div className="relative mx-auto flex h-full w-full max-w-md flex-col overflow-y-auto px-4 pb-28 pt-4 [-webkit-overflow-scrolling:touch]">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsLeaderboardOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-white shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-200">
                  {t.jomluffyzEvent}
                </p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-white">
                  {t.spendingLeaderboard}
                </h3>
              </div>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-slate-300 shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <button
                type="button"
                className="relative min-h-[64px] overflow-hidden rounded-2xl border border-orange-200/45 bg-gradient-to-br from-orange-300/22 via-orange-700/18 to-slate-950 p-2.5 text-left shadow-[0_0_28px_rgba(249,115,22,0.2)]"
              >
                <div className="absolute -right-5 -top-6 h-16 w-16 rounded-full bg-orange-300/20 blur-xl" />
                <Flame className="relative z-10 h-4 w-4 fill-orange-300 text-orange-300" />
                <p className="relative z-10 mt-1.5 text-[10px] font-black leading-3 text-white">
                  {t.weeklySpending}
                </p>
                <p className="relative z-10 mt-1 text-[8px] font-black uppercase tracking-[0.12em] text-orange-100/70">
                  {t.worth} 13K
                </p>
              </button>

              <button
                type="button"
                className="relative min-h-[64px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-2.5 text-left"
              >
                <div className="absolute -right-5 -top-6 h-16 w-16 rounded-full bg-cyan-300/10 blur-xl" />
                <Flame className="relative z-10 h-4 w-4 text-slate-400" />
                <p className="relative z-10 mt-1.5 text-[10px] font-black leading-3 text-white/78">
                  {t.weeklyBurn}
                </p>
                <p className="relative z-10 mt-1 text-[8px] font-black uppercase tracking-[0.12em] text-slate-500">
                  {t.worth} 10K
                </p>
              </button>

              <button
                type="button"
                className="relative min-h-[64px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-2.5 text-left"
              >
                <div className="absolute -right-5 -top-6 h-16 w-16 rounded-full bg-purple-300/10 blur-xl" />
                <Trophy className="relative z-10 h-4 w-4 text-slate-400" />
                <p className="relative z-10 mt-1.5 text-[10px] font-black leading-3 text-white/78">
                  {t.masterPack}
                </p>
                <p className="relative z-10 mt-1 text-[8px] font-black uppercase tracking-[0.12em] text-slate-500">
                  {t.worth} 55K
                </p>
              </button>
            </div>

            <div className="relative mt-4 rounded-[1.45rem] border border-orange-300/25 bg-[#120b0a] p-4 shadow-[0_22px_70px_rgba(249,115,22,0.18)]">
              <div className="pointer-events-none absolute inset-0 rounded-[1.45rem] bg-[radial-gradient(circle_at_72%_18%,rgba(249,115,22,0.34),transparent_30%),radial-gradient(circle_at_34%_92%,rgba(34,211,238,0.16),transparent_36%),linear-gradient(135deg,rgba(15,23,42,0.4),rgba(124,45,18,0.42),rgba(3,7,18,0.92))]" />
              <div className="pointer-events-none absolute -bottom-10 left-20 h-24 w-52 rounded-full bg-orange-500/22 blur-2xl" />
              <div className="pointer-events-none absolute bottom-3 right-4 text-[4.8rem] leading-none opacity-10">🔥</div>

              <div className="relative z-10">
                <div className="space-y-2 pr-12">
                  <p className="text-[10px] font-black uppercase leading-4 tracking-[0.24em] text-orange-100">
                    {t.topSpenders}
                  </p>
                  <p className="max-w-[300px] text-[11px] font-semibold leading-5 text-orange-100/62">
                    {t.topSpendersDesc}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur">
                    <p className="text-[8px] font-black uppercase leading-3 tracking-[0.14em] text-orange-100/55">
                      {t.totalWorth}
                    </p>
                    <p className="mt-1 text-base font-black leading-none text-white">
                      41K
                    </p>
                  </div>

                  <div className="rounded-2xl border border-orange-200/15 bg-black/24 px-3 py-2">
                    <p className="text-[8px] font-black uppercase leading-3 tracking-[0.14em] text-orange-100/55">
                      {t.endsIn}
                    </p>
                    <p className="mt-1 font-mono text-[0.9rem] font-black leading-none tracking-[0.02em] text-white">
                      22H:29M
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur">
                    <p className="text-[8px] font-black uppercase leading-3 tracking-[0.14em] text-orange-100/55">
                      {t.prize}
                    </p>
                    <p className="mt-1 text-base font-black leading-none text-orange-100">
                      55K
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-3 backdrop-blur">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-orange-100/60">
                      {t.topRewards}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/36">
                      {t.masterPack}
                    </p>
                  </div>

                  <div className="grid gap-1.5">
                    {rewardRows.map((row) => (
                      <div
                        key={`reward-${row.rank}`}
                        className="flex items-center justify-between gap-2 rounded-xl border border-white/6 bg-white/[0.035] px-2.5 py-1.5"
                      >
                        <span className="text-[9px] font-black uppercase tracking-[0.12em] text-white/72">
                          {t.topRank} {row.rank.replace('Top ', '')}
                        </span>
                        <span className="text-[10px] font-black text-orange-100">
                          {row.reward.replace(' pts', ` ${t.pointsShort}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="flex flex-1 items-center justify-center gap-10">
                <button
                  type="button"
                  className="relative px-1 pb-2 text-xs font-black text-orange-300"
                >
                  {t.currentEvent}
                  <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-orange-400 shadow-[0_0_16px_rgba(251,146,60,0.75)]" />
                </button>
                <button
                  type="button"
                  className="px-1 pb-2 text-xs font-black text-slate-500"
                >
                  {t.pastEvent}
                </button>
              </div>

              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-slate-300"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-7 grid grid-cols-3 items-end gap-2">
              <LeaderboardPodiumCard player={topThree[1]} />
              <LeaderboardPodiumCard player={topThree[0]} />
              <LeaderboardPodiumCard player={topThree[2]} />
            </div>

            <div className="mt-5 space-y-2.5">
              {leaderboardPlayers.map((player) => (
                <LeaderboardRow key={`${player.rank}-${player.name}`} player={player} />
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-300/16 bg-cyan-300/[0.055] p-4 text-center">
              <Clock3 className="mx-auto h-5 w-5 text-cyan-200" />
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-300">
                {t.leaderboardDemoNotice}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
