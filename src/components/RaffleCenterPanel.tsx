import { motion } from 'framer-motion'
import {
  CalendarDays,
  Gift,
  Send,
  Sparkles,
  Ticket,
  Trophy,
} from 'lucide-react'

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
    description: 'Premium slab-style chase reward for high-value collectors.',
    prizeValue: 'Grand Prize',
    endsIn: '3 days',
    accent: 'from-purple-400 to-pink-500',
  },
  {
    id: 'creator-drop-box',
    name: 'Premium Creator Drop Box',
    category: 'Creator Event',
    description: 'SEA creator-themed pack bundle for community drops.',
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

export default function RaffleCenterPanel({
  ticketBalance,
  entries,
  winners = [],
  onEnterRaffle,
}: RaffleCenterPanelProps) {
  const totalTicketsEntered = entries.reduce(
    (total, entry) => total + entry.tickets,
    0,
  )

  const latestWinner = winners[0]
  const entryOptions = [1, 5, 10]

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-5 sm:py-8 lg:px-8">
      <motion.div
        className="rounded-[1.5rem] border border-cyan-300/18 bg-[#061120]/94 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.28)] sm:rounded-[2rem] sm:p-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-amber-300 sm:h-5 sm:w-5" />
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-300 sm:text-xs">
                Raffle Center
              </p>
            </div>

            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">
              Weekly
            </span>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black leading-tight text-white sm:text-4xl">
                Weekly Prize Pool
              </h2>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                Use tickets to enter weekly prize draws.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-right sm:block">
              <p className="text-[10px] uppercase tracking-[0.25em] text-amber-200">
                Tickets
              </p>
              <p className="mt-1 text-2xl font-black text-amber-300">
                {ticketBalance}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden">
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3">
              <p className="text-[9px] uppercase tracking-[0.2em] text-amber-200/80">
                Tickets
              </p>
              <p className="mt-1 text-xl font-black text-amber-300">
                {ticketBalance}
              </p>
            </div>

            <div className="rounded-2xl border border-purple-300/20 bg-purple-300/10 p-3">
              <p className="text-[9px] uppercase tracking-[0.2em] text-purple-200/80">
                Entries
              </p>
              <p className="mt-1 text-xl font-black text-purple-300">
                {totalTicketsEntered}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3">
              <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-200/80">
                Winners
              </p>
              <p className="mt-1 text-xl font-black text-emerald-300">
                {winners.length}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden gap-3 sm:mb-6 sm:grid sm:grid-cols-3">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-amber-200">
              Your Tickets
            </p>
            <p className="mt-2 text-3xl font-black text-amber-300">
              {ticketBalance}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-300/20 bg-purple-300/10 p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-purple-200">
              Entries
            </p>
            <p className="mt-2 text-3xl font-black text-purple-300">
              {totalTicketsEntered}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-200">
              Winners
            </p>
            <p className="mt-2 text-3xl font-black text-emerald-300">
              {winners.length}
            </p>
          </div>
        </div>

        {latestWinner && (
          <div className="mb-4 rounded-[1.25rem] border border-emerald-300/20 bg-emerald-300/[0.06] p-4 sm:mb-6 sm:rounded-[2rem] sm:p-5">
            <div className="mb-2 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-300 sm:h-5 sm:w-5" />
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300 sm:text-xs">
                Latest Winner
              </p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-black text-white sm:text-2xl">
                  {latestWinner.winnerName}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-300 sm:text-sm">
                  Won <span className="font-black text-emerald-300">{latestWinner.prizeName}</span>.
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-black text-emerald-200">
                {getShortId(latestWinner.winningEntryId)}
              </span>
            </div>
          </div>
        )}

        <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
          {rafflePrizes.map((prize) => {
            const enteredTickets = getEntriesForPrize(entries, prize.id)

            return (
              <article
                key={prize.id}
                className="relative w-[260px] shrink-0 snap-start overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-3 sm:w-auto sm:rounded-[2rem] sm:p-5"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${prize.accent} opacity-10`}
                />

                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-between gap-2 sm:mb-5">
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-cyan-200 sm:px-3 sm:py-1.5 sm:text-[10px]">
                      {prize.category}
                    </span>

                    <span className="flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-amber-200 sm:px-3 sm:py-1.5 sm:text-[10px]">
                      <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {prize.endsIn}
                    </span>
                  </div>

                  <div
                    className={`mb-3 flex h-20 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${prize.accent} p-[1px] sm:mb-5 sm:h-36 sm:rounded-3xl`}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-black/80 sm:rounded-3xl">
                      <Gift className="h-9 w-9 text-white sm:h-16 sm:w-16" />
                    </div>
                  </div>

                  <h3 className="line-clamp-2 min-h-[2.5rem] text-lg font-black leading-tight text-white sm:text-2xl">
                    {prize.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400 sm:mt-3 sm:text-sm sm:leading-6">
                    {prize.description}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-2.5 sm:p-3">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:text-[10px]">
                        Prize
                      </p>
                      <p className="mt-1 text-xs font-black text-cyan-200 sm:text-sm">
                        {prize.prizeValue}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-2.5 sm:p-3">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:text-[10px]">
                        Entries
                      </p>
                      <p className="mt-1 text-xs font-black text-purple-200 sm:text-sm">
                        {enteredTickets} tickets
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-5">
                    {entryOptions.map((ticketAmount) => {
                      const disabled = ticketBalance < ticketAmount

                      return (
                        <button
                          key={`${prize.id}-${ticketAmount}`}
                          type="button"
                          disabled={disabled}
                          onClick={() => onEnterRaffle(prize, ticketAmount)}
                          className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-xs font-black uppercase tracking-wider transition sm:px-3 sm:py-3 ${
                            disabled
                              ? 'cursor-not-allowed border border-slate-600 bg-slate-800 text-slate-500'
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

        <div className="mt-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4 sm:mt-6 sm:p-5">
          <div className="mb-2 flex items-center gap-2 sm:mb-3">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300 sm:text-xs">
              Ticket Rules
            </p>
          </div>

          <div className="space-y-1.5 text-xs leading-5 text-slate-300 sm:grid sm:grid-cols-3 sm:gap-3 sm:space-y-0 sm:text-sm">
            <p>Open 1 = +1 ticket · Open 10 = +10</p>
            <p>Open 100 = +120 · Sell Back = +1</p>
            <p>Shipping = +3 · Quest Claim = +2</p>
          </div>
        </div>

        {entries.length > 0 && (
          <div className="mt-4 rounded-2xl border border-purple-300/15 bg-purple-300/[0.04] p-4 sm:mt-6 sm:p-5">
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <Trophy className="h-4 w-4 text-purple-300" />
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-300 sm:text-xs">
                Recent Entries
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
                      {entry.createdAt} · {entry.status}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-black text-amber-200">
                    {entry.tickets}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {winners.length > 0 && (
          <div className="mt-4 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-4 sm:mt-6 sm:p-5">
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <Trophy className="h-4 w-4 text-emerald-300" />
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300 sm:text-xs">
                Winner History
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
                      {winner.winnerName} won {winner.prizeName}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-slate-400 sm:text-xs">
                      {winner.drawnAt} · Entry {getShortId(winner.winningEntryId)}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200">
                    {winner.tickets}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  )
}
