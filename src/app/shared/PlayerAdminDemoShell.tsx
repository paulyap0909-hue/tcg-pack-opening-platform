import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Crown,
  Filter,
  Gem,
  PackageOpen,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Trophy,
  Wallet,
  Zap,
} from 'lucide-react'

import '../../styles/sci-fi-hud.css'

import SciFiBackground from '../../components/SciFiBackground'
import PackDetailModal from '../../components/PackDetailModal'
import PackOpeningModal from '../../components/PackOpeningModal'
import MultiOpenModal from '../../components/MultiOpenModal'
import TopUpModal from '../../components/TopUpModal'
import VaultDrawer, {
  type ShippingInfo,
  type ShippingStatus,
  type VaultCard,
  getSellBackPoints,
} from '../../components/VaultDrawer'
import LivePullFeed from '../../components/LivePullFeed'
import TransactionDrawer, {
  type TransactionRecord,
  type TransactionType,
} from '../../components/TransactionDrawer'
import SellBackConfirmModal from '../../components/SellBackConfirmModal'
import ShippingConfirmModal from '../../components/ShippingConfirmModal'
import AdminControlCenterDrawer from '../../components/AdminControlCenterDrawer'
import QuestLeaderboardPanel, {
  initialQuestStats,
  type QuestReward,
  type QuestStats,
} from '../../components/QuestLeaderboardPanel'
import RaffleCenterPanel, {
  type RaffleEntry,
  type RafflePrize,
  type RaffleWinner,
} from '../../components/RaffleCenterPanel'
import CreatorDropsPanel from '../../components/CreatorDropsPanel'
import FairnessCenterPanel, {
  type FairnessRecord,
} from '../../components/FairnessCenterPanel'
import MarketplacePanel, {
  type MarketplaceListing,
} from '../../components/MarketplacePanel'
import ListForSaleModal from '../../components/ListForSaleModal'
import HeroPackSection from '../../components/HeroPackSection'
import DailyLoginRewardModal from '../../components/DailyLoginRewardModal'
import LiveAuctionPanel from '../../components/LiveAuctionPanel'
import PlayerWalletPanel from '../../components/PlayerWalletPanel'

import type { Pack } from '../../data/cardPool'
import { pokemonPackCoverUrls } from '../../data/cardPool'
import {
  getDailyRewardForStreak,
  getNextDailyStreakDay,
  getTodayDateKey,
  hasClaimedDailyRewardToday,
  initialDailyLoginState,
  type DailyLoginState,
} from '../../data/dailyLoginRewards'

import heroPremiumShinyPack from '../../assets/decks/hero-premium-shiny-pack.png'

type ActiveModal = 'detail' | 'opening' | 'multi-opening' | null

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

type PackCategory =
  | 'All'
  | 'Pokémon Inspired'
  | 'One Piece Inspired'
  | 'Premium Mystery Pack'
  | 'Creator Drops'
  | 'Nearly Sold Out'

type PackSortOption =
  | 'Latest'
  | 'Price: Low to High'
  | 'Price: High to Low'
  | 'A-Z'

type QuestStatIncrement = Partial<
  Pick<
    QuestStats,
    'openPacks' | 'open1' | 'open10' | 'open100' | 'sellBack' | 'shipping' | 'topUp'
  >
>

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
  dailyLogin: 'tcg-platform-daily-login-v1',
}

const categoryFilters: PackCategory[] = [
  'All',
  'Pokémon Inspired',
  'One Piece Inspired',
  'Premium Mystery Pack',
  'Creator Drops',
  'Nearly Sold Out',
]

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


const isPackAvailableToPlayer = (pack: ManagedPack) => {
  return (pack.adminStatus ?? 'Active') === 'Active'
}


const formatPackRemaining = (
  remainingQuantity: number,
  totalQuantity: number,
) => {
  if (remainingQuantity <= 0) {
    return 'Sold Out'
  }

  return `${remainingQuantity} / ${totalQuantity} left`
}

const getPackCost = (pack: Pack) => {
  return Number(pack.price.replace(/[^0-9]/g, '')) || 0
}

