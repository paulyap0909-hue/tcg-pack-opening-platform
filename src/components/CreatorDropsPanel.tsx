import { motion } from 'framer-motion'
import {
  BadgeCheck,
  CalendarClock,
  Crown,
  Radio,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'

import type { Pack } from '../data/cardPool'

type CreatorManagedPack = Pack & {
  creatorName?: string
  creatorHandle?: string
  creatorRegion?: string
  featuredPrize?: string
  startDate?: string
  endDate?: string
  revenueShare?: string
  campaignOwner?: string
}

type CreatorDropMeta = {
  creatorName: string
  handle: string
  region: string
  audience: string
  endsIn: string
  featuredPrize: string
  revenueShare: string
  theme: string
}

type CreatorDropsPanelProps = {
  packs: CreatorManagedPack[]
  onOpenDrop: (pack: CreatorManagedPack) => void
  onViewAll: () => void
}

const creatorDropMeta: Record<string, CreatorDropMeta> = {
  'SEA Creator Mega Drop': {
    creatorName: 'JomCollector',
    handle: '@jomcollector',
    region: 'Malaysia / SG',
    audience: '42K collectors',
    endsIn: '72h left',
    featuredPrize: 'Secret Rare Thunder Dragon',
    revenueShare: 'Creator collab pool',
    theme: 'SEA community drop built for Open 100 testing.',
  },
  'Anime Vault Creator Drop': {
    creatorName: 'AnimeVault MY',
    handle: '@animevaultmy',
    region: 'Malaysia',
    audience: '18K anime fans',
    endsIn: '5 days left',
    featuredPrize: 'Pirate King Wanted Card',
    revenueShare: 'Limited collab',
    theme: 'Anime-focused pack for collectors who chase character cards.',
  },
  'Streamer Mystery Box': {
    creatorName: 'KaiTan Plays',
    handle: '@kaitanplays',
    region: 'SEA Live',
    audience: 'Live stream drop',
    endsIn: '36h left',
    featuredPrize: 'Vaulted Mystery Slab',
    revenueShare: 'Streamer drop',
    theme: 'Designed for stream events, live openings, and community raffles.',
  },
  'Collector Weekly Drop': {
    creatorName: 'CardHunter Club',
    handle: '@cardhunterclub',
    region: 'SEA Weekly',
    audience: 'Weekly collectors',
    endsIn: 'Nearly sold out',
    featuredPrize: 'Mystic Energy Collector Card',
    revenueShare: 'Weekly feature',
    theme: 'Rotating community drop with limited weekly allocation.',
  },
}

const getCreatorMeta = (pack: CreatorManagedPack): CreatorDropMeta => {
  const fallback =
    creatorDropMeta[pack.name] ?? {
      creatorName: 'SEA Creator',
      handle: '@seacreator',
      region: 'Southeast Asia',
      audience: 'Community drop',
      endsIn: 'Limited time',
      featuredPrize: 'Mystery Chase Card',
      revenueShare: 'Creator collab',
      theme: 'Creator-led limited drop for online pack opening events.',
    }

  return {
    ...fallback,
    creatorName: pack.creatorName || fallback.creatorName,
    handle: pack.creatorHandle || fallback.handle,
    region: pack.creatorRegion || fallback.region,
    endsIn: pack.endDate ? `Ends ${pack.endDate}` : fallback.endsIn,
    featuredPrize: pack.featuredPrize || fallback.featuredPrize,
    revenueShare: pack.revenueShare || fallback.revenueShare,
  }
}

const getDropStatus = (pack: CreatorManagedPack) => {
  if (pack.remainingQuantity <= 0) return 'Sold Out'
  if (pack.remainingQuantity <= 10) return 'Nearly Sold Out'
  if (pack.remainingQuantity <= 30) return 'Ends Soon'

  return pack.badge || 'Creator Drop'
}

export default function CreatorDropsPanel({
  packs,
  onOpenDrop,
  onViewAll,
}: CreatorDropsPanelProps) {
  const totalCreatorStock = packs.reduce(
    (total, pack) => total + pack.remainingQuantity,
    0,
  )

  const nearlySoldOutDrops = packs.filter(
    (pack) => pack.remainingQuantity > 0 && pack.remainingQuantity <= 10,
  ).length

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">
      <motion.div
        className="hud-panel hud-corners overflow-hidden rounded-[2rem] p-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex flex-wrap gap-3">
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-200">
                Creator Drops V1
              </span>

              <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-purple-200">
                SEA Collab Packs
              </span>
            </div>

            <p className="hud-label text-sm">Featured Creator Drops</p>
            <h2 className="mt-2 max-w-3xl text-4xl font-black leading-tight">
              Limited creator-led drops for SEA collectors.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Launch influencer packs, streamer mystery boxes, and community
              collaboration drops with limited stock, featured chase pulls, and
              future revenue-share controls.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-5 py-4 text-sm font-black uppercase tracking-wider text-emerald-200 transition hover:scale-[1.02] hover:bg-emerald-300/20"
          >
            <Radio className="h-4 w-4" />
            View All Creator Drops
          </button>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10">
              <Users className="h-5 w-5 text-emerald-300" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Active Creators
            </p>
            <p className="mt-2 text-2xl font-black text-white">
              {packs.length}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
              <Zap className="h-5 w-5 text-cyan-300" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Creator Stock
            </p>
            <p className="mt-2 text-2xl font-black text-cyan-200">
              {totalCreatorStock.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10">
              <CalendarClock className="h-5 w-5 text-amber-300" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Nearly Sold Out
            </p>
            <p className="mt-2 text-2xl font-black text-amber-300">
              {nearlySoldOutDrops}
            </p>
          </div>
        </div>

        {packs.length === 0 ? (
          <div className="rounded-2xl border border-slate-500/20 bg-slate-500/10 p-6 text-center text-sm text-slate-400">
            No creator drops are active yet.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {packs.slice(0, 4).map((pack, index) => {
              const creator = getCreatorMeta(pack)
              const status = getDropStatus(pack)
              const isSoldOut = pack.remainingQuantity <= 0

              return (
                <motion.article
                  key={pack.name}
                  className={`hud-card hud-corners group relative overflow-hidden rounded-[2rem] p-5 ${
                    isSoldOut ? 'opacity-60 grayscale' : ''
                  }`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pack.glow} opacity-10 transition group-hover:opacity-20`}
                  />

                  <div className="relative z-10 grid gap-4 sm:grid-cols-[130px_1fr]">
                    <div
                      className={`hud-scanline flex min-h-[180px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${pack.glow} p-[1px]`}
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-3xl bg-black/80 p-3">
                        <img
                          src={pack.cover}
                          alt={pack.name}
                          className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-200">
                          {status}
                        </span>
                        <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-purple-200">
                          {creator.region}
                        </span>
                      </div>

                      <h3 className="truncate text-2xl font-black text-white">
                        {pack.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-sm text-cyan-300">
                        <BadgeCheck className="h-4 w-4" />
                        <span className="font-black">{creator.creatorName}</span>
                        <span className="text-slate-500">{creator.handle}</span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {creator.theme}
                      </p>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                            Featured Prize
                          </p>
                          <p className="mt-1 truncate text-sm font-black text-cyan-200">
                            {creator.featuredPrize}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-3">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                            Remaining
                          </p>
                          <p className="mt-1 text-sm font-black text-amber-200">
                            {pack.remaining}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                            Audience
                          </p>
                          <p className="mt-1 text-sm font-black text-white">
                            {creator.audience}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                            Ends
                          </p>
                          <p className="mt-1 text-sm font-black text-amber-300">
                            {creator.endsIn}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isSoldOut}
                        onClick={() => onOpenDrop(pack)}
                        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-wider transition ${
                          isSoldOut
                            ? 'cursor-not-allowed border border-slate-600 bg-slate-800 text-slate-500'
                            : 'border border-emerald-300/30 bg-emerald-300/10 text-emerald-200 hover:scale-[1.02] hover:bg-emerald-300/20'
                        }`}
                      >
                        <Crown className="h-4 w-4" />
                        {isSoldOut ? 'Sold Out' : 'Open Creator Drop'}
                      </button>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-purple-300/15 bg-purple-300/[0.04] p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-300" />
            <p className="text-xs uppercase tracking-[0.28em] text-purple-300">
              Creator Monetization Direction
            </p>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Next admin layer can add creator name, drop schedule, pack stock,
            featured chase card, revenue-share percentage, and campaign analytics.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
