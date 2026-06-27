import { motion } from 'framer-motion'
import {
  Coins,
  PackageCheck,
  ShoppingBag,
  Store,
  XCircle,
} from 'lucide-react'

import type { VaultCard } from './VaultDrawer'
import { getSellBackPoints } from './VaultDrawer'
import { translations, type AppLanguage } from '../lib/i18n'

export type MarketplaceListing = {
  id: string
  card: VaultCard
  seller: string
  price: number
  listedAt: string
  source: 'player' | 'demo'
}

type MarketplacePanelProps = {
  language: AppLanguage
  listings: MarketplaceListing[]
  walletBalance: number
  onBuyListing: (listing: MarketplaceListing) => void
  onCancelListing: (listing: MarketplaceListing) => void
}

export default function MarketplacePanel({
  language,
  listings,
  walletBalance,
  onBuyListing,
  onCancelListing,
}: MarketplacePanelProps) {
  const t = translations[language]
  const playerListings = listings.filter((listing) => listing.source === 'player')

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="hud-label text-sm">{t.marketplace}</p>
          <h2 className="mt-2 text-4xl font-black">{t.playerCardMarket}</h2>
        </div>

        <p className="max-w-md text-sm leading-6 text-slate-400">
          {t.marketplaceSubtitle}
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
            <Store className="h-5 w-5 text-cyan-300" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
            {t.listings}
          </p>
          <p className="mt-2 text-2xl font-black text-white">
            {listings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10">
            <ShoppingBag className="h-5 w-5 text-emerald-300" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
            {t.yourListings}
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-300">
            {playerListings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10">
            <Coins className="h-5 w-5 text-amber-300" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
            {t.wallet}
          </p>
          <p className="mt-2 text-2xl font-black text-amber-300">
            {walletBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="hud-panel hud-corners rounded-[2rem] p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10">
            <Store className="h-8 w-8 text-cyan-300" />
          </div>
          <h3 className="text-2xl font-black text-white">
            {t.marketplaceEmpty}
          </h3>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
            {t.marketplaceEmptyDesc}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing, index) => {
            const isOwnListing = listing.source === 'player'
            const canBuy = walletBalance >= listing.price && !isOwnListing

            return (
              <motion.article
                key={listing.id}
                className="hud-card hud-corners group relative overflow-hidden rounded-[2rem] p-5"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-amber-300 opacity-10 transition group-hover:opacity-20" />

                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-200">
                      {isOwnListing ? t.yourListing : t.buyNow}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      {listing.seller}
                    </span>
                  </div>

                  <div className="hud-rarity-glow flex h-[260px] items-center justify-center overflow-hidden rounded-3xl border border-cyan-300/15 bg-black/70 p-4">
                    <img
                      src={listing.card.image}
                      alt={listing.card.name}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200">
                        {listing.card.rarity}
                      </span>
                      <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-200">
                        {listing.card.grade}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white">
                      {listing.card.name}
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                          {t.price}
                        </p>
                        <p className="mt-1 text-lg font-black text-cyan-200">
                          {listing.price.toLocaleString()} pts
                        </p>
                      </div>

                      <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] p-3">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                          {t.sellBack}
                        </p>
                        <p className="mt-1 text-lg font-black text-emerald-300">
                          {getSellBackPoints(listing.card)} pts
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-purple-300/10 bg-purple-300/[0.04] px-3 py-2 text-xs text-purple-200">
                      <PackageCheck className="h-4 w-4 shrink-0" />
                      {listing.card.sourcePack}
                    </div>

                    {isOwnListing ? (
                      <button
                        type="button"
                        onClick={() => onCancelListing(listing)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-300/30 bg-rose-300/10 px-6 py-4 font-black uppercase tracking-wider text-rose-200 transition hover:scale-[1.02] hover:bg-rose-300/20"
                      >
                        <XCircle className="h-5 w-5" />
                        {t.cancelListing}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!canBuy}
                        onClick={() => onBuyListing(listing)}
                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-black uppercase tracking-wider transition ${
                          canBuy
                            ? 'hud-button hover:scale-[1.02]'
                            : 'cursor-not-allowed border border-slate-500/20 bg-slate-500/10 text-slate-500'
                        }`}
                      >
                        <ShoppingBag className="h-5 w-5" />
                        {walletBalance < listing.price
                          ? t.needMorePoints
                          : t.buyWithPoints}
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}
    </section>
  )
}
