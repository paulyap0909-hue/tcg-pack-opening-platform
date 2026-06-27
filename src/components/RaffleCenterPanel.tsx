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
    category: 'Weekly Grand Prize',
    description:
      'A premium slab-style chase reward designed for high-value collectors.',
    prizeValue: 'Grand Prize',
    endsIn: '3 days',
    accent: 'from-purple-400 to-pink-500',
  },
  {
    id: 'creator-drop-box',
    name: 'Premium Creator Drop Box',
    category: 'Creator Event',
    description:
      'A SEA creator-themed pack bundle for community-driven drops.',
    prizeValue: 'Creator Prize',
    endsIn: '5 days',
    accent: 'from-cyan-300 to-emerald-400',
  },
  {
    id: 'points-reward-5000',
    name: '5,000 Points Reward',
    category: 'Wallet Boost',
    description:
      'A point-based raffle reward that can be used for future pack openings.',
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
    <section className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">
      <motion.div
        className="hud-panel hud-corners rounded-[2rem] p-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Ticket className="h-5 w-5 text-amber-300" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-300">
                Raffle Center
              </p>
            </div>

            <h2 className="text-4xl font-black text-white">
              Weekly Prize Pool
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Earn raffle tickets from pack openings, quests, sell back, top up,
              and shipping requests. Use tickets to enter weekly prize draws.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
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
        </div>

        {latestWinner && (
          <div className="mb-6 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/[0.06] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-emerald-300" />
              <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
                Latest Winner
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_0.8fr] md:items-center">
              <div>
                <h3 className="text-2xl font-black text-white">
                  {latestWinner.winnerName}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Won <span className="font-black text-emerald-300">{latestWinner.prizeName}</span> with entry {getShortId(latestWinner.winningEntryId)}.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-300/10 bg-black/25 p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Draw Time
                </p>
                <p className="mt-2 text-sm font-bold text-slate-200">
                  {latestWinner.drawnAt}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-3">
          {rafflePrizes.map((prize) => {
            const enteredTickets = getEntriesForPrize(entries, prize.id)

            return (
              <article
                key={prize.id}
                className="hud-card hud-corners relative overflow-hidden rounded-[2rem] p-5"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${prize.accent} opacity-10`}
                />

                <div className="relative z-10">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">
                      {prize.category}
                    </span>

                    <span className="flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {prize.endsIn}
                    </span>
                  </div>

                  <div
                    className={`mb-5 flex h-36 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br ${prize.accent} p-[1px]`}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-3xl bg-black/80">
                      <Gift className="h-16 w-16 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white">
                    {prize.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {prize.description}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Prize
                      </p>
                      <p className="mt-1 text-sm font-black text-cyan-200">
                        {prize.prizeValue}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-3">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Your Entries
                      </p>
                      <p className="mt-1 text-sm font-black text-purple-200">
                        {enteredTickets} tickets
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {entryOptions.map((ticketAmount) => {
                      const disabled = ticketBalance < ticketAmount

                      return (
                        <button
                          key={`${prize.id}-${ticketAmount}`}
                          type="button"
                          disabled={disabled}
                          onClick={() => onEnterRaffle(prize, ticketAmount)}
                          className={`flex items-center justify-center gap-1 rounded-xl px-3 py-3 text-xs font-black uppercase tracking-wider transition ${
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

        <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
              Ticket Rules
            </p>
          </div>

          <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-3">
            <p>Open 1 = +1 ticket · Open 10 = +10 tickets</p>
            <p>Open 100 = +120 tickets · Sell Back = +1 ticket</p>
            <p>Shipping Request = +3 tickets · Quest Claim = +2 tickets</p>
          </div>
        </div>

        {entries.length > 0 && (
          <div className="mt-6 rounded-2xl border border-purple-300/15 bg-purple-300/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-purple-300" />
              <p className="text-xs uppercase tracking-[0.28em] text-purple-300">
                Recent Raffle Entries
              </p>
            </div>

            <div className="space-y-3">
              {entries.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col gap-2 rounded-2xl border border-purple-300/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-black text-white">{entry.prizeName}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {entry.createdAt} · {entry.status}
                    </p>
                  </div>

                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-black text-amber-200">
                    {entry.tickets} tickets
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {winners.length > 0 && (
          <div className="mt-6 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-300" />
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">
                Winner History
              </p>
            </div>

            <div className="space-y-3">
              {winners.slice(0, 5).map((winner) => (
                <div
                  key={winner.id}
                  className="flex flex-col gap-2 rounded-2xl border border-emerald-300/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-black text-white">
                      {winner.winnerName} won {winner.prizeName}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {winner.drawnAt} · Entry {getShortId(winner.winningEntryId)}
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200">
                    {winner.tickets} tickets
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
