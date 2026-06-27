import { motion } from 'framer-motion'
import { Activity, Crown, Radio, ShieldCheck, Sparkles, Trophy, Zap } from 'lucide-react'

const livePulls = [
  {
    user: 'Player_092',
    action: 'pulled',
    card: 'Secret Rare Thunder Dragon',
    pack: 'Electric Chase Pack',
    rarity: 'SECRET RARE',
    time: '12s ago',
  },
  {
    user: 'VaultHunter',
    action: 'opened',
    card: 'Pirate King Wanted Card',
    pack: 'Pirate Treasure Drop',
    rarity: 'SUPER RARE',
    time: '28s ago',
  },
  {
    user: 'NeoCollector',
    action: 'vaulted',
    card: 'Mystic Energy Collector Card',
    pack: 'Secret Rare Vault',
    rarity: 'RARE',
    time: '43s ago',
  },
  {
    user: 'CyberPuller',
    action: 'hit',
    card: 'Gold Chase Card',
    pack: 'Secret Rare Vault',
    rarity: 'CHASE HIT',
    time: '1m ago',
  },
  {
    user: 'TCG_Runner',
    action: 'revealed',
    card: 'Limited Vault Card',
    pack: 'Electric Chase Pack',
    rarity: 'LIMITED',
    time: '2m ago',
  },
]

const topChasePulls = [
  {
    rank: '#01',
    card: 'Gold Chase Card',
    pack: 'Secret Rare Vault',
    value: 'Top Hit',
  },
  {
    rank: '#02',
    card: 'Secret Rare Thunder Dragon',
    pack: 'Electric Chase Pack',
    value: 'High Demand',
  },
  {
    rank: '#03',
    card: 'Pirate King Wanted Card',
    pack: 'Pirate Treasure Drop',
    value: 'Limited Drop',
  },
  {
    rank: '#04',
    card: 'Mystic Energy Collector Card',
    pack: 'Secret Rare Vault',
    value: 'Vault Pick',
  },
]

const vaultActivities = [
  '18 cards stored into vault today',
  '7 shipping requests submitted',
  '3 chase cards pulled in the last hour',
]

export default function LivePullFeed() {
  return (
    <section id="pulls" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="hud-label text-sm">Live System Feed</p>
          <h2 className="mt-3 text-4xl font-black">Live Pull Feed</h2>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/5 px-4 py-2 text-sm text-cyan-200 md:flex">
          <Radio className="h-4 w-4 animate-pulse" />
          Live activity online
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="hud-panel hud-corners rounded-[2rem] p-6">
          <div className="mb-5 flex items-center justify-between border-b border-cyan-300/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10">
                <Activity className="h-5 w-5 text-cyan-300" />
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
                  Real-Time Pulls
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Latest opening activity from the lobby
                </p>
              </div>
            </div>

            <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-300">
              Online
            </span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-cyan-300/10 bg-black/30 py-4">
            <motion.div
              className="flex w-max gap-4 px-4"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 28,
                ease: 'linear',
                repeat: Infinity,
              }}
            >
              {[...livePulls, ...livePulls].map((pull, index) => (
                <div
                  key={`${pull.user}-${index}`}
                  className="min-w-[320px] rounded-2xl border border-cyan-300/15 bg-slate-950/80 p-4 shadow-[0_0_28px_rgba(34,211,238,0.08)]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-200">
                      {pull.rarity}
                    </span>

                    <span className="text-xs text-slate-500">{pull.time}</span>
                  </div>

                  <p className="text-sm text-slate-400">
                    <span className="font-bold text-white">{pull.user}</span>{' '}
                    {pull.action}
                  </p>

                  <p className="mt-2 text-lg font-black text-white">{pull.card}</p>

                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-cyan-300">
                    {pull.pack}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {vaultActivities.map((activity) => (
              <div
                key={activity}
                className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">
                    Vault Log
                  </p>
                </div>

                <p className="text-sm leading-6 text-slate-300">{activity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hud-panel hud-corners rounded-[2rem] p-6">
          <div className="mb-5 flex items-center gap-3 border-b border-cyan-300/10 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/30 bg-amber-300/10">
              <Trophy className="h-5 w-5 text-amber-300" />
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
                Top Chase Pulls
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Weekly reward ranking
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {topChasePulls.map((pull, index) => (
              <motion.div
                key={pull.card}
                className="group rounded-2xl border border-cyan-300/10 bg-black/35 p-4 transition hover:border-amber-300/35 hover:bg-amber-300/[0.04]"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-sm font-black text-cyan-200">
                      {pull.rank}
                    </div>

                    <div>
                      <p className="font-black text-white">{pull.card}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                        {pull.pack}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {index === 0 ? (
                      <Crown className="ml-auto h-5 w-5 text-amber-300" />
                    ) : (
                      <Zap className="ml-auto h-5 w-5 text-cyan-300" />
                    )}

                    <p className="mt-2 text-xs text-amber-300">{pull.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-purple-300/15 bg-purple-400/[0.05] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-300" />
              <p className="text-xs uppercase tracking-[0.28em] text-purple-300">
                Chase Alert
              </p>
            </div>

            <p className="text-sm leading-6 text-slate-300">
              Secret Rare Vault has only 9 packs remaining. High-chase drops are currently active in the lobby.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}