const getTransactionTime = () => {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
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


const createRandomHex = (length = 16) => {
  const characters = 'abcdef0123456789'

  return Array.from({ length }, () =>
    characters[Math.floor(Math.random() * characters.length)],
  ).join('')
}

const createDemoHash = (value: string) => {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return `sha256-demo-${Math.abs(hash).toString(16).padStart(8, '0')}-${createRandomHex(12)}`
}

const createFairnessRecord = (
  packName: string,
  card: VaultCard,
  nonce: number,
): FairnessRecord => {
  const serverSeed = `server-${packName}-${card.id}-${nonce}-${createRandomHex(24)}`
  const clientSeed = `client-${createRandomHex(8)}-${Date.now().toString(36)}`
  const serverSeedHash = createDemoHash(serverSeed)
  const verificationId = `FAIR-${Date.now().toString(36).toUpperCase()}-${createRandomHex(5).toUpperCase()}`

  return {
    id: verificationId,
    verificationId,
    packName,
    cardName: card.name,
    rarity: card.rarity,
    grade: card.grade,
    serverSeedHash,
    clientSeed,
    nonce,
    openedAt: getFullDateTime(),
    resultSummary: `${card.name} · ${card.rarity}`,
    status: 'Verified Demo',
  }
}

const createDemoMarketplaceListings = (): MarketplaceListing[] => [
  {
    id: 'demo-marketplace-charizard-151',
    seller: 'JomCollector',
    price: 1850,
    listedAt: 'Demo Listing',
    source: 'demo',
    card: {
      id: 'demo-card-charizard-151',
      name: 'Charizard ex',
      rarity: 'Special Illustration Rare',
      grade: 'Mint Style',
      image: 'https://images.pokemontcg.io/sv3pt5/199_hires.png',
      sourcePack: 'Pokémon 151 Charizard Chase',
      openedAt: 'Demo Pull',
      status: 'Stored',
    },
  },
  {
    id: 'demo-marketplace-pikachu-vmax',
    seller: 'SEA TCG Vault',
    price: 1450,
    listedAt: 'Demo Listing',
    source: 'demo',
    card: {
      id: 'demo-card-pikachu-vmax',
      name: 'Pikachu VMAX',
      rarity: 'Rare Rainbow',
      grade: 'Mint Style',
      image: 'https://images.pokemontcg.io/swsh4/188_hires.png',
      sourcePack: 'Pokémon VMAX Electric Chase',
      openedAt: 'Demo Pull',
      status: 'Stored',
    },
  },
  {
    id: 'demo-marketplace-arceus-gold',
    seller: 'KaiTan',
    price: 980,
    listedAt: 'Demo Listing',
    source: 'demo',
    card: {
      id: 'demo-card-arceus-gold',
      name: 'Arceus VSTAR',
      rarity: 'Rare Secret',
      grade: 'Gallery Style',
      image: 'https://images.pokemontcg.io/swsh12pt5gg/GG70_hires.png',
      sourcePack: 'Crown Zenith Vault Drop',
      openedAt: 'Demo Pull',
      status: 'Stored',
    },
  },
]

const safeJsonParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

const loadWalletBalance = () => {
  if (typeof window === 'undefined') return 1000

  const storedValue = window.localStorage.getItem(STORAGE_KEYS.walletBalance)
  const parsedValue = Number(storedValue)

  if (Number.isNaN(parsedValue)) return 1000

  return parsedValue
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

const loadDailyLoginState = () => {
  if (typeof window === 'undefined') return initialDailyLoginState

  const storedState = safeJsonParse<DailyLoginState>(
    window.localStorage.getItem(STORAGE_KEYS.dailyLogin),
    initialDailyLoginState,
  )

  return {
    ...initialDailyLoginState,
    ...storedState,
    streakDay: Math.min(Math.max(Number(storedState.streakDay ?? 1), 1), 7),
    lastClaimDate:
      typeof storedState.lastClaimDate === 'string'
        ? storedState.lastClaimDate
        : null,
    totalClaims: Number(storedState.totalClaims ?? 0),
  }
}


const loadRaffleTickets = () => {
  if (typeof window === 'undefined') return 0

  const storedValue = window.localStorage.getItem(STORAGE_KEYS.raffleTickets)
  const parsedValue = Number(storedValue)

  if (Number.isNaN(parsedValue)) return 0

  return Math.max(parsedValue, 0)
}

const loadRaffleEntries = () => {
  if (typeof window === 'undefined') return []

  return safeJsonParse<RaffleEntry[]>(
    window.localStorage.getItem(STORAGE_KEYS.raffleEntries),
    [],
  )
}


const loadRaffleWinners = () => {
  if (typeof window === 'undefined') return []

  return safeJsonParse<RaffleWinner[]>(
    window.localStorage.getItem(STORAGE_KEYS.raffleWinners),
    [],
  )
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

const isNearlySoldOut = (pack: Pack) => {
  return pack.remainingQuantity > 0 && pack.remainingQuantity <= 10
}

type PlayerAdminDemoShellProps = {
  initialAdminOpen?: boolean
}

function PlayerAdminDemoShell({
  initialAdminOpen = false,
}: PlayerAdminDemoShellProps) {
  const [packs, setPacks] = useState<ManagedPack[]>(() => loadPacks())
  const [activePack, setActivePack] = useState<Pack | null>(null)
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [walletBalance, setWalletBalance] = useState(() => loadWalletBalance())
  const [isTopUpOpen, setIsTopUpOpen] = useState(false)
  const [isVaultOpen, setIsVaultOpen] = useState(false)
  const [isTransactionOpen, setIsTransactionOpen] = useState(false)
  const [isPlayerWalletOpen, setIsPlayerWalletOpen] = useState(false)
  const [isAdminShippingOpen, setIsAdminShippingOpen] = useState(initialAdminOpen)
  const [selectedCategory, setSelectedCategory] =
    useState<PackCategory>('All')
  const [packSearchQuery, setPackSearchQuery] = useState('')
  const [packSortBy, setPackSortBy] = useState<PackSortOption>('Latest')
  const [vaultCards, setVaultCards] = useState<VaultCard[]>(() =>
    loadVaultCards(),
  )
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() =>
    loadTransactions(),
  )
  const [questStats, setQuestStats] = useState<QuestStats>(() =>
    loadQuestStats(),
  )
  const [dailyLoginState, setDailyLoginState] = useState<DailyLoginState>(() =>
    loadDailyLoginState(),
  )
  const [isDailyLoginOpen, setIsDailyLoginOpen] = useState(false)
  const [raffleTickets, setRaffleTickets] = useState(() =>
    loadRaffleTickets(),
  )
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
  const [multiOpenQuantity, setMultiOpenQuantity] = useState(10)
  const [sellBackTarget, setSellBackTarget] = useState<VaultCard | null>(null)
  const [shippingTarget, setShippingTarget] = useState<VaultCard | null>(null)
  const [listForSaleTarget, setListForSaleTarget] = useState<VaultCard | null>(null)

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
    window.localStorage.setItem(
      STORAGE_KEYS.walletBalance,
      String(walletBalance),
    )
  }, [walletBalance])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.vaultCards,
      JSON.stringify(vaultCards),
    )
  }, [vaultCards])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.transactions,
      JSON.stringify(transactions),
    )
  }, [transactions])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.questStats,
      JSON.stringify(questStats),
    )
  }, [questStats])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.dailyLogin,
      JSON.stringify(dailyLoginState),
    )
  }, [dailyLoginState])

  useEffect(() => {
    if (hasClaimedDailyRewardToday(dailyLoginState)) return

    const timer = window.setTimeout(() => {
      setIsDailyLoginOpen(true)
    }, 900)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.raffleTickets,
      String(raffleTickets),
    )
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

  const getLatestPack = (packName: string) => {
    return packs.find((pack) => pack.name === packName)
  }

  const closeModal = () => {
    setActiveModal(null)
    setActivePack(null)
  }

  const openTopUpModal = () => {
    setActiveModal(null)
    setActivePack(null)

    window.setTimeout(() => {
      setIsTopUpOpen(true)
    }, 120)
  }

  const addTransaction = (
    type: TransactionType,
    title: string,
    description: string,
    amount: number,
    balanceAfter: number,
  ) => {
    const newTransaction: TransactionRecord = {
      id: `${Date.now()}-${type}-${Math.random().toString(16).slice(2)}`,
      type,
      title,
      description,
      amount,
      balanceAfter,
      createdAt: getTransactionTime(),
      status: 'Completed',
    }

    setTransactions((currentTransactions) => [
      newTransaction,
      ...currentTransactions,
    ])
  }

  const incrementQuestStats = (updates: QuestStatIncrement) => {
    setQuestStats((currentStats) => ({
      ...currentStats,
      openPacks: currentStats.openPacks + (updates.openPacks ?? 0),
      open1: currentStats.open1 + (updates.open1 ?? 0),
      open10: currentStats.open10 + (updates.open10 ?? 0),
      open100: currentStats.open100 + (updates.open100 ?? 0),
      sellBack: currentStats.sellBack + (updates.sellBack ?? 0),
      shipping: currentStats.shipping + (updates.shipping ?? 0),
      topUp: currentStats.topUp + (updates.topUp ?? 0),
    }))
  }


  const awardRaffleTickets = (tickets: number) => {
    if (tickets <= 0) return

    setRaffleTickets((currentTickets) => currentTickets + tickets)
  }

  const handleEnterRaffle = (prize: RafflePrize, tickets: number) => {
    if (raffleTickets < tickets) return

    setRaffleTickets((currentTickets) => Math.max(currentTickets - tickets, 0))

    const newEntry: RaffleEntry = {
      id: `${Date.now()}-raffle-${Math.random().toString(16).slice(2)}`,
      prizeId: prize.id,
      prizeName: prize.name,
      tickets,
      createdAt: getFullDateTime(),
      status: 'Entered',
    }

    setRaffleEntries((currentEntries) => [newEntry, ...currentEntries])

    addTransaction(
      'raffle',
      `Raffle Entry · ${prize.name}`,
      `Entered ${tickets} raffle ticket${tickets > 1 ? 's' : ''} for ${prize.name}.`,
      0,
      walletBalance,
    )
  }

  const handleClaimQuest = (questId: string, reward: QuestReward) => {
    if (questStats.claimedQuestIds.includes(questId)) return

    const nextBalance = walletBalance + reward.points

    setQuestStats((currentStats) => {
      if (currentStats.claimedQuestIds.includes(questId)) return currentStats

      return {
        ...currentStats,
        xp: currentStats.xp + reward.xp,
        claimedQuestIds: [...currentStats.claimedQuestIds, questId],
      }
    })

    if (reward.points > 0) {
      setWalletBalance(nextBalance)
    }

    awardRaffleTickets(2)

    addTransaction(
      'top-up',
      reward.points > 0 ? 'Quest Reward' : 'Quest XP Reward',
      `Claimed quest reward: ${reward.points.toLocaleString()} points, ${reward.xp.toLocaleString()} XP, and 2 raffle tickets.`,
      reward.points,
      reward.points > 0 ? nextBalance : walletBalance,
    )
  }

  const handleClaimDailyLoginReward = () => {
    if (hasClaimedDailyRewardToday(dailyLoginState)) {
      setIsDailyLoginOpen(false)
      return
    }

    const reward = getDailyRewardForStreak(dailyLoginState.streakDay)
    const nextBalance = walletBalance + reward.points

    setWalletBalance(nextBalance)
    awardRaffleTickets(reward.raffleTickets)

    setQuestStats((currentStats) => ({
      ...currentStats,
      xp: currentStats.xp + reward.xp,
    }))

    setDailyLoginState((currentState) => ({
      streakDay: getNextDailyStreakDay(currentState.streakDay),
      lastClaimDate: getTodayDateKey(),
      totalClaims: currentState.totalClaims + 1,
    }))

    addTransaction(
      'top-up',
      `Daily Login Reward · Day ${reward.day}`,
      `Claimed ${reward.title}: ${reward.points.toLocaleString()} points, ${reward.xp.toLocaleString()} XP, and ${reward.raffleTickets.toLocaleString()} raffle ticket${reward.raffleTickets > 1 ? 's' : ''}.`,
      reward.points,
      nextBalance,
    )

    setIsDailyLoginOpen(false)
  }

  const backToPackDetail = () => {
    if (!activePack) {
      closeModal()
      return
    }

    const latestPack = getLatestPack(activePack.name) ?? activePack

    if (latestPack.remainingQuantity <= 0) {
      closeModal()
      return
    }

    setActivePack(latestPack)
    setActiveModal('detail')
  }

  const hasEnoughStock = (pack: Pack, quantity: number) => {
    return pack.remainingQuantity >= quantity
  }

  const deductPackStock = (packName: string, quantity: number) => {
    const latestPack = getLatestPack(packName)

    if (!latestPack) return null

    const nextRemainingQuantity = Math.max(
      latestPack.remainingQuantity - quantity,
      0,
    )

    const updatedPack: Pack = {
      ...latestPack,
      remainingQuantity: nextRemainingQuantity,
      remaining: formatPackRemaining(
        nextRemainingQuantity,
        latestPack.totalQuantity,
      ),
    }

    setPacks((currentPacks) =>
      currentPacks.map((pack) =>
        pack.name === packName ? updatedPack : pack,
      ),
    )

    return updatedPack
  }

  const openPackDetail = (pack: Pack) => {
    const latestPack = getLatestPack(pack.name) ?? pack

    if (latestPack.remainingQuantity <= 0) return

    setActivePack(latestPack)
    setActiveModal('detail')
  }

  const handleTopUp = (points: number) => {
    const nextBalance = walletBalance + points

    setWalletBalance(nextBalance)

    addTransaction(
      'top-up',
      'Wallet Top Up',
      `Added ${points.toLocaleString()} points to wallet.`,
      points,
      nextBalance,
    )

    incrementQuestStats({ topUp: 1 })
    awardRaffleTickets(5)
  }

  const handleAuctionBid = (
    cost: number,
    auctionName: string,
    nextBid: number,
  ) => {
    if (walletBalance < cost) {
      openTopUpModal()
      return false
    }

    const nextBalance = walletBalance - cost

    setWalletBalance(nextBalance)

    addTransaction(
      'auction',
      `Auction Bid · ${auctionName}`,
      `Placed a demo auction bid. Current bid is ${nextBid.toLocaleString()} points.`,
      cost,
      nextBalance,
    )

    return true
  }

  const handleOpenPackFromDetail = (pack: Pack) => {
    const latestPack = getLatestPack(pack.name)

    if (!latestPack) return

    if (!hasEnoughStock(latestPack, 1)) {
      setActivePack(latestPack)
      return
    }

    const packCost = getPackCost(latestPack)

    if (walletBalance < packCost) {
      openTopUpModal()
      return
    }

    const nextBalance = walletBalance - packCost

    setWalletBalance(nextBalance)

    addTransaction(
      'open-1',
      `Open 1 · ${latestPack.name}`,
      `Opened 1 pack from ${latestPack.name}. Reward will be automatically saved to My Vault.`,
      packCost,
      nextBalance,
    )

    const updatedPack = deductPackStock(latestPack.name, 1)

    setActivePack(updatedPack ?? latestPack)
    setActiveModal('opening')

    incrementQuestStats({ openPacks: 1, open1: 1 })
    awardRaffleTickets(1)
  }

  const handleOpenMultiPackFromDetail = (pack: Pack, quantity: number) => {
    const latestPack = getLatestPack(pack.name)

    if (!latestPack) return

    if (!hasEnoughStock(latestPack, quantity)) {
      setActivePack(latestPack)
      return
    }

    const packCost = getPackCost(latestPack)
    const totalCost = packCost * quantity

    if (walletBalance < totalCost) {
      openTopUpModal()
      return
    }

    const nextBalance = walletBalance - totalCost

    setWalletBalance(nextBalance)

    addTransaction(
      'open-10',
      `Open ${quantity} · ${latestPack.name}`,
      `Opened ${quantity} packs from ${latestPack.name}. All rewards will be automatically saved to My Vault.`,
      totalCost,
      nextBalance,
    )

    const updatedPack = deductPackStock(latestPack.name, quantity)

    setActivePack(updatedPack ?? latestPack)
    setMultiOpenQuantity(quantity)
    setActiveModal('multi-opening')

    incrementQuestStats({
      openPacks: quantity,
      open10: quantity === 10 ? 1 : 0,
      open100: quantity === 100 ? 1 : 0,
    })
    awardRaffleTickets(quantity === 100 ? 120 : quantity)
  }

  const createVerifiedVaultCards = (cards: VaultCard[], packName: string) => {
    const baseNonce = Date.now()
    const records = cards.map((card, index) =>
      createFairnessRecord(packName, card, baseNonce + index),
    )

    const verifiedCards = cards.map((card, index) => {
      const record = records[index]!

      return {
        ...card,
        fairnessId: record.verificationId,
        serverSeedHash: record.serverSeedHash,
        clientSeed: record.clientSeed,
        nonce: record.nonce,
      }
    })

    return {
      verifiedCards,
      records,
    }
  }

  const handleAddToVault = (card: VaultCard) => {
    const packName = activePack?.name ?? card.sourcePack
    const { verifiedCards, records } = createVerifiedVaultCards([card], packName)

    setVaultCards((currentCards) => [...verifiedCards, ...currentCards])
    setFairnessRecords((currentRecords) => [...records, ...currentRecords])
  }

  const handleAddAllToVault = (cards: VaultCard[]) => {
    const packName = activePack?.name ?? cards[0]?.sourcePack ?? 'Unknown Pack'
    const { verifiedCards, records } = createVerifiedVaultCards(cards, packName)

    setVaultCards((currentCards) => [...verifiedCards, ...currentCards])
    setFairnessRecords((currentRecords) => [...records, ...currentRecords])
  }

  const handleListForSaleCard = (card: VaultCard) => {
    setListForSaleTarget(card)
  }

  const confirmListForSale = (price: number) => {
    if (!listForSaleTarget) return

    const card = listForSaleTarget
    const listedAt = getFullDateTime()

    const listing: MarketplaceListing = {
      id: `${Date.now()}-listing-${Math.random().toString(16).slice(2)}`,
      card: {
        ...card,
        status: 'Listed on Marketplace',
        listingPrice: price,
        listedAt,
        listedSeller: 'You',
      },
      seller: 'You',
      price,
      listedAt,
      source: 'player',
    }

    setVaultCards((currentCards) =>
      currentCards.map((vaultCard) =>
        vaultCard.id === card.id
          ? {
              ...vaultCard,
              status: 'Listed on Marketplace',
              listingPrice: price,
              listedAt,
              listedSeller: 'You',
            }
          : vaultCard,
      ),
    )

    setMarketplaceListings((currentListings) => [listing, ...currentListings])

    addTransaction(
      'marketplace',
      `Listed · ${card.name}`,
      `Listed ${card.rarity} card on Marketplace for ${price.toLocaleString()} points.`,
      0,
      walletBalance,
    )

    setListForSaleTarget(null)
  }

  const handleCancelMarketplaceListing = (listing: MarketplaceListing) => {
    setMarketplaceListings((currentListings) =>
      currentListings.filter((item) => item.id !== listing.id),
    )

    if (listing.source === 'player') {
      setVaultCards((currentCards) =>
        currentCards.map((card) =>
          card.id === listing.card.id
            ? {
                ...card,
                status: 'Stored',
                listingPrice: undefined,
                listedAt: undefined,
                listedSeller: undefined,
              }
            : card,
        ),
      )
    }

    addTransaction(
      'marketplace',
      `Cancelled Listing · ${listing.card.name}`,
      `Cancelled marketplace listing for ${listing.card.name}.`,
      0,
      walletBalance,
    )
  }

  const handleCancelMarketplaceListingCard = (card: VaultCard) => {
    const listing = marketplaceListings.find(
      (item) => item.source === 'player' && item.card.id === card.id,
    )

    if (!listing) return

    handleCancelMarketplaceListing(listing)
  }

  const handleBuyMarketplaceListing = (listing: MarketplaceListing) => {
    if (listing.source === 'player') return

    if (walletBalance < listing.price) {
      openTopUpModal()
      return
    }

    const nextBalance = walletBalance - listing.price
    const purchasedAt = getFullDateTime()

    const purchasedCard: VaultCard = {
      ...listing.card,
      id: `${Date.now()}-marketplace-card-${Math.random().toString(16).slice(2)}`,
      openedAt: `Marketplace · ${purchasedAt}`,
      status: 'Stored',
      listingPrice: undefined,
      listedAt: undefined,
      listedSeller: undefined,
    }

    setWalletBalance(nextBalance)
    setVaultCards((currentCards) => [purchasedCard, ...currentCards])
    setMarketplaceListings((currentListings) =>
      currentListings.filter((item) => item.id !== listing.id),
    )

    addTransaction(
      'marketplace',
      `Marketplace Buy · ${listing.card.name}`,
      `Purchased ${listing.card.rarity} card from ${listing.seller} for ${listing.price.toLocaleString()} points.`,
      listing.price,
      nextBalance,
    )
  }

  const handleSellBackCard = (card: VaultCard) => {
    setSellBackTarget(card)
  }

  const confirmSellBackCard = () => {
    if (!sellBackTarget) return

    const card = sellBackTarget
    const sellBackPoints = getSellBackPoints(card)
    const nextBalance = walletBalance + sellBackPoints

    setVaultCards((currentCards) =>
      currentCards.filter((vaultCard) => vaultCard.id !== card.id),
    )

    setWalletBalance(nextBalance)

    addTransaction(
      'sell-back',
      `Sell Back · ${card.name}`,
      `Sold back ${card.rarity} card from ${card.sourcePack}.`,
      sellBackPoints,
      nextBalance,
    )

    incrementQuestStats({ sellBack: 1 })
    awardRaffleTickets(1)
    setSellBackTarget(null)
  }

  const handleRequestShippingCard = (card: VaultCard) => {
    setShippingTarget(card)
  }

  const confirmShippingRequest = (shippingInfo: ShippingInfo) => {
    if (!shippingTarget) return

    const card = shippingTarget

    setVaultCards((currentCards) =>
      currentCards.map((vaultCard) =>
        vaultCard.id === card.id
          ? {
              ...vaultCard,
              status: 'Shipping Requested',
              shippingInfo,
              shippingRequestedAt: getFullDateTime(),
            }
          : vaultCard,
      ),
    )

    addTransaction(
      'shipping',
      `Shipping Request · ${card.name}`,
      `Requested physical shipping for ${card.rarity} card from ${card.sourcePack}. Recipient: ${shippingInfo.fullName}, ${shippingInfo.city}.`,
      0,
      walletBalance,
    )

    incrementQuestStats({ shipping: 1 })
    awardRaffleTickets(3)
    setShippingTarget(null)
    setListForSaleTarget(null)
  }

  const handleAdminShippingStatusUpdate = (
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
          shippingInfo: card.shippingInfo
            ? {
                ...card.shippingInfo,
                trackingNumber:
                  trackingNumber ?? card.shippingInfo.trackingNumber,
              }
            : card.shippingInfo,
          shippingUpdatedAt: getFullDateTime(),
        }
      }),
    )

    addTransaction(
      'shipping',
      `Shipping ${nextStatus} · ${targetCard.name}`,
      `Admin updated shipping status to ${nextStatus}${
        trackingNumber ? ` with tracking ${trackingNumber}` : ''
      }.`,
      0,
      walletBalance,
    )
  }

  const resetDemoData = () => {
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach((storageKey) => {
        window.localStorage.removeItem(storageKey)
      })
    }

    setPacks(createManagedInitialPacks())
    setActivePack(null)
    setActiveModal(null)
    setWalletBalance(1000)
    setIsTopUpOpen(false)
    setIsVaultOpen(false)
    setIsTransactionOpen(false)
    setIsAdminShippingOpen(false)
    setSelectedCategory('All')
    setVaultCards([])
    setTransactions([])
    setQuestStats({
      ...initialQuestStats,
      claimedQuestIds: [],
    })
    setDailyLoginState(initialDailyLoginState)
    setIsDailyLoginOpen(false)
    setRaffleTickets(0)
    setRaffleEntries([])
    setRaffleWinners([])
    setMarketplaceListings(createDemoMarketplaceListings())
    setFairnessRecords([])
    setMultiOpenQuantity(10)
    setSellBackTarget(null)
    setShippingTarget(null)
    setListForSaleTarget(null)
  }

  const playerVisiblePacks = packs.filter(isPackAvailableToPlayer)

  const totalRemaining = playerVisiblePacks.reduce(
    (total, pack) => total + pack.remainingQuantity,
    0,
  )

  const totalSupply = playerVisiblePacks.reduce(
    (total, pack) => total + pack.totalQuantity,
    0,
  )


  const shippingRequestedCount = vaultCards.filter(
    (card) => card.status !== 'Stored' && card.status !== 'Listed on Marketplace',
  ).length


  const filteredPacks = useMemo(() => {
    const normalizedSearch = packSearchQuery.trim().toLowerCase()

    const basePacks = playerVisiblePacks.filter((pack) => {
      const matchesCategory =
        selectedCategory === 'All'
          ? true
          : selectedCategory === 'Nearly Sold Out'
            ? isNearlySoldOut(pack)
            : pack.category === selectedCategory

      const matchesSearch =
        normalizedSearch.length === 0 ||
        pack.name.toLowerCase().includes(normalizedSearch) ||
        pack.category.toLowerCase().includes(normalizedSearch) ||
        pack.badge.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })

    const sortedPacks = [...basePacks]

    if (packSortBy === 'Price: Low to High') {
      sortedPacks.sort((firstPack, secondPack) => getPackCost(firstPack) - getPackCost(secondPack))
    } else if (packSortBy === 'Price: High to Low') {
      sortedPacks.sort((firstPack, secondPack) => getPackCost(secondPack) - getPackCost(firstPack))
    } else if (packSortBy === 'A-Z') {
      sortedPacks.sort((firstPack, secondPack) => firstPack.name.localeCompare(secondPack.name))
    }

    return sortedPacks
  }, [playerVisiblePacks, selectedCategory, packSearchQuery, packSortBy])

  const recentHitCards = vaultCards.slice(0, 6)

  const biggestPullCards = [...vaultCards]
    .sort((firstCard, secondCard) => {
      return getSellBackPoints(secondCard) - getSellBackPoints(firstCard)
    })
    .slice(0, 5)


  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <SciFiBackground />

      <main className="relative z-10">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
          <button
            type="button"
            className="group flex items-center gap-3 text-left"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_35px_rgba(34,211,238,0.22)]">
              <Crown className="h-6 w-6 text-cyan-300" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300">
                Jomluffyz
              </p>
              <h1 className="text-lg font-black leading-tight sm:text-xl">
                Treasure Pack TCG
              </h1>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openTopUpModal}
              className="hidden items-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-black text-amber-200 transition hover:scale-105 hover:bg-amber-300/20 sm:flex"
            >
              <Wallet className="h-4 w-4" />
              {walletBalance.toLocaleString()} Points
            </button>

            <button
              type="button"
              onClick={() => setIsTransactionOpen(true)}
              className="hidden items-center gap-2 rounded-2xl border border-purple-300/20 bg-purple-300/10 px-4 py-3 text-sm font-black text-purple-200 transition hover:scale-105 hover:bg-purple-300/20 md:flex"
            >
              <ReceiptText className="h-4 w-4" />
              History
              <span className="rounded-full bg-purple-300 px-2 py-0.5 text-xs text-black">
                {transactions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsAdminShippingOpen(true)}
              className="hidden items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-black text-emerald-200 transition hover:scale-105 hover:bg-emerald-300/20 lg:flex"
            >
              <Settings className="h-4 w-4" />
              Admin Center
            </button>

            <button
              type="button"
              onClick={() => setIsVaultOpen(true)}
              className="flex items-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-200 transition hover:scale-105 hover:bg-cyan-300/20"
            >
              <ShieldCheck className="h-4 w-4" />
              Vault
              <span className="rounded-full bg-cyan-300 px-2 py-0.5 text-xs text-black">
                {vaultCards.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsPlayerWalletOpen(true)}
              className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-2 transition hover:scale-105 hover:border-purple-300/30 hover:bg-purple-300/10"
            >
              <span className="hidden pl-2 text-sm font-black text-white lg:inline">
                Player
              </span>
              <img
                src="https://api.dicebear.com/9.x/adventurer/svg?seed=detailedpower3615&radius=50&backgroundColor=8b5cf6"
                alt="Player account"
                className="h-9 w-9 rounded-xl border border-white/10 object-cover"
              />
            </button>
          </div>
        </header>

        <HeroPackSection
          packImage={heroPremiumShinyPack}
          packName="Premium Shiny Featured Pack"
          walletBalance={walletBalance}
          totalRemaining={totalRemaining}
          totalSupply={totalSupply}
          raffleTickets={raffleTickets}
          vaultCount={vaultCards.length}
          onStartOpening={() => {
            document.getElementById('packs')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }}
          onHowItWorks={() => {
            document.getElementById('how-it-works')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }}
          onTopUp={openTopUpModal}
          onOpenVault={() => setIsVaultOpen(true)}
        />

        <section id="packs" className="mx-auto w-full max-w-7xl scroll-mt-8 px-5 py-8 lg:px-8">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="hud-label text-sm">Pack Catalog</p>
              <h2 className="mt-2 text-4xl font-black">Browse Active Packs</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Discover curated drops in a clean storefront layout. Browse by category,
                search your favorite themes, and click View to open pack details.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 lg:max-w-xl lg:flex-row lg:justify-end">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={packSearchQuery}
                  onChange={(event) => setPackSearchQuery(event.target.value)}
                  placeholder="Search"
                  className="w-full rounded-2xl border border-white/8 bg-white/[0.04] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/[0.06]"
                />
              </div>

              <div className="relative min-w-[180px]">
                <select
                  value={packSortBy}
                  onChange={(event) => setPackSortBy(event.target.value as PackSortOption)}
                  className="w-full appearance-none rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3.5 pr-10 text-sm font-semibold text-white outline-none transition focus:border-cyan-300/35 focus:bg-white/[0.06]"
                >
                  <option value="Latest">Latest</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="A-Z">A-Z</option>
                </select>
                <ChevronRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            {categoryFilters.map((category) => {
              const isSelected = selectedCategory === category

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-wider transition hover:scale-[1.02] ${
                    isSelected
                      ? 'border-cyan-300 bg-cyan-300 text-black'
                      : 'border-white/8 bg-white/[0.04] text-slate-300 hover:border-cyan-300/25 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  {category}
                </button>
              )
            })}
          </div>

          {filteredPacks.length === 0 ? (
            <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] px-6 py-16 text-center">
              <p className="text-xl font-black text-white">No packs found</p>
              <p className="mt-2 text-sm text-slate-400">
                Try another search keyword or switch to a different category.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredPacks.map((pack, index) => {
                const isSoldOut = pack.remainingQuantity <= 0

                return (
                  <motion.article
                    key={pack.name}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => {
                      if (!isSoldOut) openPackDetail(pack)
                    }}
                    className={`group relative overflow-hidden rounded-[1.55rem] border border-white/6 bg-[#0a1322]/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:shadow-[0_18px_55px_rgba(8,145,178,0.18)] ${
                      isSoldOut ? 'cursor-not-allowed opacity-60 grayscale' : 'cursor-pointer'
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.07),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />

                    <div className="relative flex min-h-[400px] flex-col">
                      <div className="text-center">
                        <h3 className="line-clamp-2 min-h-[3.4rem] text-[1.05rem] font-black leading-tight text-white">
                          {pack.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">{pack.category}</p>
                      </div>

                      <div className="flex flex-1 items-center justify-center px-4 py-6">
                        <img
                          src={pack.cover}
                          alt={pack.name}
                          className="max-h-[215px] w-auto object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.45)] transition duration-300 group-hover:scale-[1.03]"
                        />
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-2 text-lg font-black text-white">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-300/15 text-amber-300">
                            <Gem className="h-4 w-4 fill-current" />
                          </div>
                          {getPackCost(pack).toFixed(2)}
                        </div>

                        <button
                          type="button"
                          disabled={isSoldOut}
                          onClick={(event) => {
                            event.stopPropagation()
                            if (!isSoldOut) openPackDetail(pack)
                          }}
                          className={`inline-flex items-center gap-1 text-base font-bold transition ${
                            isSoldOut ? 'text-slate-500' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {isSoldOut ? 'Sold Out' : 'View'}
                          {!isSoldOut && <ChevronRight className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          )}
        </section>

        <section id="how-it-works">
        <QuestLeaderboardPanel
          questStats={questStats}
          vaultCards={vaultCards}
          transactions={transactions}
          raffleTickets={raffleTickets}
          walletBalance={walletBalance}
          dailyLoginState={dailyLoginState}
          onClaimQuest={handleClaimQuest}
          onOpenDailyLogin={() => setIsDailyLoginOpen(true)}
        />
        </section>

        <LiveAuctionPanel
          walletBalance={walletBalance}
          onBid={handleAuctionBid}
          onNeedTopUp={openTopUpModal}
        />

        <RaffleCenterPanel
          ticketBalance={raffleTickets}
          entries={raffleEntries}
          winners={raffleWinners}
          onEnterRaffle={handleEnterRaffle}
        />


        {/* Real Card Catalog Preview is hidden for boss/demo presentation. */}

        <div className="hidden" aria-hidden="true">
          <CreatorDropsPanel
            packs={playerVisiblePacks.filter((pack) => pack.category === 'Creator Drops')}
            onOpenDrop={openPackDetail}
            onViewAll={() => setSelectedCategory('Creator Drops')}
          />
        </div>

        <div className="hidden" aria-hidden="true">
          <MarketplacePanel
            listings={marketplaceListings}
            walletBalance={walletBalance}
            onBuyListing={handleBuyMarketplaceListing}
            onCancelListing={handleCancelMarketplaceListing}
          />
        </div>

        <section className="hidden mx-auto w-full max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.div
            className="hud-panel hud-corners rounded-[2rem] p-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-300/30 bg-purple-300/10">
                <Gem className="h-6 w-6 text-purple-300" />
              </div>

              <div>
                <p className="hud-label text-sm">Vault Preview</p>
                <h3 className="mt-1 text-2xl font-black">My Vault</h3>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-400">
              Your revealed cards are automatically stored here after pack
              opening.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Cards
                </p>

                <p className="mt-2 text-2xl font-black">{vaultCards.length}</p>
              </div>

              <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Recent Hits
                </p>

                <p className="mt-2 text-2xl font-black text-amber-300">
                  {recentHitCards.length}
                </p>
              </div>

              <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Shipping
                </p>

                <p className="mt-2 text-2xl font-black text-purple-300">
                  {shippingRequestedCount}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsVaultOpen(true)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-4 font-black text-cyan-200 transition hover:scale-[1.02] hover:bg-cyan-300/20"
            >
              <PackageOpen className="h-5 w-5" />
              Enter Vault
            </button>
          </motion.div>

          <div className="grid gap-6">
            <motion.div
              className="hud-panel hud-corners rounded-[2rem] p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="hud-label text-sm">Recent Hits</p>
                  <h3 className="mt-1 text-2xl font-black">Latest Pulls</h3>
                </div>
                <Zap className="h-6 w-6 text-cyan-300" />
              </div>

              {recentHitCards.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Open packs to generate recent hits.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentHitCards.map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center gap-3 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3"
                    >
                      <img
                        src={card.image}
                        alt={card.name}
                        className="h-14 w-10 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-white">
                          {card.name}
                        </p>
                        <p className="truncate text-xs text-cyan-300">
                          {card.rarity} · {card.sourcePack}
                        </p>
                      </div>
                      <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-black text-amber-200">
                        +{getSellBackPoints(card)} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              className="hud-panel hud-corners rounded-[2rem] p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="hud-label text-sm">Biggest Pulls</p>
                  <h3 className="mt-1 text-2xl font-black">Top Vault Value</h3>
                </div>
                <Trophy className="h-6 w-6 text-purple-300" />
              </div>

              {biggestPullCards.length === 0 ? (
                <LivePullFeed />
              ) : (
                <div className="space-y-3">
                  {biggestPullCards.map((card, index) => (
                    <div
                      key={card.id}
                      className="flex items-center gap-3 rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-3"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-300/20 bg-purple-300/10 text-sm font-black text-purple-200">
                        #{index + 1}
                      </span>
                      <img
                        src={card.image}
                        alt={card.name}
                        className="h-14 w-10 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-white">
                          {card.name}
                        </p>
                        <p className="truncate text-xs text-purple-300">
                          {card.rarity} · {card.grade}
                        </p>
                      </div>
                      <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200">
                        {getSellBackPoints(card)} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>

        <div className="hidden" aria-hidden="true">
          <FairnessCenterPanel records={fairnessRecords} />
        </div>

      <PackDetailModal
        pack={activeModal === 'detail' ? activePack : null}
        onClose={closeModal}
        onOpenPack={handleOpenPackFromDetail}
        onOpenMultiPack={handleOpenMultiPackFromDetail}
        walletBalance={walletBalance}
        onNeedTopUp={openTopUpModal}
      />

      <PackOpeningModal
        pack={activeModal === 'opening' ? activePack : null}
        onClose={closeModal}
        onBackToDetail={backToPackDetail}
        onAddToVault={handleAddToVault}
      />

      <MultiOpenModal
        pack={activeModal === 'multi-opening' ? activePack : null}
        quantity={multiOpenQuantity}
        onClose={closeModal}
        onBackToDetail={backToPackDetail}
        onAddAllToVault={handleAddAllToVault}
      />

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onTopUp={handleTopUp}
      />

      <PlayerWalletPanel
        isOpen={isPlayerWalletOpen}
        onClose={() => setIsPlayerWalletOpen(false)}
        username="detailedpower3615"
        walletBalance={walletBalance}
        vaultCount={vaultCards.length}
        raffleTickets={raffleTickets}
        shipmentCount={
          vaultCards.filter((card) => card.status === 'Shipping Requested').length
        }
        transactionCount={transactions.length}
        onTopUp={openTopUpModal}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenHistory={() => setIsTransactionOpen(true)}
        onOpenDailyReward={() => setIsDailyLoginOpen(true)}
      />

      <VaultDrawer
        isOpen={isVaultOpen}
        cards={vaultCards}
        onClose={() => setIsVaultOpen(false)}
        onSellBackCard={handleSellBackCard}
        onRequestShippingCard={handleRequestShippingCard}
        onListForSaleCard={handleListForSaleCard}
        onCancelMarketplaceListing={handleCancelMarketplaceListingCard}
      />

      <TransactionDrawer
        isOpen={isTransactionOpen}
        transactions={transactions}
        onClose={() => setIsTransactionOpen(false)}
      />

      <SellBackConfirmModal
        card={sellBackTarget}
        onClose={() => setSellBackTarget(null)}
        onConfirm={confirmSellBackCard}
      />

      <ShippingConfirmModal
        card={shippingTarget}
        onClose={() => setShippingTarget(null)}
        onConfirm={confirmShippingRequest}
      />

      <ListForSaleModal
        card={listForSaleTarget}
        onClose={() => setListForSaleTarget(null)}
        onConfirm={confirmListForSale}
      />

      <DailyLoginRewardModal
        isOpen={isDailyLoginOpen}
        dailyLoginState={dailyLoginState}
        onClose={() => setIsDailyLoginOpen(false)}
        onClaim={handleClaimDailyLoginReward}
      />

      <AdminControlCenterDrawer
        isOpen={isAdminShippingOpen}
        packs={packs}
        vaultCards={vaultCards}
        transactions={transactions}
        marketplaceListings={marketplaceListings}
        raffleTickets={raffleTickets}
        raffleEntries={raffleEntries}
        fairnessRecords={fairnessRecords}
        questStats={questStats}
        walletBalance={walletBalance}
        onClose={() => setIsAdminShippingOpen(false)}
        onUpdateShippingStatus={handleAdminShippingStatusUpdate}
        onResetDemoData={resetDemoData}
      />
    </div>
  )
}

export default PlayerAdminDemoShell
