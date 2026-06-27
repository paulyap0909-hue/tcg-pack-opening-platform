import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Crown,
  Gift,
  Sparkles,
  Star,
  Target,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  dailyLoginRewards,
  hasClaimedDailyRewardToday,
  type DailyLoginState,
} from "../data/dailyLoginRewards";
import type { TransactionRecord } from "./TransactionDrawer";
import { getSellBackPoints, type VaultCard } from "./VaultDrawer";
import MonthlyLeaderboardSection from "./MonthlyLeaderboardSection";

export type QuestStats = {
  openPacks: number;
  open1: number;
  open10: number;
  open100: number;
  sellBack: number;
  shipping: number;
  topUp: number;
  xp: number;
  claimedQuestIds: string[];
};

export type QuestReward = {
  points: number;
  xp: number;
};

type QuestDefinition = {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  reward: QuestReward;
  icon: LucideIcon;
  accent: string;
};

type QuestLeaderboardPanelProps = {
  questStats: QuestStats;
  vaultCards: VaultCard[];
  transactions: TransactionRecord[];
  raffleTickets?: number;
  walletBalance?: number;
  dailyLoginState?: DailyLoginState;
  onClaimQuest: (questId: string, reward: QuestReward) => void;
  onOpenDailyLogin?: () => void;
};

export const initialQuestStats: QuestStats = {
  openPacks: 0,
  open1: 0,
  open10: 0,
  open100: 0,
  sellBack: 0,
  shipping: 0,
  topUp: 0,
  xp: 0,
  claimedQuestIds: [],
};

const clampProgress = (current: number, target: number) => {
  return Math.min(Math.max(current, 0), target);
};

const createQuestDefinitions = (questStats: QuestStats): QuestDefinition[] => [
  {
    id: "open-1-pack",
    title: "Open 1 Pack",
    description: "Open any single pack.",
    current: questStats.open1,
    target: 1,
    reward: { points: 50, xp: 25 },
    icon: Target,
    accent: "cyan",
  },
  {
    id: "open-10-total-packs",
    title: "Open 10 Packs",
    description: "Reach 10 total packs.",
    current: questStats.openPacks,
    target: 10,
    reward: { points: 120, xp: 80 },
    icon: Zap,
    accent: "amber",
  },
  {
    id: "open-100-burst",
    title: "Open 100 Burst",
    description: "Use the Open 100 flow.",
    current: questStats.open100,
    target: 1,
    reward: { points: 500, xp: 300 },
    icon: Crown,
    accent: "purple",
  },
  {
    id: "sell-back-1-card",
    title: "Sell Back 1 Card",
    description: "Sell one vault card.",
    current: questStats.sellBack,
    target: 1,
    reward: { points: 75, xp: 60 },
    icon: Gift,
    accent: "emerald",
  },
  {
    id: "request-shipping-1-card",
    title: "Request Shipping",
    description: "Submit one shipping request.",
    current: questStats.shipping,
    target: 1,
    reward: { points: 0, xp: 150 },
    icon: Sparkles,
    accent: "pink",
  },
  {
    id: "top-up-wallet",
    title: "Top Up Wallet",
    description: "Top up wallet once.",
    current: questStats.topUp,
    target: 1,
    reward: { points: 100, xp: 40 },
    icon: Star,
    accent: "blue",
  },
];

const getAccentClasses = (accent: string) => {
  const accents: Record<string, string> = {
    cyan: "border-cyan-300/25 bg-cyan-300/[0.08] text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.12)]",
    amber:
      "border-amber-300/25 bg-amber-300/[0.08] text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.12)]",
    purple:
      "border-purple-300/25 bg-purple-300/[0.08] text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.12)]",
    emerald:
      "border-emerald-300/25 bg-emerald-300/[0.08] text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.12)]",
    pink: "border-pink-300/25 bg-pink-300/[0.08] text-pink-300 shadow-[0_0_20px_rgba(244,114,182,0.12)]",
    blue: "border-blue-300/25 bg-blue-300/[0.08] text-blue-300 shadow-[0_0_20px_rgba(96,165,250,0.12)]",
  };

  return accents[accent] ?? accents.cyan;
};

