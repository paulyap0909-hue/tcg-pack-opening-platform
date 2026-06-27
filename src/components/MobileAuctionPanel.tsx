import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Clock3,
  Filter,
  Gavel,
  Heart,
  Search,
  Share2,
  SlidersHorizontal,
  Trophy,
} from 'lucide-react'

import { pokemonRealCardPool } from '../data/cardPool'
import { audioManager } from '../lib/audioManager'

type MobileAuctionPanelProps = {
  walletBalance: number
  onBid: (cost: number, auctionName: string, nextBid: number) => boolean
  onNeedTopUp: () => void
}

type MobileAuctionItem = {
  id: string
  title: string
  image: string
  seller: string
  currentBid: number
  shippingFee: number
  endsIn: string
  bidCount: number
  status: 'Live' | 'Ending' | 'Ended'
  category: 'General' | 'Premier'
  country: string
  followers: number
  sold: number
  review: string
}

const getCard = (keyword: string, fallbackIndex: number) => {
  return (
    pokemonRealCardPool.find((card) =>
      card.name.toLowerCase().includes(keyword.toLowerCase()),
    ) ?? pokemonRealCardPool[fallbackIndex]
  )
}

const auctionCards: MobileAuctionItem[] = [
  {
    id: 'auction-mobile-charizard',
    title: 'Charizard ex Special Illustration Rare',
    image: getCard('charizard ex', 0).image,
    seller: 'MATTHEWSIEW',
    currentBid: 1880,
    shippingFee: 20,
    endsIn: '02m 00s',
    bidCount: 3,
    status: 'Live',
    category: 'Premier',
    country: 'Malaysia',
    followers: 53,
    sold: 76,
    review: '95.2%',
  },
  {
    id: 'auction-mobile-luffy',
    title: 'OP-05 Awakening of the New Era Monkey D. Luffy',
    image: getCard('mew', 8).image,
    seller: 'speed',
    currentBid: 28.88,
    shippingFee: 20,
    endsIn: '01m 55s',
    bidCount: 0,
    status: 'Ending',
    category: 'General',
    country: 'Malaysia',
    followers: 23,
    sold: 76,
    review: '95.2%',
  },
  {
    id: 'auction-mobile-pikachu',
    title: 'Pikachu VMAX Rare Rainbow',
    image: getCard('pikachu vmax', 4).image,
    seller: 'KaiTanVault',
    currentBid: 980,
    shippingFee: 15,
    endsIn: '04m 57s',
    bidCount: 6,
    status: 'Live',
    category: 'Premier',
    country: 'Singapore',
    followers: 168,
    sold: 231,
    review: '98.1%',
  },
  {
    id: 'auction-mobile-arceus',
    title: 'Arceus VSTAR Gallery Style',
    image: getCard('arceus', 10).image,
    seller: 'SEAChaser',
    currentBid: 620,
    shippingFee: 18,
    endsIn: '07m 42s',
    bidCount: 2,
    status: 'Live',
    category: 'General',
    country: 'Malaysia',
    followers: 89,
    sold: 124,
    review: '96.8%',
  },
  {
    id: 'auction-mobile-mewtwo',
    title: 'Crown Zenith Mewtwo VSTAR English',
    image: getCard('mewtwo', 7).image,
    seller: 'Vinson90',
    currentBid: 1250,
    shippingFee: 20,
    endsIn: '12m 18s',
    bidCount: 5,
    status: 'Live',
    category: 'Premier',
    country: 'Malaysia',
    followers: 41,
    sold: 88,
    review: '94.9%',
  },
  {
    id: 'auction-mobile-venusaur',
    title: 'Venusaur Holo Vaulted Drop',
    image: getCard('venusaur', 2).image,
    seller: 'JomCollector',
    currentBid: 430,
    shippingFee: 12,
    endsIn: 'Ended',
    bidCount: 11,
    status: 'Ended',
    category: 'General',
    country: 'Malaysia',
    followers: 71,
    sold: 102,
    review: '97.0%',
  },
]

