import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  Boxes,
  ChevronRight,
  Crown,
  Database,
  Gem,
  Hash,
  Home,
  Pencil,
  Plus,
  ReceiptText,
  RotateCcw,
  Save,
  Settings,
  XCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Ticket,
  Trophy,
  Truck,
  Users,
  Wallet,
} from 'lucide-react'

import '../../styles/sci-fi-hud.css'

import SciFiBackground from '../../components/SciFiBackground'
import CardCatalogPanel from '../../components/CardCatalogPanel'
import type { FairnessRecord } from '../../components/FairnessCenterPanel'
import type { MarketplaceListing } from '../../components/MarketplacePanel'
import {
  initialQuestStats,
  type QuestStats,
} from '../../components/QuestLeaderboardPanel'
import type { RaffleEntry, RaffleWinner } from '../../components/RaffleCenterPanel'
import type { TransactionRecord } from '../../components/TransactionDrawer'
import type { ShippingStatus, VaultCard } from '../../components/VaultDrawer'
import type { Pack } from '../../data/cardPool'
import { pokemonPackCoverUrls } from '../../data/cardPool'

import thunderCard from '../../assets/cards/thunder-card.png'
import pirateCard from '../../assets/cards/pirate-card.png'
import mysticCard from '../../assets/cards/mystic-card.png'

type PackAdminStatus = 'Active' | 'Paused' | 'Hidden'
type PackCoverKey = 'electric' | 'pirate' | 'secret' | 'custom'

type ManagedPack = Pack & {
  adminStatus?: PackAdminStatus
  coverKey?: PackCoverKey
  coverImageUrl?: string
  dropType?: string
  isFeatured?: boolean
  creatorName?: string
  creatorHandle?: string
  creatorRegion?: string
  featuredPrize?: string
  startDate?: string
  endDate?: string
  revenueShare?: string
  campaignOwner?: string
}

type StoredPackState = {
  name: string
  category?: string
  price?: string
  remainingQuantity: number
  totalQuantity?: number
  badge?: string
  glow?: string
  coverKey?: PackCoverKey
  coverImageUrl?: string
  adminStatus?: PackAdminStatus
  dropType?: string
  isFeatured?: boolean
  creatorName?: string
  creatorHandle?: string
  creatorRegion?: string
  featuredPrize?: string
  startDate?: string
  endDate?: string
  revenueShare?: string
  campaignOwner?: string
}

type AdminTab =
  | 'overview'
  | 'packs'
  | 'catalog'
  | 'shipping'
  | 'marketplace'
  | 'raffle'
  | 'creators'
  | 'fairness'
  | 'users'
  | 'transactions'
  | 'settings'

const STORAGE_KEYS = {
  packs: 'tcg-platform-packs-v3',
  walletBalance: 'tcg-platform-wallet-v2',
  vaultCards: 'tcg-platform-vault-cards-v3',
  transactions: 'tcg-platform-transactions-v2',
  questStats: 'tcg-platform-quest-stats-v1',
  raffleTickets: 'tcg-platform-raffle-tickets-v1',
  raffleEntries: 'tcg-platform-raffle-entries-v1',
  raffleWinners: 'tcg-platform-raffle-winners-v1',
  marketplaceListings: 'tcg-platform-marketplace-listings-v2',
  fairnessRecords: 'tcg-platform-fairness-records-v2',
}

const initialPacks: Pack[] = [
  {
    name: 'Pokémon 151 Charizard Chase',
    category: 'Pokémon Inspired',
    price: '120 Points',
    remaining: '188 / 300 left',
    remainingQuantity: 188,
    totalQuantity: 300,
    glow: 'from-orange-300 to-red-700',
    badge: 'Charizard Chase',
    cover: pokemonPackCoverUrls.charizard151,
  },
  {
    name: 'Pokémon VMAX Electric Chase',
    category: 'Pokémon Inspired',
    price: '150 Points',
    remaining: '142 / 260 left',
    remainingQuantity: 142,
    totalQuantity: 260,
    glow: 'from-yellow-300 to-cyan-600',
    badge: 'Pikachu Chase',
    cover: pokemonPackCoverUrls.pikachuVmax,
  },
  {
    name: 'Crown Zenith Vault Drop',
    category: 'Premium Mystery Pack',
    price: '220 Points',
    remaining: '58 / 120 left',
    remainingQuantity: 58,
    totalQuantity: 120,
    glow: 'from-amber-200 to-purple-700',
    badge: 'Gold Chase',
    cover: pokemonPackCoverUrls.arceusGallery,
  },
  {
    name: 'Classic Base Set Holo Drop',
    category: 'Premium Mystery Pack',
    price: '350 Points',
    remaining: '9 / 50 left',
    remainingQuantity: 9,
    totalQuantity: 50,
    glow: 'from-red-400 to-orange-700',
    badge: 'Vintage Holo',
    cover: pokemonPackCoverUrls.baseCharizard,
  },
  {
    name: 'SEA Pokémon Creator Mega Drop',
    category: 'Creator Drops',
    price: '10 Points',
    remaining: '260 / 500 left',
    remainingQuantity: 260,
    totalQuantity: 500,
    glow: 'from-emerald-300 to-cyan-600',
    badge: 'Creator Drop',
    cover: pokemonPackCoverUrls.mewEx,
  },
  {
    name: 'Kanto Starter Creator Drop',
    category: 'Creator Drops',
    price: '80 Points',
    remaining: '84 / 180 left',
    remainingQuantity: 84,
    totalQuantity: 180,
    glow: 'from-cyan-300 to-blue-700',
    badge: 'Kanto Drop',
    cover: pokemonPackCoverUrls.blastoiseBase,
  },
  {
    name: 'Gallery Pikachu Weekly Drop',
    category: 'Creator Drops',
    price: '60 Points',
    remaining: '18 / 120 left',
    remainingQuantity: 18,
    totalQuantity: 120,
    glow: 'from-yellow-300 to-amber-600',
    badge: 'Weekly Drop',
    cover: pokemonPackCoverUrls.crownPikachu,
  },
  {
    name: 'Venusaur Holo Vaulted Drop',
    category: 'Premium Mystery Pack',
    price: '95 Points',
    remaining: '96 / 180 left',
    remainingQuantity: 96,
    totalQuantity: 180,
    glow: 'from-lime-300 to-emerald-700',
    badge: 'Vaulted',
    cover: pokemonPackCoverUrls.venusaurBase,
  },
]