const getCountdownToMidnight = () => {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);

  const diff = Math.max(next.getTime() - now.getTime(), 0);
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function QuestLeaderboardPanel({
  questStats,
  vaultCards,
  transactions,
  raffleTickets = 0,
  walletBalance = 0,
  dailyLoginState,
  onClaimQuest,
  onOpenDailyLogin,
}: QuestLeaderboardPanelProps) {
  const [raffleCountdown, setRaffleCountdown] = useState(() =>
    getCountdownToMidnight(),
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRaffleCountdown(getCountdownToMidnight());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const questDefinitions = createQuestDefinitions(questStats);
  const claimedCount = questStats.claimedQuestIds.length;
  const vaultValue = vaultCards.reduce(
    (total, card) => total + getSellBackPoints(card),
    0,
  );

  const level = Math.floor(questStats.xp / 500);
  const xpIntoLevel = questStats.xp % 500;
  const xpTarget = 500;
  const xpPercent = Math.round((xpIntoLevel / xpTarget) * 100);
  const claimedToday = dailyLoginState
    ? hasClaimedDailyRewardToday(dailyLoginState)
    : false;
  const activeDailyDay = dailyLoginState?.streakDay ?? 1;

  const currentPlayerScore = Math.max(questStats.openPacks, 0);

  const completedQuestCount = questDefinitions.filter(
    (quest) => quest.current >= quest.target,
  ).length;

  const renderQuestMissionCards = () => (
    <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
      {questDefinitions.map((quest, index) => {
        const progress = clampProgress(quest.current, quest.target);
        const progressPercent = Math.round((progress / quest.target) * 100);
        const isCompleted = quest.current >= quest.target;
        const isClaimed = questStats.claimedQuestIds.includes(quest.id);
        const Icon = quest.icon;

        return (
          <motion.article
            key={quest.id}
            className="hud-card hud-corners flex min-h-[102px] flex-col rounded-[1.15rem] p-3 sm:min-h-[118px] sm:rounded-[1.25rem]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.025 }}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${getAccentClasses(
                  quest.accent,
                )}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate text-sm font-black leading-tight text-white">
                    {quest.title}
                  </h3>
                  {isClaimed && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                  )}
                </div>
                <p className="mt-1 truncate text-[11px] text-slate-400">
                  {quest.description}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                <span>Progress</span>
                <span className="text-slate-300">
                  {progress} / {quest.target}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full border border-cyan-300/10 bg-slate-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-purple-400"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 pt-3">
              <p className="min-w-0 truncate text-xs text-slate-300">
                <span className="font-black text-amber-300">
                  {quest.reward.points} pts
                </span>{" "}
                +{" "}
                <span className="font-black text-purple-300">
                  {quest.reward.xp} XP
                </span>
              </p>

              <button
                type="button"
                disabled={!isCompleted || isClaimed}
                onClick={() => onClaimQuest(quest.id, quest.reward)}
                className={`shrink-0 rounded-xl px-3 py-2 text-xs font-black transition ${
                  isClaimed
                    ? "cursor-not-allowed border border-emerald-300/20 bg-emerald-300/10 text-emerald-300"
                    : isCompleted
                      ? "border border-amber-300/30 bg-amber-300/10 text-amber-200 hover:scale-[1.02] hover:bg-amber-300/20"
                      : "cursor-not-allowed border border-slate-500/20 bg-slate-500/10 text-slate-500"
                }`}
              >
                {isClaimed ? "Done" : isCompleted ? "Claim" : "Locked"}
              </button>
            </div>
          </motion.article>
        );
      })}
    </div>
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-5 lg:px-8">
      <div className="mb-5 flex flex-col gap-2 text-center">
        <p className="hud-label justify-center text-sm">Quest</p>
        <h2 className="text-3xl font-black sm:text-4xl">Daily Progress Center</h2>
        <p className="mx-auto max-w-3xl text-sm leading-6 text-slate-400">
          Compact player progress, missions, rewards and leaderboard for mobile demo.
        </p>
      </div>

      <div className="grid items-stretch gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/20 bg-gradient-to-br from-white/20 via-white/10 to-white/[0.03] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:rounded-[2rem] sm:p-6">
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-300">
                Player Level
              </p>
              <div className="mt-3 flex flex-wrap items-end gap-3 sm:mt-4 sm:gap-4">
                <h3 className="text-4xl font-black text-white sm:text-5xl">LV {level}</h3>
                <p className="pb-2 text-sm font-bold text-orange-200">
                  🔥 {Math.max(xpTarget - xpIntoLevel, 0)} XP to Level Up
                </p>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  <span>{xpIntoLevel.toLocaleString()} XP</span>
                  <span>{xpTarget.toLocaleString()} XP</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full border border-white/20 bg-black/35">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 via-amber-200 to-white"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3 sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                  Wallet
                </p>
                <p className="mt-1 text-xl font-black text-white sm:mt-2 sm:text-2xl">
                  {walletBalance.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3 sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                  Tickets
                </p>
                <p className="mt-1 text-xl font-black text-amber-200 sm:mt-2 sm:text-2xl">
                  {raffleTickets.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3 sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                  Claimed
                </p>
                <p className="mt-1 text-xl font-black text-emerald-200 sm:mt-2 sm:text-2xl">
                  {claimedCount} / {questDefinitions.length}
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-4 rounded-[1.35rem] border border-orange-300/35 bg-gradient-to-r from-[#7b2c17]/80 via-[#34120c]/80 to-[#0c1724]/80 p-4 shadow-[0_0_45px_rgba(249,115,22,0.18)] sm:mt-6 sm:rounded-[1.7rem] sm:p-5">
              <div className="pointer-events-none absolute inset-0 rounded-[1.7rem] bg-[radial-gradient(circle_at_15%_50%,rgba(249,115,22,0.25),transparent_35%),radial-gradient(circle_at_85%_50%,rgba(34,211,238,0.15),transparent_35%)]" />
              <div className="relative z-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-200">
                    Free Raffle
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-3xl font-black text-white sm:text-4xl">
                      🔥 {raffleTickets.toLocaleString()}
                    </span>
                    <span className="rounded-full border border-orange-200/20 bg-orange-300/10 px-3 py-1 text-xs font-black text-orange-100">
                      495 Gems Demo
                    </span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-300">
                    Next Draw
                  </p>
                  <p className="mt-1 text-3xl font-black text-white sm:mt-2 sm:text-4xl">
                    {raffleCountdown}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/35">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-orange-400 to-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-4 rounded-[1.35rem] border border-orange-300/25 bg-gradient-to-br from-[#371006] via-[#1a0b08] to-black/60 p-4 sm:mt-6 sm:rounded-[1.7rem] sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-200">
                    Daily Login Rewards
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {claimedToday
                      ? 'Today claimed. Come back tomorrow.'
                      : `Day ${activeDailyDay} is ready to claim.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenDailyLogin}
                  className="rounded-2xl border border-orange-300/30 bg-orange-300/10 px-4 py-3 text-sm font-black text-orange-100 transition hover:scale-[1.02] hover:bg-orange-300/20"
                >
                  {claimedToday ? 'View Rewards' : 'Claim Daily'}
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {dailyLoginRewards.map((reward) => {
                  const isActive = reward.day === activeDailyDay && !claimedToday;
                  const isClaimed = reward.day === activeDailyDay && claimedToday;

                  return (
                    <div
                      key={reward.day}
                      className={`relative min-h-[68px] rounded-xl border p-2 text-center sm:min-h-[96px] sm:p-3 ${
                        isActive
                          ? 'border-orange-200 bg-orange-300/15 shadow-[0_0_20px_rgba(251,146,60,0.2)]'
                          : 'border-white/10 bg-white/[0.04]'
                      }`}
                    >
                      {isClaimed && (
                        <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-emerald-300" />
                      )}
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                        Day {reward.day}
                      </p>
                      <p className="mt-1 text-sm font-black text-white sm:mt-3 sm:text-lg">
                        {reward.kind === 'free-pull'
                          ? 'Free'
                          : reward.kind === 'gem'
                            ? '🔥'
                            : '+'}
                      </p>
                      <p className="mt-1 truncate text-[9px] font-black text-orange-100 sm:text-[11px]">
                        {reward.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hud-panel hud-corners h-full rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="hud-label text-sm">Daily Quest</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">Claimable Missions</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Compact mission grid aligned with the Player Level hub.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10">
              <Target className="h-7 w-7 text-cyan-300" />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                Opened
              </p>
              <p className="mt-1 text-xl font-black text-white">
                {questStats.openPacks.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] p-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                Done
              </p>
              <p className="mt-1 text-xl font-black text-emerald-300">
                {completedQuestCount} / {questDefinitions.length}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                Value
              </p>
              <p className="mt-1 text-xl font-black text-amber-300">
                {vaultValue.toLocaleString()}
              </p>
            </div>
          </div>

          {renderQuestMissionCards()}
        </motion.div>
      </div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <MonthlyLeaderboardSection
          currentPlayerScore={currentPlayerScore}
          transactionCount={transactions.length}
        />
      </motion.div>
    </section>
  );
}