const formatMoney = (value: number) => {
  if (value < 100) return `MYR ${value.toFixed(2)}`
  return `MYR ${value.toLocaleString()}`
}

const parseAuctionSeconds = (endsIn: string) => {
  if (endsIn.toLowerCase() === 'ended') return 0

  const hourMatch = endsIn.match(/(\d+)h/i)
  const minuteMatch = endsIn.match(/(\d+)m/i)
  const secondMatch = endsIn.match(/(\d+)s/i)

  const hours = hourMatch ? Number(hourMatch[1]) : 0
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0
  const seconds = secondMatch ? Number(secondMatch[1]) : 0

  return hours * 3600 + minutes * 60 + seconds
}

const padTime = (value: number) => value.toString().padStart(2, '0')

const formatAuctionCountdown = (secondsLeft: number) => {
  if (secondsLeft <= 0) return 'Auction Ended'

  const hours = Math.floor(secondsLeft / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60

  if (hours > 0) return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`

  return `${padTime(minutes)}:${padTime(seconds)}`
}

const getCountdownStatus = (secondsLeft: number): MobileAuctionItem['status'] => {
  if (secondsLeft <= 0) return 'Ended'
  if (secondsLeft <= 120) return 'Ending'
  return 'Live'
}

const getCountdownBadgeClass = (secondsLeft: number) => {
  if (secondsLeft <= 0) {
    return 'border-slate-600/40 bg-slate-900/85 text-slate-400'
  }

  if (secondsLeft <= 30) {
    return 'animate-pulse border-red-400/60 bg-red-500/20 text-red-100 shadow-[0_0_18px_rgba(248,113,113,0.35)]'
  }

  if (secondsLeft <= 60) {
    return 'border-orange-300/60 bg-orange-500/20 text-orange-100 shadow-[0_0_18px_rgba(251,146,60,0.25)]'
  }

  return 'border-yellow-300/35 bg-black/75 text-yellow-200 shadow-[0_0_16px_rgba(250,204,21,0.20)]'
}

const getCountdownTextClass = (secondsLeft: number) => {
  if (secondsLeft <= 0) return 'text-slate-500'
  if (secondsLeft <= 30) return 'animate-pulse text-red-300'
  if (secondsLeft <= 60) return 'text-orange-300'
  return 'text-yellow-300'
}

const getCountdownProgressClass = (secondsLeft: number) => {
  if (secondsLeft <= 0) return 'bg-slate-700'
  if (secondsLeft <= 30) return 'bg-red-400 shadow-[0_0_16px_rgba(248,113,113,0.55)]'
  if (secondsLeft <= 60) return 'bg-orange-400 shadow-[0_0_16px_rgba(251,146,60,0.45)]'
  return 'bg-yellow-300 shadow-[0_0_16px_rgba(250,204,21,0.45)]'
}

export default function MobileAuctionPanel({
  walletBalance,
  onBid,
  onNeedTopUp,
}: MobileAuctionPanelProps) {
  const [selectedTab, setSelectedTab] = useState<'General' | 'Premier'>('General')
  const [selectedItem, setSelectedItem] = useState<MobileAuctionItem | null>(null)
  const [bidStep, setBidStep] = useState(50)
  const [auctionStartAt] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(countdown)
  }, [])

  const getInitialSeconds = (item: MobileAuctionItem) => {
    return Math.max(parseAuctionSeconds(item.endsIn), 1)
  }

  const getTimeLeftSeconds = (item: MobileAuctionItem) => {
    if (item.status === 'Ended') return 0

    const endsAt = auctionStartAt + getInitialSeconds(item) * 1000
    return Math.max(0, Math.ceil((endsAt - now) / 1000))
  }

  const selectedTimeLeftSeconds = selectedItem ? getTimeLeftSeconds(selectedItem) : 0
  const selectedCountdownStatus = getCountdownStatus(selectedTimeLeftSeconds)
  const selectedInitialSeconds = selectedItem ? getInitialSeconds(selectedItem) : 1
  const selectedProgress = Math.max(0, Math.min(100, (selectedTimeLeftSeconds / selectedInitialSeconds) * 100))

  const visibleCards = useMemo(() => {
    return auctionCards.filter((item) => item.category === selectedTab)
  }, [selectedTab])

  const handleBid = () => {
    if (!selectedItem) return

    if (getTimeLeftSeconds(selectedItem) <= 0) {
      audioManager.playSfx('error')
      return
    }

    if (walletBalance < bidStep) {
      audioManager.playSfx('error')
      onNeedTopUp()
      return
    }

    const nextBid = Number((selectedItem.currentBid + bidStep).toFixed(2))
    const success = onBid(bidStep, selectedItem.title, nextBid)

    if (!success) return

    setSelectedItem({
      ...selectedItem,
      currentBid: nextBid,
      bidCount: selectedItem.bidCount + 1,
      status: getCountdownStatus(getTimeLeftSeconds(selectedItem)),
    })
  }

  return (
    <section
      id="auction"
      className="mx-auto w-full max-w-7xl px-4 py-7 lg:hidden"
    >
      <div className="overflow-hidden rounded-[1.5rem] border border-cyan-400/10 bg-[#030712] text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/5">
        <div className="relative border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.92))] px-4 pb-3 pt-4">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-200/60" />
              <input
                type="text"
                placeholder="Search cards, seller"
                className="h-11 w-full rounded-full border border-white/10 bg-white/[0.06] pl-10 pr-4 text-sm font-semibold text-white outline-none placeholder:text-slate-500 shadow-inner shadow-black/20 focus:border-cyan-300/50 focus:bg-white/[0.09]"
              />
            </div>

            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-200 shadow-inner shadow-black/20"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-black text-white shadow-[0_0_14px_rgba(236,72,153,0.55)]">
                2
              </span>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 rounded-2xl border border-white/10 bg-black/20 p-1 shadow-inner shadow-black/40">
            {(['General', 'Premier'] as const).map((tab) => {
              const isActive = selectedTab === tab

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedTab(tab)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-black transition ${
                    isActive
                      ? 'bg-yellow-400 text-black shadow-[0_12px_28px_rgba(250,204,21,0.22)]'
                      : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-100'
                  }`}
                >
                  {tab === 'General' ? (
                    <Gavel className={`h-4 w-4 ${isActive ? 'text-black' : 'text-yellow-300'}`} />
                  ) : (
                    <Trophy className={`h-4 w-4 ${isActive ? 'text-black' : 'text-cyan-200'}`} />
                  )}
                  {tab} Auction
                </button>
              )
            })}
          </div>
        </div>

        <div className="relative px-4 pb-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(250,204,21,0.08),transparent_28%),radial-gradient(circle_at_10%_70%,rgba(34,211,238,0.08),transparent_30%)]" />
          <div className="relative mt-3 overflow-hidden rounded-2xl border border-yellow-300/20 bg-black shadow-[0_18px_55px_rgba(0,0,0,0.32)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(250,204,21,0.42),transparent_34%),radial-gradient(circle_at_88%_62%,rgba(34,211,238,0.12),transparent_30%),linear-gradient(135deg,#111827,#020617)]" />
            <div className="relative z-10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-300">
                Live Event
              </p>
              <h3 className="mt-2 max-w-[240px] text-2xl font-black leading-tight text-white">
                Collect Cards & Unlock Auction Rewards
              </h3>
              <p className="mt-2 max-w-[230px] text-xs leading-5 text-slate-300">
                Bid before the timer ends. Higher tier auctions unlock premium chase cards.
              </p>

              <div className="mt-4 inline-flex rounded-full bg-yellow-400 px-4 py-2 text-xs font-black text-black shadow-[0_0_24px_rgba(250,204,21,0.32)]">
                {visibleCards.filter((item) => getTimeLeftSeconds(item) > 0).length} auctions live
              </div>
            </div>

            <div className="absolute bottom-2 right-3 text-7xl opacity-20">🏆</div>
          </div>

          <div className="relative mt-4 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm font-black text-slate-200 shadow-sm shadow-black/20"
              >
                <Filter className="h-4 w-4 text-cyan-200" />
                Filter
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm font-black text-slate-200 shadow-sm shadow-black/20"
              >
                <SlidersHorizontal className="h-4 w-4 text-cyan-200" />
                Sort
              </button>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-black text-black shadow-[0_12px_28px_rgba(250,204,21,0.22)]"
            >
              All
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mt-4 grid grid-cols-2 gap-3">
            {visibleCards.map((item) => {
              const timeLeftSeconds = getTimeLeftSeconds(item)
              const countdownStatus = getCountdownStatus(timeLeftSeconds)
              const countdownLabel = formatAuctionCountdown(timeLeftSeconds)
              const initialSeconds = getInitialSeconds(item)
              const cardProgress = Math.max(
                0,
                Math.min(100, (timeLeftSeconds / initialSeconds) * 100),
              )

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#07111f] text-left shadow-[0_16px_38px_rgba(0,0,0,0.32)] transition active:scale-[0.98]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_48%)]" />
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className={`relative z-10 h-full w-full object-cover ${
                        countdownStatus === 'Ended' ? 'opacity-35 grayscale' : ''
                      }`}
                    />

                    <div
                      className={`absolute left-2 top-2 z-20 rounded-full border px-2 py-1 text-[10px] font-black ${getCountdownBadgeClass(
                        timeLeftSeconds,
                      )}`}
                    >
                      {countdownStatus === 'Ended'
                        ? 'ENDED'
                        : `${countdownStatus === 'Ending' ? 'ENDING' : 'LIVE'} · ${countdownLabel}`}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-black/50">
                      <div
                        className={`h-full rounded-r-full transition-all duration-500 ${getCountdownProgressClass(
                          timeLeftSeconds,
                        )}`}
                        style={{ width: `${cardProgress}%` }}
                      />
                    </div>

                    {countdownStatus === 'Ending' && (
                      <div className="absolute bottom-1 left-0 right-0 z-20 bg-yellow-400 px-2 py-1 text-xs font-black text-black">
                        {item.seller}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/10 p-2.5">
                    <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-white">
                      {item.title}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <Clock3
                        className={`h-3.5 w-3.5 ${getCountdownTextClass(timeLeftSeconds)}`}
                      />
                      <span className={getCountdownTextClass(timeLeftSeconds)}>
                        {countdownStatus === 'Ended' ? 'Sale closed' : countdownLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-black text-yellow-300">
                      {formatMoney(item.currentBid)}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[1000000] bg-[#030712] text-white lg:hidden">
          <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.13),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(250,204,21,0.10),transparent_28%),linear-gradient(180deg,#020617,#030712)]">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-slate-950/85 px-4 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="flex min-w-0 flex-col items-center">
                <span
                  className={`text-[9px] font-black uppercase tracking-[0.24em] ${
                    selectedCountdownStatus === 'Ended' ? 'text-slate-500' : 'text-cyan-200/70'
                  }`}
                >
                  {selectedCountdownStatus === 'Ended' ? 'Auction Closed' : 'Live Auction'}
                </span>
                <div
                  className={`mt-0.5 flex items-center gap-1.5 text-sm font-black ${getCountdownTextClass(
                    selectedTimeLeftSeconds,
                  )}`}
                >
                  <Clock3 className="h-4 w-4" />
                  {formatAuctionCountdown(selectedTimeLeftSeconds)}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-100"
                >
                  <Heart className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-100"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-[190px]">
              <div className="flex justify-center border-b border-white/10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_48%),linear-gradient(180deg,rgba(15,23,42,0.8),rgba(2,6,23,0.95))] p-4">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="max-h-[420px] w-auto rounded-2xl object-contain shadow-[0_24px_75px_rgba(0,0,0,0.45)] ring-1 ring-white/10"
                />
              </div>

              <div className="px-5 py-5">
                <h3 className="text-2xl font-semibold leading-tight text-white">
                  {selectedItem.title}
                </h3>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-2xl font-black text-yellow-300">
                      {formatMoney(selectedItem.currentBid)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      +MYR {selectedItem.shippingFee.toFixed(2)} Shipping Fee
                    </p>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-black text-white">
                    {selectedItem.bidCount} bid
                  </span>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-inner shadow-black/20">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200/70">
                        Countdown
                      </p>
                      <p
                        className={`mt-1 text-2xl font-black ${getCountdownTextClass(
                          selectedTimeLeftSeconds,
                        )}`}
                      >
                        {formatAuctionCountdown(selectedTimeLeftSeconds)}
                      </p>
                    </div>

                    <div
                      className={`rounded-full border px-3 py-1.5 text-xs font-black ${getCountdownBadgeClass(
                        selectedTimeLeftSeconds,
                      )}`}
                    >
                      {selectedCountdownStatus === 'Ended'
                        ? 'ENDED'
                        : selectedCountdownStatus === 'Ending'
                          ? 'ENDING SOON'
                          : 'LIVE'}
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/40">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getCountdownProgressClass(
                        selectedTimeLeftSeconds,
                      )}`}
                      style={{ width: `${selectedProgress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_16px_45px_rgba(0,0,0,0.24)]">
                  <img
                    src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${selectedItem.seller}&radius=50&backgroundColor=facc15`}
                    alt={selectedItem.seller}
                    className="h-12 w-12 rounded-full ring-2 ring-yellow-300/35"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-white">{selectedItem.seller}</p>
                    <p className="text-sm text-slate-400">
                      {selectedItem.country} | {selectedItem.followers} followers
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {selectedItem.sold} sold | ⭐ {selectedItem.review} Positive Review
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-black shadow-[0_10px_24px_rgba(250,204,21,0.20)]"
                  >
                    Follow
                  </button>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-inner shadow-black/20">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200/70">
                    Quick Bid
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[10, 50, 100].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setBidStep(step)}
                        disabled={selectedCountdownStatus === 'Ended'}
                        className={`rounded-xl px-4 py-3 text-sm font-black ${
                          selectedCountdownStatus === 'Ended'
                            ? 'border border-white/5 bg-black/20 text-slate-600'
                            : bidStep === step
                              ? 'bg-yellow-400 text-black shadow-[0_12px_24px_rgba(250,204,21,0.18)]'
                              : 'border border-white/10 bg-black/20 text-slate-300'
                        }`}
                      >
                        +{step}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed bottom-[calc(82px+env(safe-area-inset-bottom))] left-4 right-4 z-[1000020] rounded-[1.6rem] border border-white/10 bg-slate-950/90 p-3 shadow-[0_-18px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between px-1">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200/70">
                    Current Bid
                  </p>
                  <p className="text-lg font-black text-yellow-300">
                    {formatMoney(selectedItem.currentBid)}
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-black text-white">
                  {selectedItem.bidCount} bid
                </div>
              </div>

              <button
                type="button"
                onClick={handleBid}
                disabled={selectedCountdownStatus === 'Ended'}
                className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-base font-black shadow-[0_12px_28px_rgba(234,179,8,0.25)] ${
                  selectedCountdownStatus === 'Ended'
                    ? 'bg-slate-800 text-slate-500 shadow-none'
                    : 'bg-yellow-400 text-black'
                }`}
              >
                <Gavel className="h-5 w-5" />
                {selectedCountdownStatus === 'Ended'
                  ? 'Auction Ended'
                  : walletBalance >= bidStep
                    ? `Bid Now +${bidStep}`
                    : 'Top Up to Bid'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
