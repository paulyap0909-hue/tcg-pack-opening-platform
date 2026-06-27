import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Bell,
  Clock3,
  Flame,
  Gavel,
  Gem,
  Radio,
  ShieldCheck,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react";

import { pokemonRealCardPool } from "../data/cardPool";

type BidRecord = {
  id: string;
  bidder: string;
  amount: number;
  createdAt: string;
  isUser?: boolean;
  note?: string;
};

type AuctionItem = {
  id: string;
  cardName: string;
  rarity: string;
  image: string;
  seller: string;
  currentBid: number;
  highestBidder: string;
  watchers: number;
  bids: BidRecord[];
  endAt: number;
  status: "Live" | "Final Call" | "Ended";
};

type LiveAuctionPanelProps = {
  walletBalance: number;
  onBid: (cost: number, auctionName: string, nextBid: number) => boolean;
  onNeedTopUp: () => void;
};

const demoBidders = [
  "KaiTanVault",
  "SEAChaser",
  "JomCollector",
  "RareHunterX",
  "FoilBoss88",
  "VaultRider",
];

const formatTime = (milliseconds: number) => {
  const safeMilliseconds = Math.max(milliseconds, 0);
  const totalSeconds = Math.floor(safeMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const getBidTime = () => {
  return new Date().toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDemoCard = (keyword: string, fallbackIndex: number) => {
  return (
    pokemonRealCardPool.find((card) =>
      card.name.toLowerCase().includes(keyword.toLowerCase()),
    ) ?? pokemonRealCardPool[fallbackIndex]
  );
};

function createInitialAuction(): AuctionItem {
  const card = getDemoCard("charizard", 0);
  const now = Date.now();

  return {
    id: "auction-charizard-001",
    cardName: card.name,
    rarity: card.rarity,
    image: card.image,
    seller: "Vault Seller",
    currentBid: 1250,
    highestBidder: "SEAChaser",
    watchers: 38,
    endAt: now + 18 * 60 * 1000,
    status: "Live",
    bids: [
      {
        id: "bid-3",
        bidder: "SEAChaser",
        amount: 1250,
        createdAt: getBidTime(),
      },
      {
        id: "bid-2",
        bidder: "KaiTanVault",
        amount: 1200,
        createdAt: getBidTime(),
      },
      {
        id: "bid-1",
        bidder: "JomCollector",
        amount: 1150,
        createdAt: getBidTime(),
      },
    ],
  };
}

const upcomingCards = [
  getDemoCard("pikachu", 3),
  getDemoCard("mew", 8),
  getDemoCard("arceus", 11),
].filter(Boolean);

export default function LiveAuctionPanel({
  walletBalance,
  onBid,
  onNeedTopUp,
}: LiveAuctionPanelProps) {
  const [auction, setAuction] = useState<AuctionItem>(() => createInitialAuction());
  const [now, setNow] = useState(() => Date.now());
  const [selectedIncrement, setSelectedIncrement] = useState(50);

  const remainingMs = Math.max(auction.endAt - now, 0);
  const isFinalCall = remainingMs > 0 && remainingMs <= 30_000;
  const isEnded = remainingMs <= 0;
  const nextBid = auction.currentBid + selectedIncrement;
  const hasEnoughWallet = walletBalance >= selectedIncrement;

  const auctionStatus = useMemo(() => {
    if (isEnded) return "Ended";
    if (isFinalCall) return "Final Call";
    return "Live";
  }, [isEnded, isFinalCall]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const updater = window.setInterval(() => {
      setAuction((currentAuction) => {
        if (Date.now() >= currentAuction.endAt) return currentAuction;

        const simulatedIncrement = [10, 20, 50][Math.floor(Math.random() * 3)];
        const bidder = demoBidders[Math.floor(Math.random() * demoBidders.length)];
        const amount = currentAuction.currentBid + simulatedIncrement;
        const shouldExtend = currentAuction.endAt - Date.now() <= 12_000;

        return {
          ...currentAuction,
          currentBid: amount,
          highestBidder: bidder,
          watchers: currentAuction.watchers + Math.floor(Math.random() * 3),
          endAt: shouldExtend ? currentAuction.endAt + 15_000 : currentAuction.endAt,
          bids: [
            {
              id: `${Date.now()}-auto-bid`,
              bidder,
              amount,
              createdAt: getBidTime(),
              note: shouldExtend ? "+15s Extended" : undefined,
            },
            ...currentAuction.bids,
          ].slice(0, 8),
        };
      });
    }, 60_000);

    return () => window.clearInterval(updater);
  }, []);

  const placeBid = (increment: number) => {
    if (isEnded) return;

    if (walletBalance < increment) {
      onNeedTopUp();
      return;
    }

    const amount = auction.currentBid + increment;
    const success = onBid(increment, auction.cardName, amount);

    if (!success) return;

    setAuction((currentAuction) => {
      const shouldExtend = currentAuction.endAt - Date.now() <= 10_000;

      return {
        ...currentAuction,
        currentBid: amount,
        highestBidder: "Paul",
        watchers: currentAuction.watchers + 1,
        endAt: shouldExtend ? currentAuction.endAt + 15_000 : currentAuction.endAt,
        bids: [
          {
            id: `${Date.now()}-user-bid`,
            bidder: "Paul",
            amount,
            createdAt: getBidTime(),
            isUser: true,
            note: shouldExtend ? "+15s Extended" : undefined,
          },
          ...currentAuction.bids,
        ].slice(0, 8),
      };
    });
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8">
      <motion.div
        className="relative overflow-hidden rounded-[2.5rem] border border-cyan-300/20 bg-[#050b18]/90 p-5 shadow-[0_35px_120px_rgba(0,0,0,0.42)] md:p-7"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_74%_30%,rgba(250,204,21,0.12),transparent_26%),radial-gradient(circle_at_60%_90%,rgba(168,85,247,0.12),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(34,211,238,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.2)_1px,transparent_1px)] [background-size:58px_58px]" />

        <div className="relative z-10 mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="hud-label text-sm">Live Auction Arena</p>
            <h2 className="mt-2 text-4xl font-black text-white">
              Player Auction Bid
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Bid on vault cards in real time. Demo mode updates every 60 seconds and
              extends the timer during final-call bidding.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Status
              </p>
              <p className={`mt-1 text-sm font-black ${
                auctionStatus === "Final Call"
                  ? "text-orange-300"
                  : auctionStatus === "Ended"
                    ? "text-slate-400"
                    : "text-emerald-300"
              }`}>
                {auctionStatus}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Wallet
              </p>
              <p className="mt-1 text-sm font-black text-amber-200">
                {walletBalance.toLocaleString()} pts
              </p>
            </div>

            <div className="rounded-2xl border border-purple-300/15 bg-purple-300/[0.06] px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Update
              </p>
              <p className="mt-1 text-sm font-black text-purple-200">60s</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid gap-5 xl:grid-cols-[0.9fr_1.05fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-cyan-300/20 bg-black/35 p-4">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(250,204,21,0.22),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(34,211,238,0.16),transparent_42%)]" />
              <img
                src={auction.image}
                alt={auction.cardName}
                className="relative z-10 mx-auto h-[360px] w-auto rounded-2xl object-contain drop-shadow-[0_35px_80px_rgba(0,0,0,0.55)]"
              />
              <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200">
                Vault Verified
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-xs font-black text-purple-200">
                  {auction.rarity}
                </span>
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-200">
                  Seller: {auction.seller}
                </span>
              </div>
              <h3 className="mt-3 text-2xl font-black text-white">
                {auction.cardName}
              </h3>
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-300/20 bg-gradient-to-b from-amber-300/[0.08] via-white/[0.035] to-cyan-300/[0.04] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-200">
                  Current Bid
                </p>
                <div className="mt-2 flex items-end gap-2">
                  <p className="text-5xl font-black text-white">
                    {auction.currentBid.toLocaleString()}
                  </p>
                  <p className="pb-2 text-sm font-black text-slate-400">pts</p>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Highest bidder:{" "}
                  <span className="font-black text-cyan-200">
                    {auction.highestBidder}
                  </span>
                </p>
              </div>

              <div className={`rounded-2xl border px-4 py-3 text-center ${
                isFinalCall
                  ? "border-orange-300/30 bg-orange-300/10"
                  : "border-cyan-300/20 bg-cyan-300/10"
              }`}>
                <Clock3 className={`mx-auto h-6 w-6 ${
                  isFinalCall ? "text-orange-300" : "text-cyan-300"
                }`} />
                <p className="mt-2 text-3xl font-black text-white">
                  {formatTime(remainingMs)}
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Time Left
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                  Quick Bid
                </p>
                <p className="text-xs text-slate-500">
                  Next:{" "}
                  <span className="font-black text-white">
                    {nextBid.toLocaleString()} pts
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[10, 50, 100].map((increment) => (
                  <button
                    key={increment}
                    type="button"
                    onClick={() => setSelectedIncrement(increment)}
                    className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
                      selectedIncrement === increment
                        ? "border-cyan-300 bg-cyan-300 text-black"
                        : "border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.07]"
                    }`}
                  >
                    +{increment}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => placeBid(selectedIncrement)}
                disabled={isEnded}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-black transition ${
                  isEnded
                    ? "cursor-not-allowed border border-white/10 bg-white/[0.04] text-slate-500"
                    : hasEnoughWallet
                      ? "bg-gradient-to-r from-amber-300 via-orange-300 to-red-400 text-black shadow-[0_0_40px_rgba(250,204,21,0.22)] hover:scale-[1.01]"
                      : "bg-gradient-to-r from-cyan-300 to-blue-500 text-black hover:scale-[1.01]"
                }`}
              >
                {isEnded ? (
                  <>
                    <Trophy className="h-5 w-5" />
                    Auction Ended
                  </>
                ) : hasEnoughWallet ? (
                  <>
                    <Gavel className="h-5 w-5" />
                    Place Bid +{selectedIncrement}
                  </>
                ) : (
                  <>
                    <Wallet className="h-5 w-5" />
                    Top Up to Bid
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                <Activity className="h-5 w-5 text-cyan-300" />
                <p className="mt-2 text-xl font-black text-white">
                  {auction.watchers}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Watchers
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                <Flame className="h-5 w-5 text-orange-300" />
                <p className="mt-2 text-xl font-black text-white">
                  {auction.bids.length}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Bids
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <p className="mt-2 text-xl font-black text-white">15s</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Extend
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/15 bg-cyan-300/[0.035] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                  Live Bid Feed
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Demo auto update every minute.
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10">
                <Radio className="h-5 w-5 text-emerald-300" />
              </div>
            </div>

            <div className="space-y-3">
              {auction.bids.map((bid) => (
                <div
                  key={bid.id}
                  className={`rounded-2xl border p-3 ${
                    bid.isUser
                      ? "border-cyan-300/30 bg-cyan-300/10"
                      : "border-white/10 bg-black/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-black text-white">
                      {bid.bidder}
                      {bid.isUser && (
                        <span className="ml-2 rounded-full bg-cyan-300 px-2 py-0.5 text-[10px] text-black">
                          YOU
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">{bid.createdAt}</p>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="flex items-center gap-2 text-sm font-black text-amber-200">
                      <Gem className="h-4 w-4" />
                      {bid.amount.toLocaleString()} pts
                    </p>

                    {bid.note && (
                      <span className="rounded-full border border-orange-300/20 bg-orange-300/10 px-2 py-1 text-[10px] font-black text-orange-200">
                        {bid.note}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-5 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                Upcoming Auctions
              </p>
              <p className="mt-1 text-sm text-slate-500">
                More vault cards queued for the next live drop.
              </p>
            </div>
            <Bell className="h-5 w-5 text-cyan-300" />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {upcomingCards.map((card, index) => (
              <div
                key={`${card.id}-upcoming-${index}`}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="h-16 w-12 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">
                    {card.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">{card.rarity}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-black text-cyan-200">
                    <Zap className="h-3.5 w-3.5" />
                    Starts soon
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
