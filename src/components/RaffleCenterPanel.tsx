import {
  CalendarDays,
  Gift,
  Send,
  Sparkles,
  Ticket,
  Trophy,
} from 'lucide-react'

import { translations, type AppLanguage, type Translation } from '../lib/i18n'

export type RaffleEntry = {
  id: string
  prizeId: string
  prizeName: string
  tickets: number
  createdAt: string
  status: 'Entered' | 'Winner Pending' | 'Winner Selected'
}

export type RaffleWinner = {
  id: string
  prizeId: string
  prizeName: string
  winnerName: string
  winningEntryId: string
  tickets: number
  drawnAt: string
  status: 'Winner Selected'
}

export type RafflePrize = {
  id: string
  name: string
  category: string
  description: string
  prizeValue: string
  endsIn: string
  accent: string
}

type RaffleCenterPanelProps = {
  language: AppLanguage
  ticketBalance: number
  entries: RaffleEntry[]
  winners?: RaffleWinner[]
  onEnterRaffle: (prize: RafflePrize, tickets: number) => void
}

const rafflePrizes: RafflePrize[] = [
  {
    id: 'secret-rare-mystery-slab',
    name: 'Secret Rare Mystery Slab',
    category: 'Grand Prize',
    description: 'Premium chase reward for high-value collectors.',
    prizeValue: 'Grand Prize',
    endsIn: '3 days',
    accent: 'from-purple-400 to-pink-500',
  },
  {
    id: 'creator-drop-box',
    name: 'Premium Creator Drop Box',
    category: 'Creator Event',
    description: 'SEA creator-themed pack bundle.',
    prizeValue: 'Creator Prize',
    endsIn: '5 days',
    accent: 'from-cyan-300 to-emerald-400',
  },
  {
    id: 'points-reward-5000',
    name: '5,000 Points Reward',
    category: 'Wallet Boost',
    description: 'Point reward for future pack openings.',
    prizeValue: '5,000 pts',
    endsIn: '7 days',
    accent: 'from-amber-300 to-orange-500',
  },
]

const getShortId = (value: string | undefined, fallback = 'legacy-id') => {
  if (!value || typeof value !== 'string') return fallback

  return value.slice(0, 12)
}

function getEntriesForPrize(entries: RaffleEntry[], prizeId: string) {
  return entries
    .filter((entry) => entry.prizeId === prizeId)
    .reduce((total, entry) => total + entry.tickets, 0)
}

function getLocalizedRaffleStatus(status: RaffleEntry['status'] | RaffleWinner['status'], t: Translation) {
  if (status === 'Entered') return t.raffleStatusEntered
  if (status === 'Winner Pending') return t.raffleStatusWinnerPending
  if (status === 'Winner Selected') return t.raffleStatusWinnerSelected

  return status
}

function getLocalizedRaffleEndsIn(value: string, t: Translation) {
  const dayMatch = value.match(/^(\d+)\s+days?$/i)
  if (!dayMatch) return value

  return `${dayMatch[1]} ${t.daysLeft}`
}

function localizeRafflePrize(prize: RafflePrize, t: Translation): RafflePrize {
  if (prize.id === 'secret-rare-mystery-slab') {
    return {
      ...prize,
      name: t.rafflePrizeSecretName,
      category: t.rafflePrizeSecretCategory,
      description: t.rafflePrizeSecretDescription,
      prizeValue: t.rafflePrizeSecretValue,
    }
  }

  if (prize.id === 'creator-drop-box') {
    return {
      ...prize,
      name: t.rafflePrizeCreatorName,
      category: t.rafflePrizeCreatorCategory,
      description: t.rafflePrizeCreatorDescription,
      prizeValue: t.rafflePrizeCreatorValue,
    }
  }

  return {
    ...prize,
    name: t.rafflePrizePointsName,
    category: t.rafflePrizePointsCategory,
    description: t.rafflePrizePointsDescription,
    prizeValue: `5,000 ${t.pointsShort}`,
  }
}