const adminTabs: {
  id: AdminTab
  label: string
  icon: typeof BarChart3
}[] = [
  { id: 'overview', label: 'Dashboard', icon: BarChart3 },
  { id: 'packs', label: 'Packs', icon: Boxes },
  { id: 'catalog', label: 'Card Catalog', icon: Database },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  { id: 'raffle', label: 'Raffle', icon: Ticket },
  { id: 'creators', label: 'Creator Drops', icon: Users },
  { id: 'fairness', label: 'Fairness', icon: Hash },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'transactions', label: 'Transactions', icon: ReceiptText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const shippingStatusSteps: ShippingStatus[] = [
  'Shipping Requested',
  'Preparing',
  'Shipped',
  'Delivered',
]

const packCategoryOptions = [
  'Pokémon Inspired',
  'One Piece Inspired',
  'Premium Mystery Pack',
  'Creator Drops',
] as const

const packGlowOptions = [
  { label: 'Electric Cyan', value: 'from-cyan-400 to-blue-600' },
  { label: 'Pirate Amber', value: 'from-amber-300 to-red-600' },
  { label: 'Secret Purple', value: 'from-purple-400 to-pink-600' },
  { label: 'Creator Emerald', value: 'from-emerald-300 to-cyan-600' },
  { label: 'Anime Rose', value: 'from-rose-300 to-orange-600' },
  { label: 'Vault Fuchsia', value: 'from-fuchsia-400 to-violet-700' },
]

const packCoverOptions: { label: string; value: PackCoverKey }[] = [
  { label: 'Electric Deck Cover', value: 'electric' },
  { label: 'Pirate Deck Cover', value: 'pirate' },
  { label: 'Secret Deck Cover', value: 'secret' },
  { label: 'Custom URL Cover', value: 'custom' },
]

type PackFormState = {
  name: string
  category: string
  price: string
  remainingQuantity: string
  totalQuantity: string
  badge: string
  glow: string
  coverKey: PackCoverKey
  coverImageUrl: string
  adminStatus: PackAdminStatus
  dropType: string
  isFeatured: boolean
  creatorName: string
  creatorHandle: string
  creatorRegion: string
  featuredPrize: string
  startDate: string
  endDate: string
  revenueShare: string
  campaignOwner: string
}

const createEmptyPackForm = (): PackFormState => ({
  name: '',
  category: 'Creator Drops',
  price: '100',
  remainingQuantity: '100',
  totalQuantity: '100',
  badge: 'Admin Pack',
  glow: 'from-cyan-400 to-blue-600',
  coverKey: 'electric',
  coverImageUrl: '',
  adminStatus: 'Active',
  dropType: 'Standard Drop',
  isFeatured: false,
  creatorName: '',
  creatorHandle: '',
  creatorRegion: 'Southeast Asia',
  featuredPrize: 'Mystery Chase Card',
  startDate: '',
  endDate: '',
  revenueShare: '',
  campaignOwner: '',
})

const createPackFormFromPack = (pack: ManagedPack): PackFormState => ({
  name: pack.name,
  category: pack.category,
  price: String(getPackCost(pack)),
  remainingQuantity: String(pack.remainingQuantity),
  totalQuantity: String(pack.totalQuantity),
  badge: pack.badge,
  glow: pack.glow,
  coverKey: pack.coverKey ?? inferCoverKey(pack.name),
  coverImageUrl: pack.coverImageUrl ?? '',
  adminStatus: pack.adminStatus ?? 'Active',
  dropType: pack.dropType ?? 'Standard Drop',
  isFeatured: pack.isFeatured ?? false,
  creatorName: pack.creatorName ?? '',
  creatorHandle: pack.creatorHandle ?? '',
  creatorRegion: pack.creatorRegion ?? 'Southeast Asia',
  featuredPrize: pack.featuredPrize ?? 'Mystery Chase Card',
  startDate: pack.startDate ?? '',
  endDate: pack.endDate ?? '',
  revenueShare: pack.revenueShare ?? '',
  campaignOwner: pack.campaignOwner ?? '',
})



const packCoverMap: Record<Exclude<PackCoverKey, 'custom'>, string> = {
  electric: pokemonPackCoverUrls.pikachuVmax,
  pirate: pokemonPackCoverUrls.baseCharizard,
  secret: pokemonPackCoverUrls.arceusGallery,
}

const inferCoverKey = (packName: string): Exclude<PackCoverKey, 'custom'> => {
  const normalizedName = packName.toLowerCase()

  if (normalizedName.includes('pirate') || normalizedName.includes('anime')) return 'pirate'
  if (normalizedName.includes('secret') || normalizedName.includes('vault')) return 'secret'

  return 'electric'
}

const getDefaultCreatorMeta = (packName: string) => {
  const normalizedName = packName.toLowerCase()

  if (normalizedName.includes('anime')) {
    return {
      creatorName: 'AnimeVault MY',
      creatorHandle: '@animevaultmy',
      creatorRegion: 'Malaysia',
      featuredPrize: 'Pikachu VMAX Rainbow',
      startDate: '2026-06-20',
      endDate: '2026-06-27',
      revenueShare: '18%',
      campaignOwner: 'Anime Creator Team',
    }
  }

  if (normalizedName.includes('streamer')) {
    return {
      creatorName: 'KaiTan Plays',
      creatorHandle: '@kaitanplays',
      creatorRegion: 'SEA Live',
      featuredPrize: 'Charizard ex SIR',
      startDate: '2026-06-20',
      endDate: '2026-06-23',
      revenueShare: '22%',
      campaignOwner: 'Streaming Collab',
    }
  }

  if (normalizedName.includes('weekly') || normalizedName.includes('collector')) {
    return {
      creatorName: 'CardHunter Club',
      creatorHandle: '@cardhunterclub',
      creatorRegion: 'SEA Weekly',
      featuredPrize: 'Crown Zenith Pikachu',
      startDate: '2026-06-20',
      endDate: '2026-06-30',
      revenueShare: '15%',
      campaignOwner: 'Community Ops',
    }
  }

  return {
    creatorName: 'JomCollector',
    creatorHandle: '@jomcollector',
    creatorRegion: 'Malaysia / SG',
    featuredPrize: 'Charizard VMAX Shiny',
    startDate: '2026-06-20',
    endDate: '2026-06-26',
    revenueShare: '20%',
    campaignOwner: 'SEA Creator Program',
  }
}

const createManagedInitialPacks = (): ManagedPack[] =>
  initialPacks.map((pack) => {
    const isCreatorDrop = pack.category === 'Creator Drops'

    return {
      ...pack,
      adminStatus: 'Active',
      coverKey: inferCoverKey(pack.name),
      dropType: isCreatorDrop ? 'Creator Drop' : 'Standard Drop',
      isFeatured: isCreatorDrop,
      ...(isCreatorDrop ? getDefaultCreatorMeta(pack.name) : {}),
    }
  })

const getPackCover = (
  coverKey: PackCoverKey | undefined,
  fallbackPackName: string,
  coverImageUrl?: string,
) => {
  const trimmedCoverUrl = coverImageUrl?.trim()

  if (trimmedCoverUrl) return trimmedCoverUrl

  const resolvedCoverKey: Exclude<PackCoverKey, 'custom'> =
    coverKey && coverKey !== 'custom'
      ? coverKey
      : inferCoverKey(fallbackPackName)

  return packCoverMap[resolvedCoverKey]
}

const getPackStatusStyle = (status: PackAdminStatus | undefined) => {
  if (status === 'Paused') return 'border-amber-300/30 bg-amber-300/10 text-amber-300'
  if (status === 'Hidden') return 'border-slate-400/30 bg-slate-400/10 text-slate-300'

  return 'border-emerald-300/30 bg-emerald-300/10 text-emerald-300'
}



const formatPackRemaining = (
  remainingQuantity: number,
  totalQuantity: number,
) => {
  if (remainingQuantity <= 0) return 'Sold Out'

  return `${remainingQuantity} / ${totalQuantity} left`
}

const safeJsonParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

const getFullDateTime = () => {
  return new Date().toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getPackCost = (pack: Pack) => {
  return Number(pack.price.replace(/[^0-9]/g, '')) || 0
}

const isNearlySoldOut = (pack: Pack) => {
  return pack.remainingQuantity > 0 && pack.remainingQuantity <= 10
}

const isShippingCard = (card: VaultCard) => {
  return card.status !== 'Stored' && card.status !== 'Listed on Marketplace'
}

const getNextShippingStatus = (status: ShippingStatus): ShippingStatus | null => {
  if (status === 'Shipping Requested') return 'Preparing'
  if (status === 'Preparing') return 'Shipped'
  if (status === 'Shipped') return 'Delivered'

  return null
}

const getStatusStyle = (status: ShippingStatus) => {
  if (status === 'Delivered') return 'border-emerald-300/30 bg-emerald-300/10 text-emerald-300'
  if (status === 'Shipped') return 'border-cyan-300/30 bg-cyan-300/10 text-cyan-300'
  if (status === 'Preparing') return 'border-amber-300/30 bg-amber-300/10 text-amber-300'
  if (status === 'Listed on Marketplace') return 'border-purple-300/30 bg-purple-300/10 text-purple-300'

  return 'border-slate-400/30 bg-slate-400/10 text-slate-300'
}

const createDemoMarketplaceListings = (): MarketplaceListing[] => [
  {
    id: 'demo-marketplace-secret-dragon',
    seller: 'JomCollector',
    price: 1450,
    listedAt: 'Demo Listing',
    source: 'demo',
    card: {
      id: 'demo-card-secret-dragon',
      name: 'Charizard VMAX Shiny',
      rarity: 'SECRET RARE',
      grade: 'PSA 10 Style',
      image: thunderCard,
      sourcePack: 'Electric Chase Pack',
      openedAt: 'Demo Pull',
      status: 'Stored',
    },
  },
  {
    id: 'demo-marketplace-pirate-king',
    seller: 'SEA TCG Vault',
    price: 520,
    listedAt: 'Demo Listing',
    source: 'demo',
    card: {
      id: 'demo-card-pirate-king',
      name: 'Pikachu VMAX Rainbow',
      rarity: 'SUPER RARE',
      grade: 'Mint Style',
      image: pirateCard,
      sourcePack: 'Pirate Treasure Drop',
      openedAt: 'Demo Pull',
      status: 'Stored',
    },
  },
  {
    id: 'demo-marketplace-mystic-energy',
    seller: 'KaiTan',
    price: 120,
    listedAt: 'Demo Listing',
    source: 'demo',
    card: {
      id: 'demo-card-mystic-energy',
      name: 'Crown Zenith Pikachu',
      rarity: 'RARE',
      grade: 'Near Mint',
      image: mysticCard,
      sourcePack: 'SEA Creator Mega Drop',
      openedAt: 'Demo Pull',
      status: 'Stored',
    },
  },
]

const loadWalletBalance = () => {
  if (typeof window === 'undefined') return 1000

  const storedValue = window.localStorage.getItem(STORAGE_KEYS.walletBalance)
  const parsedValue = Number(storedValue)

  if (Number.isNaN(parsedValue)) return 1000

  return parsedValue
}

const loadPacks = () => {
  if (typeof window === 'undefined') return createManagedInitialPacks()

  const storedPacks = safeJsonParse<StoredPackState[]>(
    window.localStorage.getItem(STORAGE_KEYS.packs),
    [],
  )

  if (!Array.isArray(storedPacks) || storedPacks.length === 0) {
    return createManagedInitialPacks()
  }

  const defaultPacks = createManagedInitialPacks()
  const defaultPackMap = new Map(defaultPacks.map((pack) => [pack.name, pack]))

  return storedPacks
    .filter((storedPack) => storedPack.name)
    .map((storedPack) => {
      const fallbackPack = defaultPackMap.get(storedPack.name)
      const totalQuantity = Math.max(
        Number(storedPack.totalQuantity ?? fallbackPack?.totalQuantity ?? storedPack.remainingQuantity ?? 1),
        1,
      )
      const remainingQuantity = Math.max(
        Math.min(Number(storedPack.remainingQuantity ?? totalQuantity), totalQuantity),
        0,
      )
      const coverKey = storedPack.coverKey ?? fallbackPack?.coverKey ?? inferCoverKey(storedPack.name)
      const coverImageUrl = storedPack.coverImageUrl ?? fallbackPack?.coverImageUrl

      return {
        ...(fallbackPack ?? {
          name: storedPack.name,
          category: storedPack.category ?? 'Creator Drops',
          price: storedPack.price ?? '100 Points',
          glow: storedPack.glow ?? 'from-cyan-400 to-blue-600',
          badge: storedPack.badge ?? 'Admin Pack',
          cover: getPackCover(coverKey, storedPack.name, coverImageUrl),
        }),
        name: storedPack.name,
        category: storedPack.category ?? fallbackPack?.category ?? 'Creator Drops',
        price: storedPack.price ?? fallbackPack?.price ?? '100 Points',
        remainingQuantity,
        totalQuantity,
        remaining: formatPackRemaining(remainingQuantity, totalQuantity),
        badge: storedPack.badge ?? fallbackPack?.badge ?? 'Admin Pack',
        glow: storedPack.glow ?? fallbackPack?.glow ?? 'from-cyan-400 to-blue-600',
        cover: getPackCover(coverKey, storedPack.name, coverImageUrl),
        coverKey,
        coverImageUrl,
        adminStatus: storedPack.adminStatus ?? fallbackPack?.adminStatus ?? 'Active',
        dropType: storedPack.dropType ?? fallbackPack?.dropType ?? 'Standard Drop',
        isFeatured: storedPack.isFeatured ?? fallbackPack?.isFeatured ?? false,
        creatorName: storedPack.creatorName ?? fallbackPack?.creatorName,
        creatorHandle: storedPack.creatorHandle ?? fallbackPack?.creatorHandle,
        creatorRegion: storedPack.creatorRegion ?? fallbackPack?.creatorRegion,
        featuredPrize: storedPack.featuredPrize ?? fallbackPack?.featuredPrize,
        startDate: storedPack.startDate ?? fallbackPack?.startDate,
        endDate: storedPack.endDate ?? fallbackPack?.endDate,
        revenueShare: storedPack.revenueShare ?? fallbackPack?.revenueShare,
        campaignOwner: storedPack.campaignOwner ?? fallbackPack?.campaignOwner,
      }
    })
}

const loadVaultCards = () => {
  if (typeof window === 'undefined') return []

  return safeJsonParse<VaultCard[]>(
    window.localStorage.getItem(STORAGE_KEYS.vaultCards),
    [],
  )
}

const loadTransactions = () => {
  if (typeof window === 'undefined') return []

  return safeJsonParse<TransactionRecord[]>(
    window.localStorage.getItem(STORAGE_KEYS.transactions),
    [],
  )
}

const loadQuestStats = () => {
  if (typeof window === 'undefined') return initialQuestStats

  const storedStats = safeJsonParse<QuestStats>(
    window.localStorage.getItem(STORAGE_KEYS.questStats),
    initialQuestStats,
  )

  return {
    ...initialQuestStats,
    ...storedStats,
    claimedQuestIds: Array.isArray(storedStats.claimedQuestIds)
      ? storedStats.claimedQuestIds
      : [],
  }
}

const loadRaffleTickets = () => {
  if (typeof window === 'undefined') return 0

  const storedValue = window.localStorage.getItem(STORAGE_KEYS.raffleTickets)
  const parsedValue = Number(storedValue)

  if (Number.isNaN(parsedValue)) return 0

  return parsedValue
}

const normalizeRaffleEntry = (
  entry: Partial<RaffleEntry>,
  index: number,
): RaffleEntry => {
  const entryStatus =
    entry.status === 'Entered' ||
    entry.status === 'Winner Pending' ||
    entry.status === 'Winner Selected'
      ? entry.status
      : 'Entered'

  return {
    id:
      typeof entry.id === 'string' && entry.id.trim()
        ? entry.id
        : `legacy-raffle-entry-${index}`,
    prizeId:
      typeof entry.prizeId === 'string' && entry.prizeId.trim()
        ? entry.prizeId
        : 'weekly-demo-prize',
    prizeName:
      typeof entry.prizeName === 'string' && entry.prizeName.trim()
        ? entry.prizeName
        : 'Weekly Raffle Prize',
    tickets: Math.max(Number(entry.tickets) || 0, 0),
    createdAt:
      typeof entry.createdAt === 'string' && entry.createdAt.trim()
        ? entry.createdAt
        : 'Legacy Entry',
    status: entryStatus,
  }
}

const normalizeRaffleWinner = (
  winner: Partial<RaffleWinner>,
  index: number,
): RaffleWinner => {
  const fallbackEntryId = `legacy-winning-entry-${index}`

  return {
    id:
      typeof winner.id === 'string' && winner.id.trim()
        ? winner.id
        : `legacy-raffle-winner-${index}`,
    prizeId:
      typeof winner.prizeId === 'string' && winner.prizeId.trim()
        ? winner.prizeId
        : 'weekly-demo-prize',
    prizeName:
      typeof winner.prizeName === 'string' && winner.prizeName.trim()
        ? winner.prizeName
        : 'Weekly Raffle Prize',
    winnerName:
      typeof winner.winnerName === 'string' && winner.winnerName.trim()
        ? winner.winnerName
        : 'Current Player',
    winningEntryId:
      typeof winner.winningEntryId === 'string' && winner.winningEntryId.trim()
        ? winner.winningEntryId
        : fallbackEntryId,
    tickets: Math.max(Number(winner.tickets) || 0, 0),
    drawnAt:
      typeof winner.drawnAt === 'string' && winner.drawnAt.trim()
        ? winner.drawnAt
        : 'Legacy Draw',
    status: 'Winner Selected',
  }
}

const getShortId = (value: string | undefined, fallback = 'legacy-id') => {
  if (!value || typeof value !== 'string') return fallback

  return value.slice(0, 16)
}

const loadRaffleEntries = () => {
  if (typeof window === 'undefined') return []

  const storedEntries = safeJsonParse<Partial<RaffleEntry>[]>(
    window.localStorage.getItem(STORAGE_KEYS.raffleEntries),
    [],
  )

  if (!Array.isArray(storedEntries)) return []

  return storedEntries.map(normalizeRaffleEntry)
}


const loadRaffleWinners = () => {
  if (typeof window === 'undefined') return []

  const storedWinners = safeJsonParse<Partial<RaffleWinner>[]>(
    window.localStorage.getItem(STORAGE_KEYS.raffleWinners),
    [],
  )

  if (!Array.isArray(storedWinners)) return []

  return storedWinners.map(normalizeRaffleWinner)
}

const loadMarketplaceListings = () => {
  if (typeof window === 'undefined') return createDemoMarketplaceListings()

  return safeJsonParse<MarketplaceListing[]>(
    window.localStorage.getItem(STORAGE_KEYS.marketplaceListings),
    createDemoMarketplaceListings(),
  )
}

const loadFairnessRecords = () => {
  if (typeof window === 'undefined') return []

  return safeJsonParse<FairnessRecord[]>(
    window.localStorage.getItem(STORAGE_KEYS.fairnessRecords),
    [],
  )
}


type AdminUserTier = 'Bronze' | 'Silver' | 'Gold' | 'Whale' | 'Creator Partner'

type AdminUserWalletSummary = {
  id: string
  name: string
  handle: string
  email: string
  tier: AdminUserTier
  walletBalance: number
  vaultCards: number
  totalPacksOpened: number
  totalPointsSpent: number
  raffleEntries: number
  shippingRequests: number
  marketplacePurchases: number
  totalTopUp: number
  sellBackEarned: number
  questRewards: number
  raffleSpend: number
  lastActive: string
  status: 'Active' | 'Watchlist' | 'Creator'
}

const getUserTierStyle = (tier: AdminUserTier) => {
  if (tier === 'Whale') return 'border-rose-300/30 bg-rose-300/10 text-rose-300'
  if (tier === 'Gold') return 'border-amber-300/30 bg-amber-300/10 text-amber-300'
  if (tier === 'Silver') return 'border-slate-300/30 bg-slate-300/10 text-slate-300'
  if (tier === 'Creator Partner') return 'border-purple-300/30 bg-purple-300/10 text-purple-300'

  return 'border-cyan-300/30 bg-cyan-300/10 text-cyan-300'
}

function StatCard({
  title,
  value,
  caption,
  icon: Icon,
  accent = 'text-cyan-300',
}: {
  title: string
  value: string | number
  caption: string
  icon: typeof BarChart3
  accent?: string
}) {
  return (
    <div className="rounded-3xl border border-cyan-300/10 bg-cyan-300/[0.04] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
          {title}
        </p>
        <Icon className={`h-5 w-5 ${accent}`} />
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{caption}</p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [packs, setPacks] = useState<ManagedPack[]>(() => loadPacks())
  const [walletBalance, setWalletBalance] = useState(() => loadWalletBalance())
  const [vaultCards, setVaultCards] = useState<VaultCard[]>(() => loadVaultCards())
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() =>
    loadTransactions(),
  )
  const [questStats, setQuestStats] = useState<QuestStats>(() =>
    loadQuestStats(),
  )
  const [raffleTickets, setRaffleTickets] = useState(() => loadRaffleTickets())
  const [raffleEntries, setRaffleEntries] = useState<RaffleEntry[]>(() =>
    loadRaffleEntries(),
  )
  const [raffleWinners, setRaffleWinners] = useState<RaffleWinner[]>(() =>
    loadRaffleWinners(),
  )
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(
    () => loadMarketplaceListings(),
  )
  const [fairnessRecords, setFairnessRecords] = useState<FairnessRecord[]>(() =>
    loadFairnessRecords(),
  )
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({})
  const [isPackFormOpen, setIsPackFormOpen] = useState(false)
  const [editingPackName, setEditingPackName] = useState<string | null>(null)
  const [packForm, setPackForm] = useState<PackFormState>(() =>
    createEmptyPackForm(),
  )
  const [selectedUserId, setSelectedUserId] = useState('current-player')

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.packs,
      JSON.stringify(
        packs.map((pack) => ({
          name: pack.name,
          category: pack.category,
          price: pack.price,
          remainingQuantity: pack.remainingQuantity,
          totalQuantity: pack.totalQuantity,
          badge: pack.badge,
          glow: pack.glow,
          coverKey: pack.coverKey ?? inferCoverKey(pack.name),
          coverImageUrl: pack.coverImageUrl,
          adminStatus: pack.adminStatus ?? 'Active',
          dropType: pack.dropType ?? 'Standard Drop',
          isFeatured: pack.isFeatured ?? false,
          creatorName: pack.creatorName,
          creatorHandle: pack.creatorHandle,
          creatorRegion: pack.creatorRegion,
          featuredPrize: pack.featuredPrize,
          startDate: pack.startDate,
          endDate: pack.endDate,
          revenueShare: pack.revenueShare,
          campaignOwner: pack.campaignOwner,
        })),
      ),
    )
  }, [packs])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.walletBalance, String(walletBalance))
  }, [walletBalance])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.vaultCards, JSON.stringify(vaultCards))
  }, [vaultCards])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.transactions,
      JSON.stringify(transactions),
    )
  }, [transactions])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.questStats, JSON.stringify(questStats))
  }, [questStats])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.raffleTickets, String(raffleTickets))
  }, [raffleTickets])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.raffleEntries,
      JSON.stringify(raffleEntries),
    )
  }, [raffleEntries])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.raffleWinners,
      JSON.stringify(raffleWinners),
    )
  }, [raffleWinners])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.marketplaceListings,
      JSON.stringify(marketplaceListings),
    )
  }, [marketplaceListings])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.fairnessRecords,
      JSON.stringify(fairnessRecords),
    )
  }, [fairnessRecords])

  const shippingCards = useMemo(
    () => vaultCards.filter(isShippingCard),
    [vaultCards],
  )

  const playerMarketplaceListings = marketplaceListings.filter(
    (listing) => listing.source === 'player',
  )

  const totalStockLeft = packs.reduce(
    (total, pack) => total + pack.remainingQuantity,
    0,
  )

  const totalStock = packs.reduce(
    (total, pack) => total + pack.totalQuantity,
    0,
  )

  const totalPointsSpent = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0)

  const totalPacksOpened = questStats.openPacks

  const walletLedgerSummary = useMemo(() => {
    const totalTopUp = transactions
      .filter((transaction) => transaction.type === 'top-up')
      .reduce((total, transaction) => total + Math.max(transaction.amount, 0), 0)
    const sellBackEarned = transactions
      .filter((transaction) => transaction.type === 'sell-back')
      .reduce((total, transaction) => total + Math.max(transaction.amount, 0), 0)
    const questRewards = transactions
      .filter((transaction) => transaction.title.toLowerCase().includes('quest'))
      .reduce((total, transaction) => total + Math.max(transaction.amount, 0), 0)
    const raffleSpend = transactions
      .filter((transaction) => transaction.type === 'raffle' && transaction.amount < 0)
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0)
    const marketplacePurchases = transactions.filter(
      (transaction) =>
        transaction.type === 'marketplace' &&
        transaction.title.toLowerCase().includes('buy'),
    ).length

    return {
      totalTopUp,
      sellBackEarned,
      questRewards,
      raffleSpend,
      marketplacePurchases,
    }
  }, [transactions])

  const adminUsers = useMemo<AdminUserWalletSummary[]>(() => {
    const currentUser: AdminUserWalletSummary = {
      id: 'current-player',
      name: 'Current Player',
      handle: '@currentplayer',
      email: 'player@demo.local',
      tier: totalPointsSpent >= 10000 ? 'Whale' : totalPointsSpent >= 3500 ? 'Gold' : totalPointsSpent >= 1000 ? 'Silver' : 'Bronze',
      walletBalance,
      vaultCards: vaultCards.length,
      totalPacksOpened,
      totalPointsSpent,
      raffleEntries: raffleEntries.length,
      shippingRequests: shippingCards.length,
      marketplacePurchases: walletLedgerSummary.marketplacePurchases,
      totalTopUp: walletLedgerSummary.totalTopUp,
      sellBackEarned: walletLedgerSummary.sellBackEarned,
      questRewards: walletLedgerSummary.questRewards,
      raffleSpend: walletLedgerSummary.raffleSpend,
      lastActive: transactions[0]?.createdAt ?? 'Active now',
      status: 'Active',
    }

    return [
      currentUser,
      {
        id: 'demo-kaitan',
        name: 'KaiTan',
        handle: '@kaitanplays',
        email: 'kaitan@demo.local',
        tier: 'Whale',
        walletBalance: 18420,
        vaultCards: 368,
        totalPacksOpened: 1280,
        totalPointsSpent: 98600,
        raffleEntries: 96,
        shippingRequests: 12,
        marketplacePurchases: 28,
        totalTopUp: 120000,
        sellBackEarned: 21800,
        questRewards: 2400,
        raffleSpend: 860,
        lastActive: 'Today · 12:40 AM',
        status: 'Active',
      },
      {
        id: 'demo-jomcollector',
        name: 'JomCollector',
        handle: '@jomcollector',
        email: 'jomcollector@demo.local',
        tier: 'Creator Partner',
        walletBalance: 9400,
        vaultCards: 214,
        totalPacksOpened: 840,
        totalPointsSpent: 61200,
        raffleEntries: 72,
        shippingRequests: 8,
        marketplacePurchases: 19,
        totalTopUp: 75000,
        sellBackEarned: 12600,
        questRewards: 1800,
        raffleSpend: 520,
        lastActive: 'Today · 11:18 PM',
        status: 'Creator',
      },
      {
        id: 'demo-sea-vault',
        name: 'SEA Vault User',
        handle: '@seavault',
        email: 'seavault@demo.local',
        tier: 'Gold',
        walletBalance: 6200,
        vaultCards: 156,
        totalPacksOpened: 510,
        totalPointsSpent: 28400,
        raffleEntries: 31,
        shippingRequests: 5,
        marketplacePurchases: 11,
        totalTopUp: 36000,
        sellBackEarned: 8400,
        questRewards: 1200,
        raffleSpend: 260,
        lastActive: 'Yesterday · 9:45 PM',
        status: 'Active',
      },
      {
        id: 'demo-creator-fan',
        name: 'Creator Fan',
        handle: '@creatorfan',
        email: 'creatorfan@demo.local',
        tier: 'Silver',
        walletBalance: 1850,
        vaultCards: 42,
        totalPacksOpened: 138,
        totalPointsSpent: 7600,
        raffleEntries: 14,
        shippingRequests: 1,
        marketplacePurchases: 3,
        totalTopUp: 10000,
        sellBackEarned: 1800,
        questRewards: 600,
        raffleSpend: 90,
        lastActive: '2 days ago',
        status: 'Watchlist',
      },
    ]
  }, [
    totalPacksOpened,
    totalPointsSpent,
    walletBalance,
    vaultCards.length,
    raffleEntries.length,
    shippingCards.length,
    transactions,
    walletLedgerSummary,
  ])

  const selectedUser =
    adminUsers.find((user) => user.id === selectedUserId) ?? adminUsers[0]

  const addTransaction = (
    title: string,
    description: string,
    amount = 0,
    balanceAfter = walletBalance,
    type: TransactionRecord['type'] = 'shipping',
  ) => {
    const newTransaction: TransactionRecord = {
      id: `${Date.now()}-admin-${Math.random().toString(16).slice(2)}`,
      type,
      title,
      description,
      amount,
      balanceAfter,
      createdAt: getFullDateTime(),
      status: 'Completed',
    }

    setTransactions((currentTransactions) => [
      newTransaction,
      ...currentTransactions,
    ])
  }

  const updateShippingStatus = (
    cardId: string,
    nextStatus: ShippingStatus,
    trackingNumber?: string,
  ) => {
    const targetCard = vaultCards.find((card) => card.id === cardId)

    if (!targetCard) return

    setVaultCards((currentCards) =>
      currentCards.map((card) => {
        if (card.id !== cardId) return card

        return {
          ...card,
          status: nextStatus,
          shippingUpdatedAt: getFullDateTime(),
          shippingInfo: {
            ...(card.shippingInfo ?? {
              fullName: '',
              phone: '',
              email: '',
              address: '',
              postcode: '',
              city: '',
              state: '',
            }),
            trackingNumber:
              trackingNumber?.trim() || card.shippingInfo?.trackingNumber,
          },
        }
      }),
    )

    addTransaction(
      `Admin Shipping · ${nextStatus}`,
      `${targetCard.name} was updated to ${nextStatus}${
        trackingNumber ? ` · Tracking: ${trackingNumber}` : ''
      }.`,
    )
  }


  const drawRaffleWinner = () => {
    const eligibleEntries = raffleEntries.filter(
      (entry) => entry.status !== 'Winner Selected',
    )

    if (eligibleEntries.length === 0) return

    const winningEntry =
      eligibleEntries[Math.floor(Math.random() * eligibleEntries.length)]

    if (!winningEntry) return

    const winner: RaffleWinner = {
      id: `${Date.now()}-winner-${Math.random().toString(16).slice(2)}`,
      prizeId: winningEntry.prizeId,
      prizeName: winningEntry.prizeName,
      winnerName: 'Current Player',
      winningEntryId: winningEntry.id,
      tickets: winningEntry.tickets,
      drawnAt: getFullDateTime(),
      status: 'Winner Selected',
    }

    setRaffleWinners((currentWinners) => [winner, ...currentWinners])
    setRaffleEntries((currentEntries) =>
      currentEntries.map((entry) =>
        entry.id === winningEntry.id
          ? {
              ...entry,
              status: 'Winner Selected',
            }
          : entry,
      ),
    )

    addTransaction(
      'Raffle Winner Drawn',
      `${winner.winnerName} won ${winner.prizeName} with entry ${getShortId(winner.winningEntryId, 'legacy').slice(0, 12)}.`,
      0,
      walletBalance,
      'raffle',
    )
  }

  const resetDemoData = () => {
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach((storageKey) => {
        window.localStorage.removeItem(storageKey)
      })
    }

    setPacks(createManagedInitialPacks())
    setWalletBalance(1000)
    setVaultCards([])
    setTransactions([])
    setQuestStats({
      ...initialQuestStats,
      claimedQuestIds: [],
    })
    setRaffleTickets(0)
    setRaffleEntries([])
    setRaffleWinners([])
    setMarketplaceListings(createDemoMarketplaceListings())
    setFairnessRecords([])
    setTrackingInputs({})
    setActiveTab('overview')
  }


  const openAddPackForm = () => {
    setEditingPackName(null)
    setPackForm(createEmptyPackForm())
    setIsPackFormOpen(true)
    setActiveTab('packs')
  }

  const openAddCreatorDropForm = () => {
    setEditingPackName(null)
    setPackForm({
      ...createEmptyPackForm(),
      category: 'Creator Drops',
      badge: 'Creator Drop',
      glow: 'from-emerald-300 to-cyan-600',
      coverKey: 'electric',
      coverImageUrl: '',
      adminStatus: 'Active',
      dropType: 'Creator Drop',
      isFeatured: true,
      creatorName: 'SEA Creator',
      creatorHandle: '@seacreator',
      creatorRegion: 'Southeast Asia',
      featuredPrize: 'Secret Rare Mystery Pull',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      revenueShare: '20%',
      campaignOwner: 'Creator Program',
    })
    setIsPackFormOpen(true)
    setActiveTab('creators')
  }

  const openEditPackForm = (pack: ManagedPack) => {
    setEditingPackName(pack.name)
    setPackForm(createPackFormFromPack(pack))
    setIsPackFormOpen(true)
    setActiveTab('packs')
  }

  const openEditCreatorDropForm = (pack: ManagedPack) => {
    setEditingPackName(pack.name)
    setPackForm(createPackFormFromPack(pack))
    setIsPackFormOpen(true)
    setActiveTab('creators')
  }

  const closePackForm = () => {
    setIsPackFormOpen(false)
    setEditingPackName(null)
    setPackForm(createEmptyPackForm())
  }

  const updatePackFormField = (
    field: keyof PackFormState,
    value: string | boolean,
  ) => {
    setPackForm((currentForm) =>
      ({
        ...currentForm,
        [field]: value,
      }) as PackFormState,
    )
  }

  const submitPackForm = () => {
    const trimmedName = packForm.name.trim()

    if (!trimmedName) return

    const totalQuantity = Math.max(Number(packForm.totalQuantity) || 1, 1)
    const remainingQuantity = Math.max(
      Math.min(Number(packForm.remainingQuantity) || 0, totalQuantity),
      0,
    )
    const priceNumber = Math.max(Number(packForm.price) || 0, 0)
    const nextPack: ManagedPack = {
      name: trimmedName,
      category: packForm.category,
      price: `${priceNumber} Points`,
      remaining: formatPackRemaining(remainingQuantity, totalQuantity),
      remainingQuantity,
      totalQuantity,
      badge: packForm.badge.trim() || 'Admin Pack',
      glow: packForm.glow,
      cover: getPackCover(packForm.coverKey, trimmedName, packForm.coverImageUrl),
      coverKey: packForm.coverKey,
      coverImageUrl: packForm.coverImageUrl.trim() || undefined,
      adminStatus: packForm.adminStatus,
      dropType: packForm.dropType.trim() || 'Standard Drop',
      isFeatured: packForm.isFeatured,
      creatorName: packForm.creatorName.trim() || undefined,
      creatorHandle: packForm.creatorHandle.trim() || undefined,
      creatorRegion: packForm.creatorRegion.trim() || undefined,
      featuredPrize: packForm.featuredPrize.trim() || undefined,
      startDate: packForm.startDate || undefined,
      endDate: packForm.endDate || undefined,
      revenueShare: packForm.revenueShare.trim() || undefined,
      campaignOwner: packForm.campaignOwner.trim() || undefined,
    }

    setPacks((currentPacks) => {
      const isEditing = Boolean(editingPackName)
      const duplicatePack = currentPacks.find(
        (pack) =>
          pack.name.toLowerCase() === trimmedName.toLowerCase() &&
          pack.name !== editingPackName,
      )

      if (duplicatePack) return currentPacks

      if (!isEditing) return [nextPack, ...currentPacks]

      return currentPacks.map((pack) =>
        pack.name === editingPackName ? nextPack : pack,
      )
    })

    addTransaction(
      editingPackName ? 'Admin Pack Updated' : 'Admin Pack Created',
      `${trimmedName} was ${editingPackName ? 'updated' : 'created'} from Admin Pack Management.`,
    )

    closePackForm()
  }

  const updatePackStatus = (packName: string, adminStatus: PackAdminStatus) => {
    setPacks((currentPacks) =>
      currentPacks.map((pack) =>
        pack.name === packName
          ? {
              ...pack,
              adminStatus,
            }
          : pack,
      ),
    )

    addTransaction(
      `Admin Pack · ${adminStatus}`,
      `${packName} was changed to ${adminStatus}.`,
    )
  }

  const adjustPackStock = (packName: string, stockDelta: number) => {
    setPacks((currentPacks) =>
      currentPacks.map((pack) => {
        if (pack.name !== packName) return pack

        const remainingQuantity = Math.max(
          Math.min(pack.remainingQuantity + stockDelta, pack.totalQuantity),
          0,
        )

        return {
          ...pack,
          remainingQuantity,
          remaining: formatPackRemaining(remainingQuantity, pack.totalQuantity),
        }
      }),
    )

    addTransaction(
      'Admin Pack Stock Adjusted',
      `${packName} stock was adjusted by ${stockDelta > 0 ? '+' : ''}${stockDelta}.`,
    )
  }

  const refillPackStock = (packName: string) => {
    setPacks((currentPacks) =>
      currentPacks.map((pack) =>
        pack.name === packName
          ? {
              ...pack,
              remainingQuantity: pack.totalQuantity,
              remaining: formatPackRemaining(pack.totalQuantity, pack.totalQuantity),
            }
          : pack,
      ),
    )

    addTransaction('Admin Pack Refilled', `${packName} stock was refilled.`)
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Packs Opened"
          value={totalPacksOpened}
          caption="Total pack openings tracked from quests."
          icon={Boxes}
        />
        <StatCard
          title="Points Spent"
          value={totalPointsSpent.toLocaleString()}
          caption="Demo economy spend across opening and marketplace."
          icon={Wallet}
          accent="text-amber-300"
        />
        <StatCard
          title="Vault Cards"
          value={vaultCards.length}
          caption="Cards owned by the current demo player."
          icon={Gem}
          accent="text-purple-300"
        />
        <StatCard
          title="Shipping Queue"
          value={shippingCards.length}
          caption="Cards waiting for fulfillment action."
          icon={Truck}
          accent="text-emerald-300"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Marketplace"
          value={marketplaceListings.length}
          caption={`${playerMarketplaceListings.length} player listings active.`}
          icon={ShoppingBag}
          accent="text-pink-300"
        />
        <StatCard
          title="Raffle Entries"
          value={raffleEntries.length}
          caption={`${raffleTickets.toLocaleString()} unused tickets remain.`}
          icon={Ticket}
          accent="text-lime-300"
        />
        <StatCard
          title="Fairness Logs"
          value={fairnessRecords.length}
          caption="Provably Fair demo records generated."
          icon={ShieldCheck}
          accent="text-cyan-300"
        />
        <StatCard
          title="Transactions"
          value={transactions.length}
          caption="Wallet, opening, quest, raffle and admin logs."
          icon={ReceiptText}
          accent="text-orange-300"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="hud-panel hud-corners rounded-[2rem] p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="hud-label text-sm">Operational Snapshot</p>
              <h3 className="mt-2 text-2xl font-black text-white">
                Platform Health
              </h3>
            </div>
            <Database className="h-7 w-7 text-cyan-300" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-400">Pack Stock Remaining</span>
                <span className="font-black text-white">
                  {totalStockLeft} / {totalStock}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-purple-400"
                  style={{ width: `${Math.max((totalStockLeft / totalStock) * 100, 3)}%` }}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Wallet
                </p>
                <p className="mt-2 text-xl font-black text-amber-300">
                  {walletBalance.toLocaleString()} pts
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Quest XP
                </p>
                <p className="mt-2 text-xl font-black text-purple-300">
                  {questStats.xp.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Low Stock
                </p>
                <p className="mt-2 text-xl font-black text-rose-300">
                  {packs.filter(isNearlySoldOut).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="hud-panel hud-corners rounded-[2rem] p-6">
          <p className="hud-label text-sm">Latest Activity</p>
          <h3 className="mt-2 text-2xl font-black text-white">Recent Logs</h3>

          <div className="mt-5 space-y-3">
            {transactions.slice(0, 5).length === 0 ? (
              <p className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-400">
                No transaction activity yet.
              </p>
            ) : (
              transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-white">{transaction.title}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-400">
                        {transaction.description}
                      </p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-slate-500">
                      {transaction.createdAt}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderPacks = () => (
    <div className="space-y-6">
      <div className="hud-panel hud-corners rounded-[2rem] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="hud-label text-sm">Admin Pack Management</p>
            <h2 className="mt-2 text-3xl font-black text-white">
              Pack Control Center
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Create new drops, edit prices, adjust stock, pause risky packs, or hide drops from the player lobby.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddPackForm}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-400 px-5 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:scale-[1.02]"
          >
            <Plus className="h-5 w-5" />
            Add New Pack
          </button>
        </div>
      </div>

      {isPackFormOpen && (
        <div className="hud-card hud-corners rounded-[2rem] p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-cyan-300/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="hud-label text-sm">
                {editingPackName ? 'Edit Pack' : 'Create Pack'}
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">
                {editingPackName ?? 'New Pack Drop'}
              </h3>
            </div>

            <button
              type="button"
              onClick={closePackForm}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-500/30 bg-slate-500/10 px-4 py-3 text-sm font-black text-slate-300 transition hover:scale-[1.02]"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Pack Name
              </span>
              <input
                value={packForm.name}
                onChange={(event) => updatePackFormField('name', event.target.value)}
                placeholder="SEA Exclusive Drop"
                className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Category
              </span>
              <select
                value={packForm.category}
                onChange={(event) => updatePackFormField('category', event.target.value)}
                className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
              >
                {packCategoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Status
              </span>
              <select
                value={packForm.adminStatus}
                onChange={(event) =>
                  updatePackFormField('adminStatus', event.target.value as PackAdminStatus)
                }
                className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Hidden">Hidden</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Price Points
              </span>
              <input
                type="number"
                min="0"
                value={packForm.price}
                onChange={(event) => updatePackFormField('price', event.target.value)}
                className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Remaining Stock
              </span>
              <input
                type="number"
                min="0"
                value={packForm.remainingQuantity}
                onChange={(event) => updatePackFormField('remainingQuantity', event.target.value)}
                className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Total Stock
              </span>
              <input
                type="number"
                min="1"
                value={packForm.totalQuantity}
                onChange={(event) => updatePackFormField('totalQuantity', event.target.value)}
                className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Badge
              </span>
              <input
                value={packForm.badge}
                onChange={(event) => updatePackFormField('badge', event.target.value)}
                placeholder="Hot Drop"
                className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Drop Type
              </span>
              <input
                value={packForm.dropType}
                onChange={(event) => updatePackFormField('dropType', event.target.value)}
                placeholder="Creator Drop"
                className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
              />
            </label>

            {packForm.category === 'Creator Drops' && (
              <>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Creator Name
                  </span>
                  <input
                    value={packForm.creatorName}
                    onChange={(event) => updatePackFormField('creatorName', event.target.value)}
                    placeholder="JomCollector"
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Creator Handle
                  </span>
                  <input
                    value={packForm.creatorHandle}
                    onChange={(event) => updatePackFormField('creatorHandle', event.target.value)}
                    placeholder="@jomcollector"
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Creator Region
                  </span>
                  <input
                    value={packForm.creatorRegion}
                    onChange={(event) => updatePackFormField('creatorRegion', event.target.value)}
                    placeholder="Malaysia / SG"
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Featured Prize
                  </span>
                  <input
                    value={packForm.featuredPrize}
                    onChange={(event) => updatePackFormField('featuredPrize', event.target.value)}
                    placeholder="Charizard VMAX Shiny"
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Start Date
                  </span>
                  <input
                    type="date"
                    value={packForm.startDate}
                    onChange={(event) => updatePackFormField('startDate', event.target.value)}
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    End Date
                  </span>
                  <input
                    type="date"
                    value={packForm.endDate}
                    onChange={(event) => updatePackFormField('endDate', event.target.value)}
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Revenue Share
                  </span>
                  <input
                    value={packForm.revenueShare}
                    onChange={(event) => updatePackFormField('revenueShare', event.target.value)}
                    placeholder="20%"
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Campaign Owner
                  </span>
                  <input
                    value={packForm.campaignOwner}
                    onChange={(event) => updatePackFormField('campaignOwner', event.target.value)}
                    placeholder="SEA Creator Program"
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                  />
                </label>
              </>
            )}

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Cover Image Preset
              </span>
              <select
                value={packForm.coverKey}
                onChange={(event) =>
                  updatePackFormField('coverKey', event.target.value as PackCoverKey)
                }
                className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
              >
                {packCoverOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 xl:col-span-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Cover Image URL
              </span>
              <input
                value={packForm.coverImageUrl}
                onChange={(event) => updatePackFormField('coverImageUrl', event.target.value)}
                placeholder="https://example.com/pack-cover.png"
                className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
              />
              <p className="text-xs leading-5 text-slate-500">
                Paste a hosted pack cover URL to make the pack display like a real catalog item. Leave empty to use the preset cover.
              </p>
            </label>

            <div className="xl:col-span-3 rounded-[2rem] border border-cyan-300/15 bg-cyan-300/[0.04] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                    Pack Cover Preview
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    This is how the cover image will appear in the player Pack Catalog.
                  </p>
                </div>
              </div>

              <div className={`mx-auto max-w-xs rounded-[2rem] bg-gradient-to-br ${packForm.glow} p-[1px]`}>
                <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[2rem] bg-black/85 p-4">
                  <img
                    src={getPackCover(packForm.coverKey, packForm.name || 'Preview Pack', packForm.coverImageUrl)}
                    alt="Pack cover preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>

            <label className="space-y-2 xl:col-span-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Visual Glow
              </span>
              <select
                value={packForm.glow}
                onChange={(event) => updatePackFormField('glow', event.target.value)}
                className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
              >
                {packGlowOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-purple-300/20 bg-purple-300/10 px-4 py-3 text-sm font-bold text-purple-200">
              <input
                type="checkbox"
                checked={packForm.isFeatured}
                onChange={(event) => updatePackFormField('isFeatured', event.target.checked)}
                className="h-4 w-4 accent-cyan-300"
              />
              Featured Creator Drop
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closePackForm}
              className="rounded-2xl border border-slate-500/30 bg-slate-500/10 px-6 py-4 font-black text-slate-300 transition hover:scale-[1.02]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submitPackForm}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-400 px-6 py-4 font-black text-black transition hover:scale-[1.02]"
            >
              <Save className="h-5 w-5" />
              Save Pack
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {packs.map((pack) => {
          const opened = pack.totalQuantity - pack.remainingQuantity
          const sellThrough = Math.round((opened / pack.totalQuantity) * 100)
          const adminStatus = pack.adminStatus ?? 'Active'

          return (
            <div key={pack.name} className="hud-card hud-corners rounded-[2rem] p-5">
              <div className="grid gap-4 sm:grid-cols-[110px_1fr]">
                <div className={`rounded-3xl bg-gradient-to-br ${pack.glow} p-[1px]`}>
                  <div className="flex h-full min-h-[150px] items-center justify-center rounded-3xl bg-black/80 p-3">
                    <img
                      src={pack.cover}
                      alt={pack.name}
                      className="max-h-[140px] object-contain"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-200">
                      {pack.category}
                    </span>
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-200">
                      {pack.badge}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getPackStatusStyle(adminStatus)}`}>
                      {adminStatus}
                    </span>
                    {isNearlySoldOut(pack) && (
                      <span className="rounded-full border border-rose-300/20 bg-rose-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-200">
                        Nearly Sold Out
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-white">{pack.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {pack.dropType ?? 'Standard Drop'} {pack.isFeatured ? '· Featured' : ''}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Price
                      </p>
                      <p className="mt-1 font-black text-cyan-200">
                        {getPackCost(pack)} pts
                      </p>
                    </div>
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Stock
                      </p>
                      <p className="mt-1 font-black text-white">{pack.remaining}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Opened
                      </p>
                      <p className="mt-1 font-black text-purple-300">
                        {opened} · {sellThrough}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    <button
                      type="button"
                      onClick={() => openEditPackForm(pack)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-3 text-xs font-black uppercase tracking-wider text-cyan-200 transition hover:scale-[1.02]"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => adjustPackStock(pack.name, 10)}
                      className="rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-3 py-3 text-xs font-black uppercase tracking-wider text-emerald-300 transition hover:scale-[1.02]"
                    >
                      +10 Stock
                    </button>

                    <button
                      type="button"
                      onClick={() => refillPackStock(pack.name)}
                      className="rounded-xl border border-purple-300/30 bg-purple-300/10 px-3 py-3 text-xs font-black uppercase tracking-wider text-purple-300 transition hover:scale-[1.02]"
                    >
                      Refill
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updatePackStatus(
                          pack.name,
                          adminStatus === 'Active' ? 'Paused' : 'Active',
                        )
                      }
                      className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-3 text-xs font-black uppercase tracking-wider text-amber-300 transition hover:scale-[1.02]"
                    >
                      {adminStatus === 'Active' ? 'Pause' : 'Activate'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => updatePackStatus(pack.name, 'Hidden')}
                    className="mt-3 w-full rounded-xl border border-slate-500/30 bg-slate-500/10 px-3 py-3 text-xs font-black uppercase tracking-wider text-slate-300 transition hover:scale-[1.02]"
                  >
                    Hide From Player Lobby
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderCatalog = () => (
    <CardCatalogPanel mode="admin" />
  )

  const renderShipping = () => (
    <div className="space-y-4">
      {shippingCards.length === 0 ? (
        <div className="hud-panel hud-corners rounded-[2rem] p-8 text-center">
          <Truck className="mx-auto h-10 w-10 text-cyan-300" />
          <h3 className="mt-4 text-2xl font-black text-white">
            No Shipping Requests
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Player shipping requests will appear here after they submit an address.
          </p>
        </div>
      ) : (
        shippingCards.map((card) => {
          const nextStatus = getNextShippingStatus(card.status)
          const trackingValue = trackingInputs[card.id] ?? ''

          return (
            <div key={card.id} className="hud-card hud-corners rounded-[2rem] p-5">
              <div className="grid gap-5 xl:grid-cols-[130px_1fr_260px]">
                <div className="flex min-h-[170px] items-center justify-center rounded-3xl border border-cyan-300/10 bg-black/50 p-3">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="max-h-[160px] object-contain"
                  />
                </div>

                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-200">
                      {card.rarity}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getStatusStyle(card.status)}`}>
                      {card.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white">{card.name}</h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.2em] text-cyan-300">
                    {card.sourcePack}
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Recipient
                      </p>
                      <p className="mt-2 font-black text-white">
                        {card.shippingInfo?.fullName || 'Missing Name'}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {card.shippingInfo?.phone || 'No phone'} · {card.shippingInfo?.email || 'No email'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                        Address
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {card.shippingInfo?.address || 'No address'}
                        <br />
                        {card.shippingInfo?.postcode} {card.shippingInfo?.city}, {card.shippingInfo?.state}
                      </p>
                    </div>
                  </div>

                  {card.shippingInfo?.trackingNumber && (
                    <p className="mt-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm font-bold text-emerald-300">
                      Tracking: {card.shippingInfo.trackingNumber}
                    </p>
                  )}
                </div>

                <div className="rounded-3xl border border-purple-300/10 bg-purple-300/[0.04] p-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                    Fulfillment Control
                  </p>

                  <div className="mt-4 space-y-2">
                    {shippingStatusSteps.map((status) => (
                      <div
                        key={status}
                        className={`rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-widest ${
                          card.status === status
                            ? getStatusStyle(status)
                            : 'border-slate-700 bg-slate-900/40 text-slate-500'
                        }`}
                      >
                        {status}
                      </div>
                    ))}
                  </div>

                  <input
                    value={trackingValue}
                    onChange={(event) =>
                      setTrackingInputs((currentInputs) => ({
                        ...currentInputs,
                        [card.id]: event.target.value,
                      }))
                    }
                    placeholder="Tracking number"
                    className="mt-4 w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                  />

                  <button
                    type="button"
                    disabled={!nextStatus}
                    onClick={() =>
                      nextStatus &&
                      updateShippingStatus(card.id, nextStatus, trackingValue)
                    }
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-wider transition ${
                      nextStatus
                        ? 'bg-gradient-to-r from-cyan-300 to-purple-400 text-black hover:scale-[1.02]'
                        : 'cursor-not-allowed border border-slate-600 bg-slate-800 text-slate-500'
                    }`}
                  >
                    {nextStatus ? `Mark ${nextStatus}` : 'Completed'}
                    {nextStatus && <ChevronRight className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )

  const renderMarketplace = () => (
    <div className="grid gap-4 xl:grid-cols-2">
      {marketplaceListings.map((listing) => (
        <div key={listing.id} className="hud-card hud-corners rounded-[2rem] p-5">
          <div className="grid gap-4 sm:grid-cols-[110px_1fr]">
            <div className="flex min-h-[150px] items-center justify-center rounded-3xl border border-cyan-300/10 bg-black/50 p-3">
              <img
                src={listing.card.image}
                alt={listing.card.name}
                className="max-h-[140px] object-contain"
              />
            </div>
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-purple-200">
                  {listing.source === 'player' ? 'Player Listing' : 'Demo Seller'}
                </span>
                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-200">
                  {listing.card.rarity}
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">{listing.card.name}</h3>
              <p className="mt-1 text-sm text-slate-400">
                Seller: {listing.seller} · {listing.listedAt}
              </p>
              <p className="mt-4 text-3xl font-black text-cyan-300">
                {listing.price.toLocaleString()} pts
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderRaffle = () => {
    const eligibleEntries = raffleEntries.filter(
      (entry) => entry.status !== 'Winner Selected',
    )
    const totalTicketsEntered = raffleEntries.reduce(
      (total, entry) => total + entry.tickets,
      0,
    )

    return (
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Ticket Balance"
            value={raffleTickets.toLocaleString()}
            caption="Unused demo raffle tickets."
            icon={Ticket}
            accent="text-lime-300"
          />
          <StatCard
            title="Total Entries"
            value={raffleEntries.length}
            caption="Player entries into weekly prize pools."
            icon={Sparkles}
            accent="text-purple-300"
          />
          <StatCard
            title="Tickets Entered"
            value={totalTicketsEntered}
            caption="Total committed tickets."
            icon={Crown}
            accent="text-amber-300"
          />
          <StatCard
            title="Winners"
            value={raffleWinners.length}
            caption="Drawn raffle winners."
            icon={Trophy}
            accent="text-emerald-300"
          />
        </div>

        <div className="hud-panel hud-corners rounded-[2rem] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="hud-label text-sm">Raffle Draw Control</p>
              <h2 className="mt-2 text-3xl font-black text-white">
                Draw Winner
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Select a random winning entry from all active raffle entries. Winner history will be saved to LocalStorage and shown on the player Raffle Center.
              </p>
            </div>

            <button
              type="button"
              disabled={eligibleEntries.length === 0}
              onClick={drawRaffleWinner}
              className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-wider transition ${
                eligibleEntries.length === 0
                  ? 'cursor-not-allowed border border-slate-600 bg-slate-800 text-slate-500'
                  : 'bg-gradient-to-r from-lime-300 to-emerald-400 text-black hover:scale-[1.02]'
              }`}
            >
              <Trophy className="h-5 w-5" />
              Draw Winner
            </button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <div className="space-y-4">
            <div>
              <p className="hud-label text-sm">Raffle Entries</p>
              <h3 className="mt-2 text-2xl font-black text-white">
                Entry Pool
              </h3>
            </div>

            {raffleEntries.length === 0 ? (
              <div className="hud-panel hud-corners rounded-[2rem] p-8 text-center">
                <Ticket className="mx-auto h-10 w-10 text-lime-300" />
                <h3 className="mt-4 text-2xl font-black text-white">
                  No Raffle Entries
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Entries will appear here after the player enters the raffle center.
                </p>
              </div>
            ) : (
              raffleEntries.map((entry) => (
                <div key={entry.id} className="hud-card hud-corners rounded-[2rem] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-lime-300">
                        {entry.status}
                      </p>
                      <h3 className="mt-2 text-2xl font-black text-white">
                        {entry.prizeName}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">
                        Entry ID: {getShortId(entry.id)} · {entry.createdAt}
                      </p>
                    </div>

                    <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-black text-amber-200">
                      {entry.tickets} tickets
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="hud-label text-sm">Winner History</p>
              <h3 className="mt-2 text-2xl font-black text-white">
                Draw Results
              </h3>
            </div>

            {raffleWinners.length === 0 ? (
              <div className="hud-panel hud-corners rounded-[2rem] p-8 text-center">
                <Trophy className="mx-auto h-10 w-10 text-emerald-300" />
                <h3 className="mt-4 text-2xl font-black text-white">
                  No Winners Yet
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Draw a winner to generate public winner history.
                </p>
              </div>
            ) : (
              raffleWinners.map((winner) => (
                <div key={winner.id} className="hud-card hud-corners rounded-[2rem] p-5">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-300">
                    {winner.status}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {winner.winnerName}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Won {winner.prizeName} with {winner.tickets} tickets.
                    <br />
                    Entry: {getShortId(winner.winningEntryId)} · {winner.drawnAt}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderCreators = () => {
    const creatorPacks = packs.filter((pack) => pack.category === 'Creator Drops')

    return (
      <div className="space-y-6">
        <div className="hud-panel hud-corners rounded-[2rem] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="hud-label text-sm">Creator Drop Admin Control</p>
              <h2 className="mt-2 text-3xl font-black text-white">
                Creator Collaboration Drops
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Create and manage KOL, streamer, anime community, and SEA collector drops.
                Creator drops sync to the player lobby, Featured Creator Drops, Creator filter, and Nearly Sold Out filter.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddCreatorDropForm}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-300 to-cyan-400 px-5 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:scale-[1.02]"
            >
              <Plus className="h-5 w-5" />
              Create Creator Drop
            </button>
          </div>
        </div>

        {isPackFormOpen && activeTab === 'creators' && (
          <div className="hud-card hud-corners rounded-[2rem] p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-emerald-300/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="hud-label text-sm">
                  {editingPackName ? 'Edit Creator Drop' : 'Create Creator Drop'}
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">
                  {editingPackName ?? 'New Creator Campaign'}
                </h3>
              </div>

              <button
                type="button"
                onClick={closePackForm}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-500/30 bg-slate-500/10 px-4 py-3 text-sm font-black text-slate-300 transition hover:scale-[1.02]"
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2 xl:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Drop Name</span>
                <input
                  value={packForm.name}
                  onChange={(event) => updatePackFormField('name', event.target.value)}
                  placeholder="SEA Creator Mega Drop"
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Creator Name</span>
                <input
                  value={packForm.creatorName}
                  onChange={(event) => updatePackFormField('creatorName', event.target.value)}
                  placeholder="JomCollector"
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Handle</span>
                <input
                  value={packForm.creatorHandle}
                  onChange={(event) => updatePackFormField('creatorHandle', event.target.value)}
                  placeholder="@jomcollector"
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Region</span>
                <input
                  value={packForm.creatorRegion}
                  onChange={(event) => updatePackFormField('creatorRegion', event.target.value)}
                  placeholder="Malaysia / SG"
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Price Points</span>
                <input
                  type="number"
                  min="0"
                  value={packForm.price}
                  onChange={(event) => updatePackFormField('price', event.target.value)}
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Remaining Stock</span>
                <input
                  type="number"
                  min="0"
                  value={packForm.remainingQuantity}
                  onChange={(event) => updatePackFormField('remainingQuantity', event.target.value)}
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Total Stock</span>
                <input
                  type="number"
                  min="1"
                  value={packForm.totalQuantity}
                  onChange={(event) => updatePackFormField('totalQuantity', event.target.value)}
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Badge</span>
                <input
                  value={packForm.badge}
                  onChange={(event) => updatePackFormField('badge', event.target.value)}
                  placeholder="Creator Drop"
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2 xl:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Featured Prize</span>
                <input
                  value={packForm.featuredPrize}
                  onChange={(event) => updatePackFormField('featuredPrize', event.target.value)}
                  placeholder="Charizard VMAX Shiny"
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Start Date</span>
                <input
                  type="date"
                  value={packForm.startDate}
                  onChange={(event) => updatePackFormField('startDate', event.target.value)}
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">End Date</span>
                <input
                  type="date"
                  value={packForm.endDate}
                  onChange={(event) => updatePackFormField('endDate', event.target.value)}
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Revenue Share</span>
                <input
                  value={packForm.revenueShare}
                  onChange={(event) => updatePackFormField('revenueShare', event.target.value)}
                  placeholder="20%"
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Campaign Owner</span>
                <input
                  value={packForm.campaignOwner}
                  onChange={(event) => updatePackFormField('campaignOwner', event.target.value)}
                  placeholder="Creator Program"
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Status</span>
                <select
                  value={packForm.adminStatus}
                  onChange={(event) => updatePackFormField('adminStatus', event.target.value as PackAdminStatus)}
                  className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-bold text-amber-200">
                <input
                  type="checkbox"
                  checked={packForm.isFeatured}
                  onChange={(event) => updatePackFormField('isFeatured', event.target.checked)}
                  className="h-4 w-4 accent-cyan-300"
                />
                Featured on Player Home
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closePackForm}
                className="rounded-2xl border border-slate-500/30 bg-slate-500/10 px-6 py-4 font-black text-slate-300 transition hover:scale-[1.02]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitPackForm}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-300 to-cyan-400 px-6 py-4 font-black text-black transition hover:scale-[1.02]"
              >
                <Save className="h-5 w-5" />
                Save Creator Drop
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Creator Drops"
            value={creatorPacks.length}
            caption="All creator collaboration packs"
            icon={Users}
            accent="text-emerald-300"
          />
          <StatCard
            title="Featured"
            value={creatorPacks.filter((pack) => pack.isFeatured).length}
            caption="Shown in Featured Creator Drops"
            icon={Crown}
            accent="text-amber-300"
          />
          <StatCard
            title="Creator Stock"
            value={creatorPacks.reduce((total, pack) => total + pack.remainingQuantity, 0)}
            caption="Remaining creator drop stock"
            icon={Boxes}
            accent="text-cyan-300"
          />
          <StatCard
            title="Creator Sales"
            value={creatorPacks.reduce((total, pack) => total + (pack.totalQuantity - pack.remainingQuantity), 0)}
            caption="Packs opened from creator drops"
            icon={BarChart3}
            accent="text-purple-300"
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {creatorPacks.length === 0 ? (
            <div className="hud-panel hud-corners rounded-[2rem] p-8 text-center xl:col-span-2">
              <Users className="mx-auto h-10 w-10 text-emerald-300" />
              <h3 className="mt-4 text-2xl font-black text-white">
                No Creator Drops Yet
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Create the first creator collaboration drop to show it on the player platform.
              </p>
            </div>
          ) : (
            creatorPacks.map((pack) => {
              const opened = pack.totalQuantity - pack.remainingQuantity
              const sellThrough = Math.round((opened / pack.totalQuantity) * 100)

              return (
                <div key={pack.name} className="hud-card hud-corners rounded-[2rem] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div
                      className={`flex h-32 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${pack.glow} p-[1px]`}
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-black/80 p-2">
                        <img src={pack.cover} alt={pack.name} className="h-full w-full object-contain" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-200">
                          {pack.adminStatus ?? 'Active'}
                        </span>
                        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-200">
                          {pack.badge}
                        </span>
                        {pack.isFeatured && (
                          <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-200">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="truncate text-2xl font-black text-white">{pack.name}</h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {pack.creatorName ?? 'SEA Creator'} · {pack.creatorHandle ?? '@creator'} · {pack.creatorRegion ?? 'Southeast Asia'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-purple-300/15 bg-purple-300/[0.05] p-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-purple-300">
                      Featured Prize
                    </p>
                    <p className="mt-1 font-black text-white">
                      {pack.featuredPrize ?? 'Mystery Chase Card'}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Price</p>
                      <p className="mt-1 font-black text-cyan-300">{getPackCost(pack)} pts</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Stock</p>
                      <p className="mt-1 font-black text-white">{pack.remaining}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Opened</p>
                      <p className="mt-1 font-black text-purple-300">{opened} · {sellThrough}%</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Share</p>
                      <p className="mt-1 font-black text-emerald-300">{pack.revenueShare || 'TBC'}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-500/20 bg-slate-500/10 p-3">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Campaign</p>
                      <p className="mt-1 text-sm font-bold text-slate-300">
                        {pack.startDate || 'No start'} → {pack.endDate || 'No end'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-500/20 bg-slate-500/10 p-3">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Owner</p>
                      <p className="mt-1 text-sm font-bold text-slate-300">{pack.campaignOwner || 'Creator Ops'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-500/20 bg-slate-500/10 p-3">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Drop Type</p>
                      <p className="mt-1 text-sm font-bold text-slate-300">{pack.dropType ?? 'Creator Drop'}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    <button
                      type="button"
                      onClick={() => openEditCreatorDropForm(pack)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-3 text-xs font-black uppercase tracking-wider text-cyan-200 transition hover:scale-[1.02]"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePackStatus(pack.name, 'Active')}
                      className="rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-3 py-3 text-xs font-black uppercase tracking-wider text-emerald-300 transition hover:scale-[1.02]"
                    >
                      Activate
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePackStatus(pack.name, 'Paused')}
                      className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-3 text-xs font-black uppercase tracking-wider text-amber-300 transition hover:scale-[1.02]"
                    >
                      Pause
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePackStatus(pack.name, 'Hidden')}
                      className="rounded-xl border border-slate-400/30 bg-slate-400/10 px-3 py-3 text-xs font-black uppercase tracking-wider text-slate-300 transition hover:scale-[1.02]"
                    >
                      Hide
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }


  const renderFairness = () => (
    <div className="space-y-4">
      {fairnessRecords.length === 0 ? (
        <div className="hud-panel hud-corners rounded-[2rem] p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-cyan-300" />
          <h3 className="mt-4 text-2xl font-black text-white">
            No Fairness Logs
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Open packs from the player side to generate provably fair records.
          </p>
        </div>
      ) : (
        fairnessRecords.slice(0, 20).map((record) => (
          <div key={record.id} className="hud-card hud-corners rounded-[2rem] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">
                  {record.verificationId}
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">
                  {record.cardName}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {record.packName} · {record.rarity} · Nonce {record.nonce}
                </p>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-300">
                {record.status}
              </span>
            </div>
            <div className="mt-4 rounded-2xl border border-cyan-300/10 bg-black/30 p-4">
              <p className="break-all text-xs leading-6 text-slate-400">
                Server Seed Hash: {record.serverSeedHash}
                <br />
                Client Seed: {record.clientSeed}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderUsers = () => {
    const currentUserTransactions = selectedUser?.id === 'current-player' ? transactions : []

    return (
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="hud-panel hud-corners rounded-[2rem] p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="hud-label text-sm">User Management</p>
                <h3 className="mt-2 text-2xl font-black text-white">
                  Player Wallet View
                </h3>
              </div>
              <Users className="h-7 w-7 text-cyan-300" />
            </div>

            <p className="text-sm leading-6 text-slate-400">
              Demo user profiles are prepared for future Supabase auth, wallet
              ledger, VIP tiering, and asset ownership tracking.
            </p>
          </div>

          {adminUsers.map((user) => {
            const isSelected = selectedUser?.id === user.id

            return (
              <button
                key={user.id}
                type="button"
                onClick={() => setSelectedUserId(user.id)}
                className={`hud-card hud-corners w-full rounded-[2rem] p-5 text-left transition hover:scale-[1.01] ${
                  isSelected ? 'border-cyan-300/40 bg-cyan-300/[0.08]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getUserTierStyle(user.tier)}`}>
                        {user.tier}
                      </span>
                      <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                        {user.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white">{user.name}</h3>
                    <p className="mt-1 text-sm text-cyan-300">{user.handle}</p>
                    <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-amber-300">
                      {user.walletBalance.toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                      Points
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                      Opened
                    </p>
                    <p className="mt-1 font-black text-white">
                      {user.totalPacksOpened.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-3">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                      Vault
                    </p>
                    <p className="mt-1 font-black text-purple-300">
                      {user.vaultCards}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-3">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                      Spent
                    </p>
                    <p className="mt-1 font-black text-amber-300">
                      {user.totalPointsSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {selectedUser && (
          <div className="space-y-6">
            <div className="hud-panel hud-corners rounded-[2rem] p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getUserTierStyle(selectedUser.tier)}`}>
                      {selectedUser.tier}
                    </span>
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-300">
                      {selectedUser.status}
                    </span>
                  </div>

                  <p className="hud-label text-sm">User Detail</p>
                  <h3 className="mt-2 text-3xl font-black text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="mt-2 text-sm text-cyan-300">{selectedUser.handle}</p>
                  <p className="mt-1 text-sm text-slate-500">{selectedUser.email}</p>
                </div>

                <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5 text-right">
                  <Wallet className="ml-auto h-7 w-7 text-amber-300" />
                  <p className="mt-3 text-3xl font-black text-amber-300">
                    {selectedUser.walletBalance.toLocaleString()}
                  </p>
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-200">
                    Wallet Points
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Packs Opened"
                  value={selectedUser.totalPacksOpened.toLocaleString()}
                  caption="Total player opening activity."
                  icon={Boxes}
                />
                <StatCard
                  title="Vault Cards"
                  value={selectedUser.vaultCards}
                  caption="Cards owned or stored in vault."
                  icon={Gem}
                  accent="text-purple-300"
                />
                <StatCard
                  title="Shipping"
                  value={selectedUser.shippingRequests}
                  caption="Cards requested for fulfillment."
                  icon={Truck}
                  accent="text-emerald-300"
                />
                <StatCard
                  title="Raffle Entries"
                  value={selectedUser.raffleEntries}
                  caption="Total raffle participation."
                  icon={Ticket}
                  accent="text-lime-300"
                />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="hud-panel hud-corners rounded-[2rem] p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Wallet className="h-6 w-6 text-amber-300" />
                  <div>
                    <p className="hud-label text-sm">Wallet Ledger Summary</p>
                    <h3 className="mt-1 text-2xl font-black text-white">
                      Points Flow
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    ['Total Top Up', selectedUser.totalTopUp, 'text-emerald-300'],
                    ['Total Points Spent', selectedUser.totalPointsSpent, 'text-rose-300'],
                    ['Sell Back Earned', selectedUser.sellBackEarned, 'text-amber-300'],
                    ['Quest Rewards', selectedUser.questRewards, 'text-purple-300'],
                    ['Raffle Spend', selectedUser.raffleSpend, 'text-pink-300'],
                  ].map(([label, value, color]) => (
                    <div
                      key={String(label)}
                      className="flex items-center justify-between rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4"
                    >
                      <p className="text-sm font-bold text-slate-400">{label}</p>
                      <p className={`text-lg font-black ${color}`}>
                        {Number(value).toLocaleString()} pts
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hud-panel hud-corners rounded-[2rem] p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Database className="h-6 w-6 text-cyan-300" />
                  <div>
                    <p className="hud-label text-sm">Activity Summary</p>
                    <h3 className="mt-1 text-2xl font-black text-white">
                      Platform Behavior
                    </h3>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                      Marketplace Buys
                    </p>
                    <p className="mt-2 text-2xl font-black text-cyan-300">
                      {selectedUser.marketplacePurchases}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                      Last Active
                    </p>
                    <p className="mt-2 text-sm font-black text-purple-300">
                      {selectedUser.lastActive}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] p-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                      Shipping Requests
                    </p>
                    <p className="mt-2 text-2xl font-black text-emerald-300">
                      {selectedUser.shippingRequests}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-pink-300/10 bg-pink-300/[0.04] p-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                      Raffle Entries
                    </p>
                    <p className="mt-2 text-2xl font-black text-pink-300">
                      {selectedUser.raffleEntries}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hud-panel hud-corners rounded-[2rem] p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="hud-label text-sm">User Transaction Preview</p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {selectedUser.id === 'current-player'
                      ? 'Current Player Ledger'
                      : 'Demo User Ledger Preview'}
                  </h3>
                </div>
                <ReceiptText className="h-7 w-7 text-purple-300" />
              </div>

              {selectedUser.id !== 'current-player' ? (
                <p className="rounded-2xl border border-purple-300/15 bg-purple-300/[0.05] p-4 text-sm leading-6 text-slate-300">
                  Demo users are placeholder profiles for the future Supabase user
                  table. After backend integration, this panel will show each
                  user's real wallet ledger, vault ownership, shipping requests,
                  and marketplace activity.
                </p>
              ) : currentUserTransactions.length === 0 ? (
                <p className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4 text-sm text-slate-400">
                  No transactions yet for the current player.
                </p>
              ) : (
                <div className="space-y-3">
                  {currentUserTransactions.slice(0, 6).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex flex-col gap-2 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4 lg:flex-row lg:items-start lg:justify-between"
                    >
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                          {transaction.type} · {transaction.status}
                        </p>
                        <h4 className="mt-1 font-black text-white">
                          {transaction.title}
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {transaction.description}
                        </p>
                      </div>
                      <div className="text-left lg:text-right">
                        <p
                          className={`font-black ${
                            transaction.amount >= 0
                              ? 'text-emerald-300'
                              : 'text-rose-300'
                          }`}
                        >
                          {transaction.amount >= 0 ? '+' : ''}
                          {transaction.amount.toLocaleString()} pts
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {transaction.createdAt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderTransactions = () => (
    <div className="space-y-3">
      {transactions.length === 0 ? (
        <div className="hud-panel hud-corners rounded-[2rem] p-8 text-center">
          <ReceiptText className="mx-auto h-10 w-10 text-purple-300" />
          <h3 className="mt-4 text-2xl font-black text-white">
            No Transactions
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Player actions and admin updates will be listed here.
          </p>
        </div>
      ) : (
        transactions.map((transaction) => (
          <div key={transaction.id} className="hud-card hud-corners rounded-[2rem] p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  {transaction.type} · {transaction.status}
                </p>
                <h3 className="mt-2 text-xl font-black text-white">
                  {transaction.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {transaction.description}
                </p>
              </div>
              <div className="text-left lg:text-right">
                <p
                  className={`text-lg font-black ${
                    transaction.amount >= 0 ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {transaction.amount >= 0 ? '+' : ''}
                  {transaction.amount.toLocaleString()} pts
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Balance: {transaction.balanceAfter.toLocaleString()} pts
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {transaction.createdAt}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderSettings = () => (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <div className="hud-panel hud-corners rounded-[2rem] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-300/30 bg-rose-300/10">
            <RotateCcw className="h-6 w-6 text-rose-300" />
          </div>
          <div>
            <p className="hud-label text-sm">Demo Tools</p>
            <h3 className="mt-1 text-2xl font-black text-white">
              Reset Demo Data
            </h3>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-400">
          This clears wallet changes, vault cards, shipping requests, quests,
          raffle entries, marketplace player listings, fairness logs, and
          transaction history. Demo marketplace seed listings will be restored.
        </p>

        <button
          type="button"
          onClick={resetDemoData}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-300/30 bg-rose-300/10 px-6 py-4 font-black uppercase tracking-wider text-rose-200 transition hover:scale-[1.02] hover:bg-rose-300/20"
        >
          <RotateCcw className="h-5 w-5" />
          Reset Demo Data
        </button>
      </div>

      <div className="hud-panel hud-corners rounded-[2rem] p-6">
        <p className="hud-label text-sm">Navigation</p>
        <h3 className="mt-2 text-2xl font-black text-white">Platform Links</h3>
        <div className="mt-5 space-y-3">
          <a
            href="/"
            className="flex items-center justify-between rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-4 font-black text-cyan-200 transition hover:bg-cyan-300/20"
          >
            <span className="flex items-center gap-2">
              <Home className="h-5 w-5" /> Player Platform
            </span>
            <ChevronRight className="h-5 w-5" />
          </a>
          <a
            href="/admin"
            className="flex items-center justify-between rounded-2xl border border-purple-300/20 bg-purple-300/10 px-5 py-4 font-black text-purple-200 transition hover:bg-purple-300/20"
          >
            <span className="flex items-center gap-2">
              <Settings className="h-5 w-5" /> Admin Dashboard
            </span>
            <ChevronRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  )

  const renderActiveTab = () => {
    if (activeTab === 'overview') return renderOverview()
    if (activeTab === 'packs') return renderPacks()
    if (activeTab === 'catalog') return renderCatalog()
    if (activeTab === 'shipping') return renderShipping()
    if (activeTab === 'marketplace') return renderMarketplace()
    if (activeTab === 'raffle') return renderRaffle()
    if (activeTab === 'creators') return renderCreators()
    if (activeTab === 'fairness') return renderFairness()
    if (activeTab === 'users') return renderUsers()
    if (activeTab === 'transactions') return renderTransactions()

    return renderSettings()
  }

  const activeTabMeta = adminTabs.find((tab) => tab.id === activeTab)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <SciFiBackground />

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-cyan-300/10 bg-black/30 p-5 backdrop-blur-xl lg:block">
          <a href="/" className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_35px_rgba(34,211,238,0.22)]">
              <Crown className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300">
                Jomluffyz
              </p>
              <h1 className="text-lg font-black leading-tight">
                Admin Center
              </h1>
            </div>
          </a>

          <nav className="space-y-2">
            {adminTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black uppercase tracking-wider transition ${
                    isActive
                      ? 'border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.12)]'
                      : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              )
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-purple-300/15 bg-purple-300/[0.05] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-300">
              Phase 4B
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Admin User / Wallet View V1 prepares user asset management before Supabase.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-6 lg:px-8">
          <header className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="hud-label text-sm">Admin Platform</p>
              <h2 className="mt-2 text-4xl font-black text-white lg:text-5xl">
                {activeTabMeta?.label ?? 'Dashboard'}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Manage the SEA-focused online TCG pack opening platform across packs,
                users, wallet, vault assets, shipping, marketplace, raffle, creator drops, transactions and fairness logs.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/"
                className="flex items-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-200 transition hover:scale-105 hover:bg-cyan-300/20"
              >
                <Home className="h-4 w-4" />
                Player Side
              </a>
              <button
                type="button"
                onClick={resetDemoData}
                className="flex items-center gap-2 rounded-2xl border border-rose-300/30 bg-rose-300/10 px-5 py-3 text-sm font-black text-rose-200 transition hover:scale-105 hover:bg-rose-300/20"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Demo
              </button>
            </div>
          </header>

          <div className="mb-6 grid grid-cols-2 gap-2 lg:hidden">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-wider transition ${
                  activeTab === tab.id
                    ? 'border border-cyan-300/30 bg-cyan-300/10 text-cyan-200'
                    : 'border border-slate-700 bg-slate-900/50 text-slate-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {renderActiveTab()}
        </main>
      </div>
    </div>
  )
}
