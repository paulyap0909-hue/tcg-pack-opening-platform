import { useMemo, useState } from 'react'
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

export default function MobileAuctionPanel({
  walletBalance,
  onBid,
  onNeedTopUp,
}: MobileAuctionPanelProps) {
  const [selectedTab, setSelectedTab] = useState<'General' | 'Premier'>('General')
  const [selectedItem, setSelectedItem] = useState<MobileAuctionItem | null>(null)
  const [bidStep, setBidStep] = useState(50)

  const visibleCards = useMemo(() => {
    return auctionCards.filter((item) => item.category === selectedTab)
  }, [selectedTab])

  const handleBid = () => {
    if (!selectedItem) return

    if (walletBalance < bidStep) {
      onNeedTopUp()
      return
    }

    const nextBid = Math.round(selectedItem.currentBid + bidStep)
    const success = onBid(bidStep, selectedItem.title, nextBid)

    if (!success) return

    setSelectedItem({
      ...selectedItem,
      currentBid: nextBid,
      bidCount: selectedItem.bidCount + 1,
      status: 'Ending',
    })
  }

  return (
    <section
      id="auction"
      className="mx-auto w-full max-w-7xl px-4 py-7 lg:hidden"
    >
      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-100 text-slate-950 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
        <div className="bg-white px-4 pb-3 pt-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search cards, seller"
                className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-700"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-black text-white">
                2
              </span>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 rounded-2xl bg-slate-50 p-1">
            {(['General', 'Premier'] as const).map((tab) => {
              const isActive = selectedTab === tab

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedTab(tab)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-black transition ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  {tab === 'General' ? (
                    <Gavel className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Trophy className="h-4 w-4 text-slate-800" />
                  )}
                  {tab} Auction
                </button>
              )
            })}
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="relative mt-3 overflow-hidden rounded-2xl bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(250,204,21,0.38),transparent_34%),linear-gradient(135deg,#111827,#020617)]" />
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

              <div className="mt-4 inline-flex rounded-full bg-yellow-400 px-4 py-2 text-xs font-black text-black">
                {visibleCards.length} auctions live
              </div>
            </div>

            <div className="absolute bottom-2 right-3 text-7xl opacity-20">🏆</div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-black text-slate-700 shadow-sm"
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-black text-slate-700 shadow-sm"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Sort
              </button>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-black text-black shadow-sm"
            >
              All
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {visibleCards.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItem(item)}
                className="overflow-hidden rounded-2xl bg-white text-left shadow-sm"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className={`h-full w-full object-cover ${
                      item.status === 'Ended' ? 'opacity-35 grayscale' : ''
                    }`}
                  />

                  <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-black text-white">
                    {item.status === 'Ended' ? 'Ended' : item.endsIn}
                  </div>

                  {item.status === 'Ending' && (
                    <div className="absolute bottom-0 left-0 right-0 bg-yellow-400 px-2 py-1 text-xs font-black text-white">
                      speed
                    </div>
                  )}
                </div>

                <div className="p-2.5">
                  <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-slate-900">
                    {item.title}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    <span>{item.status === 'Ended' ? 'Sale closed' : item.endsIn}</span>
                  </div>
                  <p className="mt-1 text-sm font-black text-yellow-600">
                    {formatMoney(item.currentBid)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[1000000] bg-white text-slate-950 lg:hidden">
          <div className="flex h-full flex-col">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-sm font-black text-yellow-600">
                <Clock3 className="h-4 w-4" />
                {selectedItem.status === 'Ended' ? 'Ended' : selectedItem.endsIn}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50"
                >
                  <Heart className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-[190px]">
              <div className="flex justify-center bg-slate-50 p-4">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="max-h-[420px] w-auto rounded-2xl object-contain shadow-[0_18px_55px_rgba(0,0,0,0.20)]"
                />
              </div>

              <div className="px-5 py-5">
                <h3 className="text-2xl font-semibold leading-tight">
                  {selectedItem.title}
                </h3>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-2xl font-black text-yellow-600">
                      {formatMoney(selectedItem.currentBid)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      +MYR {selectedItem.shippingFee.toFixed(2)} Shipping Fee
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-white">
                    {selectedItem.bidCount} bid
                  </span>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-sm text-slate-500">
                    Ends in{' '}
                    <span className="font-black text-slate-950">
                      {selectedItem.endsIn}
                    </span>
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <img
                    src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${selectedItem.seller}&radius=50&backgroundColor=facc15`}
                    alt={selectedItem.seller}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-black">{selectedItem.seller}</p>
                    <p className="text-sm text-slate-500">
                      {selectedItem.country} | {selectedItem.followers} followers
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {selectedItem.sold} sold | ⭐ {selectedItem.review} Positive Review
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-black"
                  >
                    Follow
                  </button>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    Quick Bid
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[10, 50, 100].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setBidStep(step)}
                        className={`rounded-xl px-4 py-3 text-sm font-black ${
                          bidStep === step
                            ? 'bg-yellow-400 text-black'
                            : 'bg-white text-slate-700'
                        }`}
                      >
                        +{step}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed bottom-[calc(82px+env(safe-area-inset-bottom))] left-4 right-4 z-[1000020] rounded-[1.6rem] border border-slate-200 bg-white/95 p-3 shadow-[0_-18px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between px-1">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                    Current Bid
                  </p>
                  <p className="text-lg font-black text-yellow-600">
                    {formatMoney(selectedItem.currentBid)}
                  </p>
                </div>

                <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-white">
                  {selectedItem.bidCount} bid
                </div>
              </div>

              <button
                type="button"
                onClick={handleBid}
                disabled={selectedItem.status === 'Ended'}
                className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-base font-black shadow-[0_12px_28px_rgba(234,179,8,0.25)] ${
                  selectedItem.status === 'Ended'
                    ? 'bg-slate-200 text-slate-400 shadow-none'
                    : 'bg-yellow-400 text-black'
                }`}
              >
                <Gavel className="h-5 w-5" />
                {selectedItem.status === 'Ended'
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