export default function RaffleCenterPanel({
  language,
  ticketBalance,
  entries,
  winners = [],
  onEnterRaffle,
}: RaffleCenterPanelProps) {
  const t = translations[language]
  const localizedPrizes = rafflePrizes.map((prize) => localizeRafflePrize(prize, t))
  const totalTicketsEntered = entries.reduce(
    (total, entry) => total + entry.tickets,
    0,
  )

  const latestWinner = winners[0]
  const entryOptions = [1, 5, 10]

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-5 sm:py-8 lg:px-8">
      <div
        className="rounded-[1.45rem] border border-cyan-300/18 bg-[#061120]/94 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.28)] sm:rounded-[2rem] sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <Ticket className="h-4 w-4 text-amber-300 sm:h-5 sm:w-5" />
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-300 sm:text-xs">
                {t.raffleCenter}
              </p>
            </div>

            <h2 className="text-2xl font-black leading-tight text-white sm:text-4xl">
              {t.weeklyPrizePool}
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
              {t.weeklyPrizeSubtitle}
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">
            {t.weekly}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 sm:p-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-amber-200/80 sm:text-[10px]">
              {t.tickets}
            </p>
            <p className="mt-1 text-xl font-black text-amber-300 sm:text-3xl">
              {ticketBalance}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-300/20 bg-purple-300/10 p-3 sm:p-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-purple-200/80 sm:text-[10px]">
              {t.entries}
            </p>
            <p className="mt-1 text-xl font-black text-purple-300 sm:text-3xl">
              {totalTicketsEntered}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 sm:p-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-200/80 sm:text-[10px]">
              {t.winners}
            </p>
            <p className="mt-1 text-xl font-black text-emerald-300 sm:text-3xl">
              {winners.length}
            </p>
          </div>
        </div>

        {latestWinner && (
          <div className="mt-4 rounded-[1.25rem] border border-emerald-300/20 bg-emerald-300/[0.06] p-3 sm:rounded-[2rem] sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-emerald-300" />
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">
                    {t.latestWinner}
                  </p>
                </div>
                <h3 className="truncate text-base font-black text-white sm:text-2xl">
                  {latestWinner.winnerName}
                </h3>
                <p className="mt-1 line-clamp-1 text-xs text-slate-300 sm:text-sm">
                  {t.won} <span className="font-black text-emerald-300">{latestWinner.prizeName}</span>
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-black text-emerald-200">
                {getShortId(latestWinner.winningEntryId)}
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">
              {t.availablePrizes}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {t.pickRewardFast}
            </p>
          </div>

          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black text-cyan-200">
            {localizedPrizes.length} {t.live}
          </span>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {localizedPrizes.map((prize) => {
            const enteredTickets = getEntriesForPrize(entries, prize.id)

            return (
              <article
                key={prize.id}
                className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-3 shadow-[0_18px_55px_rgba(0,0,0,0.22)] sm:rounded-[1.7rem] sm:p-4"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${prize.accent} opacity-10`}
                />

                <div className="relative z-10">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${prize.accent} p-[1px]`}
                      >
                        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-black/80">
                          <Gift className="h-7 w-7 text-white" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.16em] text-cyan-200">
                            {prize.category}
                          </span>
                          <span className="flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-amber-200">
                            <CalendarDays className="h-2.5 w-2.5" />
                            {getLocalizedRaffleEndsIn(prize.endsIn, t)}
                          </span>
                        </div>

                        <h3 className="line-clamp-2 text-base font-black leading-tight text-white sm:text-lg">
                          {prize.name}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-[11px] leading-4 text-slate-400 sm:text-xs">
                          {prize.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] px-3 py-2">
                      <p className="text-[8px] uppercase tracking-[0.18em] text-slate-500">
                        {t.prize}
                      </p>
                      <p className="mt-0.5 truncate text-xs font-black text-cyan-200">
                        {prize.prizeValue}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] px-3 py-2">
                      <p className="text-[8px] uppercase tracking-[0.18em] text-slate-500">
                        {t.entries}
                      </p>
                      <p className="mt-0.5 text-xs font-black text-purple-200">
                        {enteredTickets} {t.ticketUnit}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {entryOptions.map((ticketAmount) => {
                      const disabled = ticketBalance < ticketAmount

                      return (
                        <button
                          key={`${prize.id}-${ticketAmount}`}
                          type="button"
                          disabled={disabled}
                          onClick={() => onEnterRaffle(prize, ticketAmount)}
                          className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-black uppercase tracking-wider transition sm:py-2.5 ${
                            disabled
                              ? 'cursor-not-allowed border border-slate-700 bg-slate-900/80 text-slate-600'
                              : 'border border-amber-300/30 bg-amber-300/10 text-amber-200 hover:scale-[1.02] hover:bg-amber-300/20'
                          }`}
                        >
                          <Send className="h-3.5 w-3.5" />
                          {ticketAmount}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-3 sm:mt-6 sm:p-5">
          <div className="mb-2 flex items-center gap-2 sm:mb-3">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300 sm:text-xs">
              {t.ticketRules}
            </p>
          </div>

          <div className="space-y-1 text-[11px] leading-5 text-slate-300 sm:grid sm:grid-cols-3 sm:gap-3 sm:space-y-0 sm:text-sm">
            <p>{t.ticketRule1}</p>
            <p>{t.ticketRule2}</p>
            <p>{t.ticketRule3}</p>
          </div>
        </div>

        {entries.length > 0 && (
          <div className="mt-4 rounded-2xl border border-purple-300/15 bg-purple-300/[0.04] p-3 sm:mt-6 sm:p-5">
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <Trophy className="h-4 w-4 text-purple-300" />
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-300 sm:text-xs">
                {t.recentEntries}
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {entries.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-purple-300/10 bg-black/20 p-3 sm:p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-white sm:text-base">
                      {entry.prizeName}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-slate-400 sm:text-xs">
                      {entry.createdAt} · {getLocalizedRaffleStatus(entry.status, t)}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-black text-amber-200">
                    {entry.tickets} {t.ticketUnit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {winners.length > 0 && (
          <div className="mt-4 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-3 sm:mt-6 sm:p-5">
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <Trophy className="h-4 w-4 text-emerald-300" />
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300 sm:text-xs">
                {t.winnerHistory}
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {winners.slice(0, 5).map((winner) => (
                <div
                  key={winner.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-300/10 bg-black/20 p-3 sm:p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-white sm:text-base">
                      {winner.winnerName} {t.won} {winner.prizeName}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-slate-400 sm:text-xs">
                      {winner.drawnAt} · {t.entry} {getShortId(winner.winningEntryId)}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200">
                    {winner.tickets} {t.ticketUnit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
