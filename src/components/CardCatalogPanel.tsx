import { useMemo, useState } from 'react'
import {
  Database,
  ExternalLink,
  Filter,
  ImageIcon,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { getTcgCardStats, tcgCardCatalog } from '../data/tcgCardCatalog'
import type { TcgCard, TcgGame } from '../types/tcgCard'

type CardCatalogPanelProps = {
  mode?: 'player' | 'admin'
}

type GameFilter = 'all' | TcgGame

const gameOptions: { label: string; value: GameFilter }[] = [
  { label: 'All Games', value: 'all' },
  { label: 'Pokémon', value: 'pokemon' },
  { label: 'One Piece', value: 'one_piece' },
]

const getGameLabel = (game: TcgGame) => {
  if (game === 'pokemon') return 'Pokémon'
  return 'One Piece'
}

const getGameBadgeStyle = (game: TcgGame) => {
  if (game === 'pokemon') {
    return 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200'
  }

  return 'border-amber-300/30 bg-amber-300/10 text-amber-200'
}

function CardImage({ card }: { card: TcgCard }) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="flex h-full min-h-[260px] w-full items-center justify-center rounded-2xl border border-slate-600 bg-slate-950/80 p-6 text-center">
        <div>
          <ImageIcon className="mx-auto h-10 w-10 text-slate-500" />
          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">
            Image URL Preview
          </p>
          <p className="mt-2 text-sm font-black text-slate-300">{card.name}</p>
        </div>
      </div>
    )
  }

  return (
    <img
      src={card.imageUrl}
      alt={card.name}
      loading="lazy"
      onError={() => setHasError(true)}
      className="h-full max-h-[330px] w-full object-contain transition duration-500 group-hover:scale-105"
    />
  )
}

export default function CardCatalogPanel({ mode = 'player' }: CardCatalogPanelProps) {
  const stats = getTcgCardStats()
  const [gameFilter, setGameFilter] = useState<GameFilter>('all')
  const [rarityFilter, setRarityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const rarityOptions = useMemo(() => {
    return ['all', ...Array.from(new Set(tcgCardCatalog.map((card) => card.rarity))).sort()]
  }, [])

  const filteredCards = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return tcgCardCatalog.filter((card) => {
      const matchesGame = gameFilter === 'all' || card.game === gameFilter
      const matchesRarity = rarityFilter === 'all' || card.rarity === rarityFilter
      const matchesSearch =
        normalizedSearch.length === 0 ||
        card.name.toLowerCase().includes(normalizedSearch) ||
        card.setName.toLowerCase().includes(normalizedSearch) ||
        card.cardNumber.toLowerCase().includes(normalizedSearch) ||
        card.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch))

      return matchesGame && matchesRarity && matchesSearch
    })
  }, [gameFilter, rarityFilter, searchQuery])

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap gap-3">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-200">
              TCG Card Catalog
            </span>

            <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-purple-200">
              URL Data Layer
            </span>
          </div>

          <h2 className="text-4xl font-black text-white">
            {mode === 'admin' ? 'Admin Card Catalog' : 'Real Card Catalog Preview'}
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Pokémon and One Piece card records are stored as structured catalog data with external image URLs. This keeps the demo realistic without bundling large image files into the project.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-4 lg:min-w-[560px]">
          <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Cards</p>
            <p className="mt-2 text-2xl font-black text-white">{stats.total}</p>
          </div>

          <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Pokémon</p>
            <p className="mt-2 text-2xl font-black text-cyan-300">{stats.pokemonCount}</p>
          </div>

          <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">One Piece</p>
            <p className="mt-2 text-2xl font-black text-amber-300">{stats.onePieceCount}</p>
          </div>

          <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Sets</p>
            <p className="mt-2 text-2xl font-black text-purple-300">{stats.setCount}</p>
          </div>
        </div>
      </div>

      <div className="hud-panel hud-corners rounded-[2rem] p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search card name, set, number or tag..."
              className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-12 py-4 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60 focus:bg-cyan-300/[0.05]"
            />
          </label>

          <label className="relative block">
            <Filter className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-300" />
            <select
              value={gameFilter}
              onChange={(event) => setGameFilter(event.target.value as GameFilter)}
              className="w-full appearance-none rounded-2xl border border-amber-300/20 bg-black/40 px-12 py-4 text-sm font-black text-white outline-none transition focus:border-amber-300/60 focus:bg-amber-300/[0.05]"
            >
              {gameOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="relative block">
            <Layers className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-300" />
            <select
              value={rarityFilter}
              onChange={(event) => setRarityFilter(event.target.value)}
              className="w-full appearance-none rounded-2xl border border-purple-300/20 bg-black/40 px-12 py-4 text-sm font-black text-white outline-none transition focus:border-purple-300/60 focus:bg-purple-300/[0.05]"
            >
              {rarityOptions.map((rarity) => (
                <option key={rarity} value={rarity}>
                  {rarity === 'all' ? 'All Rarities' : rarity}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-cyan-300/10 pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Database className="h-4 w-4 text-cyan-300" />
            Showing <span className="font-black text-white">{filteredCards.length}</span> catalog records
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Image URL mode · No bundled official card image files
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {filteredCards.map((card) => (
          <article
            key={card.id}
            className="hud-card hud-corners group overflow-hidden rounded-[2rem] p-4"
          >
            <div className="flex min-h-[330px] items-center justify-center overflow-hidden rounded-3xl border border-cyan-300/10 bg-black/70 p-3">
              <CardImage card={card} />
            </div>

            <div className="mt-4">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getGameBadgeStyle(card.game)}`}>
                  {getGameLabel(card.game)}
                </span>

                <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-purple-200">
                  {card.rarity}
                </span>
              </div>

              <h3 className="text-xl font-black text-white">{card.name}</h3>

              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cyan-300">
                {card.cardNumber}
              </p>

              <div className="mt-4 space-y-2 text-sm text-slate-400">
                <p>
                  <span className="text-slate-500">Set:</span>{' '}
                  <span className="text-slate-300">{card.setName}</span>
                </p>
                <p>
                  <span className="text-slate-500">Type:</span>{' '}
                  <span className="text-slate-300">{card.typeLine}</span>
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {card.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={card.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-200 transition hover:scale-[1.02] hover:bg-cyan-300/20"
              >
                <ExternalLink className="h-4 w-4" />
                Source Record
              </a>
            </div>
          </article>
        ))}
      </div>

      {mode === 'admin' && (
        <div className="mt-6 rounded-[2rem] border border-amber-300/15 bg-amber-300/[0.05] p-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
              Next Admin Upgrade
            </p>
          </div>

          <p className="text-sm leading-6 text-slate-300">
            This catalog is ready to become a pack-pool selector. The next backend version can store cards in Supabase, link them to pack pools, and assign drop rates per rarity tier.
          </p>
        </div>
      )}
    </section>
  )
}
