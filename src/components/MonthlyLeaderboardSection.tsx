import { useMemo, useState } from "react";
import {
  Award,
  Clock3,
  Crown,
  Medal,
  Star,
  Trophy,
} from "lucide-react";

type LeaderboardUser = {
  id: number;
  name: string;
  avatar: string;
  points: number;
  isCurrentPlayer?: boolean;
};

type RankedLeaderboardUser = LeaderboardUser & {
  rank: number;
};

type MonthlyLeaderboardSectionProps = {
  currentPlayerScore?: number;
  transactionCount?: number;
};

const avatarUrl = (seed: string, backgroundColor = "0f172a") => {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
    seed,
  )}&radius=50&backgroundColor=${backgroundColor}`;
};

const currentMonthBaseData: LeaderboardUser[] = [
  {
    id: 1,
    name: "diem",
    avatar: avatarUrl("diem champion black gold anime", "facc15"),
    points: 3400000,
  },
  {
    id: 2,
    name: "callitothegreat",
    avatar: avatarUrl("callitothegreat silver blue anime", "93c5fd"),
    points: 1700000,
  },
  {
    id: 3,
    name: "autumnwind",
    avatar: avatarUrl("autumnwind bronze pink gamer", "fb923c"),
    points: 1600000,
  },
  {
    id: 4,
    name: "agilenostalgia6712",
    avatar: avatarUrl("agilenostalgia emerald hunter", "5eead4"),
    points: 1411320,
  },
  {
    id: 5,
    name: "powerfulsiren8737",
    avatar: avatarUrl("powerfulsiren purple mage", "c084fc"),
    points: 1199950,
  },
  {
    id: 6,
    name: "pullpapi_rizz",
    avatar: avatarUrl("pullpapi blue collector", "38bdf8"),
    points: 1073315,
  },
  {
    id: 7,
    name: "emeraldspace6239",
    avatar: avatarUrl("emeraldspace green rogue", "86efac"),
    points: 971217,
  },
  {
    id: 8,
    name: "foilfanatic_88",
    avatar: avatarUrl("foilfanatic neon phantom", "f0abfc"),
    points: 842410,
  },
  {
    id: 9,
    name: "cardmasterx",
    avatar: avatarUrl("cardmasterx cyan legend", "7dd3fc"),
    points: 763884,
  },
  {
    id: 10,
    name: "tcg_legend27",
    avatar: avatarUrl("tcg legend navy star", "60a5fa"),
    points: 685742,
  },
];

const previousMonthBaseData: LeaderboardUser[] = [
  {
    id: 1,
    name: "KaiTanVault",
    avatar: avatarUrl("kaitan vault king", "fde68a"),
    points: 2980000,
  },
  {
    id: 2,
    name: "SEAChaser",
    avatar: avatarUrl("sea chaser silver", "bfdbfe"),
    points: 1830000,
  },
  {
    id: 3,
    name: "JomCollector",
    avatar: avatarUrl("jom collector bronze", "fdba74"),
    points: 1510000,
  },
  {
    id: 4,
    name: "VaultRider",
    avatar: avatarUrl("vault rider", "a7f3d0"),
    points: 1244000,
  },
  {
    id: 5,
    name: "LuckyBurst",
    avatar: avatarUrl("lucky burst", "f9a8d4"),
    points: 1132900,
  },
  {
    id: 6,
    name: "RareHunterX",
    avatar: avatarUrl("rare hunter x", "c4b5fd"),
    points: 958420,
  },
];

const formatCompactPoints = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return `${value}`;
};

const formatFullPoints = (value: number) => {
  return `${value.toLocaleString()} pts`;
};

const getRankCopy = (position: 1 | 2 | 3) => {
  if (position === 1) return "Champion";
  if (position === 2) return "Runner Up";
  return "Third Place";
};

function ChampionEmblem({ position }: { position: 1 | 2 | 3 }) {
  const styles =
    position === 1
      ? {
          shell: "border-yellow-200/40 bg-yellow-300/15 text-yellow-200 shadow-[0_0_35px_rgba(250,204,21,0.45)]",
          Icon: Crown,
        }
      : position === 2
        ? {
            shell: "border-sky-200/40 bg-sky-300/15 text-sky-100 shadow-[0_0_28px_rgba(125,211,252,0.35)]",
            Icon: Medal,
          }
        : {
            shell: "border-orange-200/40 bg-orange-300/15 text-orange-200 shadow-[0_0_28px_rgba(251,146,60,0.35)]",
            Icon: Award,
          };

  const Icon = styles.Icon;

  return (
    <div
      className={`absolute -top-8 left-1/2 z-20 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-2xl border backdrop-blur-xl ${styles.shell}`}
    >
      <Icon className="h-8 w-8" />
    </div>
  );
}

function TopPodiumCard({
  user,
  position,
}: {
  user: RankedLeaderboardUser;
  position: 1 | 2 | 3;
}) {
  const isChampion = position === 1;

  const theme =
    position === 1
      ? {
          frame:
            "border-yellow-300/45 bg-gradient-to-b from-yellow-300/20 via-[#171105]/95 to-black/85 shadow-[0_0_75px_rgba(250,204,21,0.35)]",
          avatarRing:
            "border-yellow-200 bg-yellow-300/10 shadow-[0_0_65px_rgba(250,204,21,0.55)]",
          badge:
            "border-yellow-200/50 bg-yellow-300 text-black shadow-[0_0_38px_rgba(250,204,21,0.45)]",
          text: "text-yellow-200",
          score: "text-yellow-300",
          glow: "from-yellow-300/35 via-yellow-500/10 to-transparent",
          podiumHeight: "min-h-[305px]",
          avatarSize: "h-32 w-32 md:h-36 md:w-36",
        }
      : position === 2
        ? {
            frame:
              "border-sky-300/35 bg-gradient-to-b from-sky-300/16 via-[#081322]/95 to-black/80 shadow-[0_0_60px_rgba(56,189,248,0.24)]",
            avatarRing:
              "border-sky-200 bg-sky-300/10 shadow-[0_0_48px_rgba(125,211,252,0.38)]",
            badge:
              "border-sky-100/50 bg-sky-300 text-[#06111d] shadow-[0_0_30px_rgba(125,211,252,0.4)]",
            text: "text-sky-200",
            score: "text-sky-200",
            glow: "from-sky-300/25 via-cyan-500/10 to-transparent",
            podiumHeight: "min-h-[255px]",
            avatarSize: "h-28 w-28 md:h-32 md:w-32",
          }
        : {
            frame:
              "border-orange-300/35 bg-gradient-to-b from-orange-300/16 via-[#1b0b08]/95 to-black/80 shadow-[0_0_60px_rgba(251,146,60,0.22)]",
            avatarRing:
              "border-orange-200 bg-orange-300/10 shadow-[0_0_48px_rgba(251,146,60,0.38)]",
            badge:
              "border-orange-100/50 bg-orange-300 text-[#1a0b05] shadow-[0_0_30px_rgba(251,146,60,0.4)]",
            text: "text-orange-200",
            score: "text-orange-200",
            glow: "from-orange-300/25 via-red-500/10 to-transparent",
            podiumHeight: "min-h-[235px]",
            avatarSize: "h-28 w-28 md:h-32 md:w-32",
          };

  return (
    <div
      className={`relative flex h-full flex-col justify-end ${
        isChampion ? "md:-mt-10" : "md:mt-10"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-4 top-8 h-44 rounded-full bg-gradient-radial ${theme.glow} blur-3xl`}
      />

      <div className="relative z-20 mx-auto mb-4">
        <div
          className={`relative rounded-full border-2 p-1.5 ${theme.avatarRing} ${theme.avatarSize}`}
        >
          <div className="absolute inset-[-14px] rounded-full border border-white/10" />
          <img
            src={user.avatar}
            alt={user.name}
            className="h-full w-full rounded-full object-cover"
          />

          <div className={`absolute -bottom-5 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-2xl border-2 text-2xl font-black ${theme.badge}`}>
            {position}
          </div>
        </div>
      </div>

      <div
        className={`relative overflow-hidden rounded-[2rem] border px-5 pb-6 pt-10 text-center ${theme.frame} ${theme.podiumHeight}`}
      >
        <ChampionEmblem position={position} />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_28%,rgba(255,255,255,0.04)_55%,transparent)]" />

        <div className="relative z-10 mt-4">
          <p className={`text-[10px] font-black uppercase tracking-[0.28em] ${theme.text}`}>
            {getRankCopy(position)}
          </p>

          <h3 className="mt-3 truncate text-2xl font-black text-white">
            {user.name}
          </h3>

          <p className={`mt-1 text-sm font-black ${theme.text}`}>
            {position === 1 ? "1st" : position === 2 ? "2nd" : "3rd"}
          </p>

          <div className="mx-auto mt-5 flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-5 py-3 backdrop-blur">
            <Trophy className={`h-6 w-6 ${theme.score}`} />
            <span className={`text-3xl font-black ${theme.score}`}>
              {formatCompactPoints(user.points)}
            </span>
          </div>

          {isChampion && (
            <div className="mt-5 flex justify-center gap-1.5 text-yellow-200">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MonthlyLeaderboardSection({
  currentPlayerScore = 0,
  transactionCount = 0,
}: MonthlyLeaderboardSectionProps) {
  const [mode, setMode] = useState<"current" | "previous">("current");

  const data = useMemo<RankedLeaderboardUser[]>(() => {
    const currentPlayer: LeaderboardUser = {
      id: 99,
      name: "Paul",
      avatar: avatarUrl("paul sea card boss", "67e8f9"),
      points: Math.max(currentPlayerScore * 32850, currentPlayerScore),
      isCurrentPlayer: true,
    };

    const source = mode === "current" ? currentMonthBaseData : previousMonthBaseData;

    return [...source, currentPlayer]
      .sort((first, second) => second.points - first.points)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  }, [currentPlayerScore, mode]);

  const top1 = data.find((entry) => entry.rank === 1) ?? data[0];
  const top2 = data.find((entry) => entry.rank === 2) ?? data[1];
  const top3 = data.find((entry) => entry.rank === 3) ?? data[2];
  const rest = data.filter((entry) => entry.rank >= 4).slice(0, 7);

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-cyan-300/20 bg-[#030814]/90 p-4 shadow-[0_35px_140px_rgba(0,0,0,0.38)] md:rounded-[2.5rem] md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(250,204,21,0.12),transparent_28%),radial-gradient(circle_at_18%_32%,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_80%_32%,rgba(251,146,60,0.10),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(34,211,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.18)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

      <div className="relative z-10 text-center">
        <div className="inline-flex items-center gap-3">
          <span className="h-px w-12 bg-cyan-300/50" />
          <p className="text-sm font-black uppercase tracking-[0.42em] text-cyan-300">
            Monthly Ranking
          </p>
          <span className="h-px w-12 bg-cyan-300/50" />
        </div>

        <h3 className="mt-3 text-3xl font-black tracking-tight text-white md:text-5xl">
          Monthly Leaderboard
        </h3>

        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-2 text-xs text-slate-300 backdrop-blur sm:px-5 sm:py-2.5 sm:text-sm">
          <Clock3 className="h-4 w-4" />
          <span>
            Resets <span className="font-black text-white">Wed, Jul 1 at 8AM (GMT+8)</span>
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-6 grid gap-3 md:hidden">
        {[top1, top2, top3].filter((entry): entry is RankedLeaderboardUser => Boolean(entry)).map((entry) => (
          <div
            key={`mobile-top-${entry.id}`}
            className={`flex items-center gap-3 rounded-2xl border p-3 ${
              entry.rank === 1
                ? "border-yellow-300/35 bg-yellow-300/10"
                : entry.rank === 2
                  ? "border-sky-300/25 bg-sky-300/10"
                  : "border-orange-300/25 bg-orange-300/10"
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-black/35 text-lg font-black text-white">
              #{entry.rank}
            </div>
            <img
              src={entry.avatar}
              alt={entry.name}
              loading="lazy"
              className="h-12 w-12 shrink-0 rounded-full border border-white/15 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-white">{entry.name}</p>
              <p className="text-xs text-slate-400">
                {entry.rank === 1 ? "Champion" : entry.rank === 2 ? "Runner Up" : "Third Place"}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm font-black text-amber-200">
              <Trophy className="h-4 w-4" />
              {formatCompactPoints(entry.points)}
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-16 hidden items-end gap-5 md:grid md:grid-cols-[1fr_1.16fr_1fr]">
        {top2 && <TopPodiumCard user={top2} position={2} />}
        {top1 && <TopPodiumCard user={top1} position={1} />}
        {top3 && <TopPodiumCard user={top3} position={3} />}
      </div>

      <div className="relative z-10 mt-5 overflow-hidden rounded-[1.35rem] border border-cyan-300/18 bg-black/35 p-2.5 shadow-[inset_0_0_28px_rgba(34,211,238,0.08)] sm:mt-7 sm:rounded-[1.8rem] sm:p-3">
        <div className="mb-3 flex justify-end">
          <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-1">
            <button
              type="button"
              onClick={() => setMode("current")}
              className={`rounded-xl px-4 py-2 text-xs font-black transition ${
                mode === "current"
                  ? "bg-cyan-300 text-black shadow-[0_0_22px_rgba(34,211,238,0.28)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Current Month
            </button>
            <button
              type="button"
              onClick={() => setMode("previous")}
              className={`rounded-xl px-4 py-2 text-xs font-black transition ${
                mode === "previous"
                  ? "bg-cyan-300 text-black shadow-[0_0_22px_rgba(34,211,238,0.28)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Previous Month
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {rest.map((entry) => (
            <div
              key={`${entry.id}-${entry.name}`}
              className={`grid grid-cols-[30px_36px_minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border px-3 py-2.5 transition hover:bg-white/[0.055] sm:grid-cols-[42px_44px_minmax(0,1fr)_auto] sm:gap-3 sm:px-4 sm:py-3 ${
                entry.isCurrentPlayer
                  ? "border-cyan-300/40 bg-cyan-300/12"
                  : "border-white/6 bg-white/[0.025]"
              }`}
            >
              <div className="text-lg font-black text-cyan-300">
                {entry.rank}
              </div>

              <div className="h-8 w-8 rounded-full border border-cyan-300/20 bg-white/5 p-0.5 shadow-[0_0_16px_rgba(34,211,238,0.12)] sm:h-10 sm:w-10">
                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-black text-white md:text-base">
                    {entry.name}
                  </p>
                  {entry.isCurrentPlayer && (
                    <span className="rounded-full bg-cyan-300 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-black">
                      You
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-right text-sm font-black text-cyan-200 md:text-base">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">{formatFullPoints(entry.points)}</span><span className="sm:hidden">{formatCompactPoints(entry.points)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="relative z-10 mt-4 text-center text-xs text-slate-600">
        Demo logic · {transactionCount} activity records tracked locally.
      </p>
    </section>
  );
}
