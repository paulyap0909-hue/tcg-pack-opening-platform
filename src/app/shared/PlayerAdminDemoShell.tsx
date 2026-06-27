import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  ChevronRight,
  Gavel,
  Gem,
  Gift,
  Home,
  PackageOpen,
  Trophy,
  UserCircle,
  Volume2,
  VolumeX,
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
import TransactionDrawer, {
  type TransactionRecord,
  type TransactionType,
} from '../../components/TransactionDrawer'
import SellBackConfirmModal from '../../components/SellBackConfirmModal'
import ShippingConfirmModal from '../../components/ShippingConfirmModal'
import ShippingCenterDrawer from '../../components/ShippingCenterDrawer'
import ProfileSettingsDrawer, { type PlayerProfile } from '../../components/ProfileSettingsDrawer'
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
import type { FairnessRecord } from '../../components/FairnessCenterPanel'
import type { MarketplaceListing } from '../../components/MarketplacePanel'
import ListForSaleModal from '../../components/ListForSaleModal'
import HeroPackSection from '../../components/HeroPackSection'
import DailyLoginRewardModal from '../../components/DailyLoginRewardModal'
import LiveAuctionPanel from '../../components/LiveAuctionPanel'
import MobileAuctionPanel from '../../components/MobileAuctionPanel'
import MobileLukaHomePage from '../../components/MobileLukaHomePage'
import PlayerWalletPanel from '../../components/PlayerWalletPanel'
import AudioGateModal from '../../components/AudioGateModal'
import useAudio from '../../hooks/useAudio'
import { audioManager } from '../../lib/audioManager'
import {
  getLanguageLabel,
  loadStoredLanguage,
  saveStoredLanguage,
  translations,
  type AppLanguage,
} from '../../lib/i18n'

import type { Pack } from '../../data/cardPool'
import { packCoverAssets, genericPackCoverAssets } from '../../data/cardPool'
import {
  getDailyRewardForStreak,
  getNextDailyStreakDay,
  getTodayDateKey,
  hasClaimedDailyRewardToday,
  initialDailyLoginState,
  type DailyLoginState,
} from '../../data/dailyLoginRewards'

import heroPremiumShinyPack from '../../assets/decks/hero-premium-shiny-pack.png'
import onePiecePack01 from '../../assets/decks/onepiece-pack-01.png'
import onePiecePack02 from '../../assets/decks/onepiece-pack-02.png'
import onePiecePack03 from '../../assets/decks/onepiece-pack-03.png'
import onePiecePack04 from '../../assets/decks/onepiece-pack-04.png'
import onePiecePack05 from '../../assets/decks/onepiece-pack-05.png'
import onePiecePack06 from '../../assets/decks/onepiece-pack-06.png'
import pikachuPackWorld from '../../assets/ui/pikachu-pack-world.png'
import luffyPackWorld from '../../assets/ui/luffy-pack-world.png'

type ActiveModal = 'detail' | 'opening' | 'multi-opening' | null

type MobilePage = 'home' | 'packs' | 'auction' | 'rewards' | 'account'
type PackUniverse = 'pokemon' | 'onePiece'

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
  | 'Nearly Sold Out'


type QuestStatIncrement = Partial<
  Pick<
    QuestStats,
    'openPacks' | 'open1' | 'open10' | 'open100' | 'sellBack' | 'shipping' | 'topUp'
  >
>

const STORAGE_KEYS = {
  packs: 'tcg-platform-packs-v5',
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
  playerProfile: 'tcg-player-profile-v1',
}

const DEFAULT_PLAYER_PROFILE: PlayerProfile = {
  displayName: 'detailedpower3615',
  username: 'detailedpower3615',
}

const packUniverseOptions: Array<{
  id: PackUniverse
  label: string
  eyebrow: string
  description: string
  activeClass: string
  inactiveClass: string
  iconClass: string
  image: string
  imageAlt: string
}> = [
  {
    id: 'pokemon',
    label: 'Pokémon',
    eyebrow: 'Electric chase world',
    description: 'Charizard, Pikachu, Crown Zenith and premium Pokémon-style drops.',
    activeClass: 'border-yellow-300/70 bg-yellow-300/16 text-yellow-100 shadow-[0_0_38px_rgba(250,204,21,0.18)]',
    inactiveClass: 'border-white/10 bg-white/[0.045] text-slate-300',
    iconClass: 'from-yellow-300 to-cyan-300',
    image: pikachuPackWorld,
    imageAlt: 'Pikachu pack world',
  },
  {
    id: 'onePiece',
    label: 'One Piece',
    eyebrow: 'Pirate treasure world',
    description: 'Luffy-inspired treasure drops, anime chase packs and ocean adventure pulls.',
    activeClass: 'border-red-300/70 bg-red-300/14 text-red-100 shadow-[0_0_38px_rgba(248,113,113,0.18)]',
    inactiveClass: 'border-white/10 bg-white/[0.045] text-slate-300',
    iconClass: 'from-red-300 to-amber-300',
    image: luffyPackWorld,
    imageAlt: 'Luffy pack world',
  },
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
    cover: packCoverAssets.greatPack,
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
    cover: packCoverAssets.ultraPack,
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
    cover: packCoverAssets.crownZenithVaultDrop,
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
    cover: packCoverAssets.classicBaseHoloDrop,
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
    cover: genericPackCoverAssets.mysteryDeckCover,
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
    cover: genericPackCoverAssets.electricDeckCover,
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
    cover: genericPackCoverAssets.secretDeckCover,
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
    cover: packCoverAssets.venusaurHoloVaultedDrop,
  },
  {
    name: 'One Piece Luffy Treasure Chase',
    category: 'One Piece Inspired',
    price: '160 Points',
    remaining: '168 / 300 left',
    remainingQuantity: 168,
    totalQuantity: 300,
    glow: 'from-red-300 to-amber-600',
    badge: 'Luffy Chase',
    cover: onePiecePack01,
  },
  {
    name: 'One Piece Grand Line Vault',
    category: 'One Piece Inspired',
    price: '220 Points',
    remaining: '88 / 180 left',
    remainingQuantity: 88,
    totalQuantity: 180,
    glow: 'from-orange-300 to-red-700',
    badge: 'Treasure Drop',
    cover: onePiecePack02,
  },
  {
    name: 'One Piece Zoro Sword Drop',
    category: 'One Piece Inspired',
    price: '180 Points',
    remaining: '126 / 240 left',
    remainingQuantity: 126,
    totalQuantity: 240,
    glow: 'from-emerald-300 to-cyan-700',
    badge: 'Sword Drop',
    cover: onePiecePack03,
  },
  {
    name: 'One Piece Nami Gold Map',
    category: 'One Piece Inspired',
    price: '140 Points',
    remaining: '210 / 320 left',
    remainingQuantity: 210,
    totalQuantity: 320,
    glow: 'from-yellow-300 to-orange-700',
    badge: 'Gold Map',
    cover: onePiecePack04,
  },
  {
    name: 'One Piece Sanji Flame Kick',
    category: 'One Piece Inspired',
    price: '190 Points',
    remaining: '98 / 220 left',
    remainingQuantity: 98,
    totalQuantity: 220,
    glow: 'from-orange-300 to-rose-700',
    badge: 'Flame Kick',
    cover: onePiecePack05,
  },
  {
    name: 'One Piece Pirate Emperor Pack',
    category: 'One Piece Inspired',
    price: '260 Points',
    remaining: '54 / 160 left',
    remainingQuantity: 54,
    totalQuantity: 160,
    glow: 'from-purple-300 to-red-800',
    badge: 'Emperor Pack',
    cover: onePiecePack06,
  },
]



const packCoverMap: Record<Exclude<PackCoverKey, 'custom'>, string> = {
  electric: genericPackCoverAssets.electricDeckCover,
  pirate: genericPackCoverAssets.pirateDeckCover,
  secret: genericPackCoverAssets.secretDeckCover,
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

const getPackUniverse = (pack: Pack): PackUniverse => {
  const normalizedPackText = `${pack.name} ${pack.category} ${pack.badge}`.toLowerCase()

  if (
    normalizedPackText.includes('one piece') ||
    normalizedPackText.includes('luffy') ||
    normalizedPackText.includes('pirate') ||
    normalizedPackText.includes('grand line')
  ) {
    return 'onePiece'
  }

  return 'pokemon'
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

const loadPlayerProfile = () => {
  if (typeof window === 'undefined') return DEFAULT_PLAYER_PROFILE

  const storedProfile = safeJsonParse<PlayerProfile>(
    window.localStorage.getItem(STORAGE_KEYS.playerProfile),
    DEFAULT_PLAYER_PROFILE,
  )

  const displayName = storedProfile.displayName?.trim() || DEFAULT_PLAYER_PROFILE.displayName
  const username = storedProfile.username?.trim() || DEFAULT_PLAYER_PROFILE.username

  return {
    displayName,
    username,
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
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(() => loadPlayerProfile())
  const [language, setLanguage] = useState<AppLanguage>(() => loadStoredLanguage())
  const [isTopUpOpen, setIsTopUpOpen] = useState(false)
  const [isVaultOpen, setIsVaultOpen] = useState(false)
  const [isTransactionOpen, setIsTransactionOpen] = useState(false)
  const [isPlayerWalletOpen, setIsPlayerWalletOpen] = useState(false)
  const [isShippingCenterOpen, setIsShippingCenterOpen] = useState(false)
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false)
  const [isAdminShippingOpen, setIsAdminShippingOpen] = useState(initialAdminOpen)
  const [selectedCategory, setSelectedCategory] =
    useState<PackCategory>('All')
  const [mobilePage, setMobilePage] = useState<MobilePage>('home')
  const [selectedPackUniverse, setSelectedPackUniverse] = useState<PackUniverse>('pokemon')
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
  const {
    isAudioGateOpen,
    isSoundEnabled,
    enterWithSound,
    continueMuted,
    toggleSound,
    playSfx,
  } = useAudio()
  const t = translations[language]

  useEffect(() => {
    saveStoredLanguage(language)
  }, [language])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.playerProfile,
      JSON.stringify(playerProfile),
    )
  }, [playerProfile])

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
    if (raffleTickets < tickets) {
      playSfx('error')
      return
    }

    playSfx('success')
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

    playSfx('success')
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

    playSfx('success')
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

    if (latestPack.remainingQuantity <= 0) {
      playSfx('error')
      return
    }

    setActivePack(latestPack)
    setActiveModal('detail')
  }

  const handleSavePlayerProfile = (profile: PlayerProfile) => {
    const displayName = profile.displayName.trim()
    const username = profile.username.trim().replace(/^@+/, '').toLowerCase()

    if (displayName.length < 2 || displayName.length > 20) {
      playSfx('error')
      return {
        ok: false,
        message: 'Display name must be 2–20 characters.',
      }
    }

    if (!/^[a-z0-9_-]{3,20}$/.test(username)) {
      playSfx('error')
      return {
        ok: false,
        message: 'Username must be 3–20 characters and use letters, numbers, dash or underscore only.',
      }
    }

    setPlayerProfile({
      displayName,
      username,
    })
    playSfx('success')

    return { ok: true }
  }

  const handleTopUp = (points: number) => {
    playSfx('success')
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
      playSfx('error')
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
      playSfx('error')
      setActivePack(latestPack)
      return
    }

    const packCost = getPackCost(latestPack)

    if (walletBalance < packCost) {
      playSfx('error')
      openTopUpModal()
      return
    }

    playSfx('packOpen')
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
      playSfx('error')
      setActivePack(latestPack)
      return
    }

    const packCost = getPackCost(latestPack)
    const totalCost = packCost * quantity

    if (walletBalance < totalCost) {
      playSfx('error')
      openTopUpModal()
      return
    }

    playSfx('packOpen')
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

  const handleSellBackCard = (card: VaultCard) => {
    setSellBackTarget(card)
  }

  const confirmSellBackCard = () => {
    if (!sellBackTarget) return

    playSfx('success')
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

    playSfx('success')
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
    setPlayerProfile(DEFAULT_PLAYER_PROFILE)
    setIsTopUpOpen(false)
    setIsVaultOpen(false)
    setIsTransactionOpen(false)
    setIsShippingCenterOpen(false)
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

  const playerVisiblePacks = packs.filter(
    (pack) => isPackAvailableToPlayer(pack) && pack.category !== 'Creator Drops',
  )

  const totalRemaining = playerVisiblePacks.reduce(
    (total, pack) => total + pack.remainingQuantity,
    0,
  )

  const totalSupply = playerVisiblePacks.reduce(
    (total, pack) => total + pack.totalQuantity,
    0,
  )

  const packUniverseCounts = useMemo(() => {
    return playerVisiblePacks.reduce(
      (counts, pack) => {
        const packUniverse = getPackUniverse(pack)
        return {
          ...counts,
          [packUniverse]: counts[packUniverse] + 1,
        }
      },
      { pokemon: 0, onePiece: 0 } as Record<PackUniverse, number>,
    )
  }, [playerVisiblePacks])

  const activePackUniverseMeta =
    packUniverseOptions.find((option) => option.id === selectedPackUniverse) ??
    packUniverseOptions[0]

  const filteredPacks = useMemo(() => {
    return playerVisiblePacks.filter((pack) => {
      const matchesUniverse = getPackUniverse(pack) === selectedPackUniverse
      const matchesCategory =
        selectedCategory === 'All'
          ? true
          : selectedCategory === 'Nearly Sold Out'
            ? isNearlySoldOut(pack)
            : pack.category === selectedCategory

      return matchesUniverse && matchesCategory
    })
  }, [playerVisiblePacks, selectedCategory, selectedPackUniverse])

  const changeMobilePage = (page: MobilePage) => {
    setMobilePage(page)

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (!isSoundEnabled) return

    if (mobilePage === 'packs') {
      void audioManager.playBgm(selectedPackUniverse === 'pokemon' ? 'pokemon' : 'onePiece')
      return
    }

    void audioManager.playBgm('lobby')
  }, [isSoundEnabled, mobilePage, selectedPackUniverse])



  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <SciFiBackground />

      <main className="relative z-10 pb-24 lg:pb-0">
        <header className="mx-auto hidden w-full max-w-7xl px-4 py-3 sm:px-5 lg:block lg:px-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="group flex items-center gap-3 text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_35px_rgba(34,211,238,0.22)]">
                <Trophy className="h-6 w-6 text-cyan-300" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300">
                  Jomluffyz
                </p>
                <h1 className="text-xl font-black leading-tight">
                  Treasure Pack TCG
                </h1>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsPlayerWalletOpen(true)}
              className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-2 transition hover:scale-105 hover:border-purple-300/30 hover:bg-purple-300/10"
            >
              <span className="pl-2 text-sm font-black text-white">
                Profile
              </span>
              <img
                src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(playerProfile.username || playerProfile.displayName)}&radius=50&backgroundColor=8b5cf6`}
                alt={playerProfile.displayName}
                className="h-9 w-9 rounded-xl border border-white/10 object-cover"
              />
            </button>
          </div>
        </header>
        <div className="lg:hidden">
          {mobilePage === 'home' && (
            <MobileLukaHomePage
              language={language}
              packs={playerVisiblePacks}
              walletBalance={walletBalance}
              raffleTickets={raffleTickets}
              vaultCount={vaultCards.length}
              onOpenPack={openPackDetail}
              onOpenPacks={() => changeMobilePage('packs')}
              onRaffles={() => changeMobilePage('rewards')}
              onInvite={() => changeMobilePage('account')}
              onSignIn={() => changeMobilePage('account')}
            />
          )}

          {mobilePage === 'packs' && (
            <>
        <section id="packs" className="mx-auto w-full max-w-7xl scroll-mt-8 px-4 py-7 sm:px-5 lg:px-8">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="hud-label text-sm">{t.packCatalog}</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">{t.browseActivePacks}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {t.packCatalogHint}
              </p>
            </div>


          </div>

          <div className="mb-5 overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.035] p-3 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200/75">
                  {t.chooseYourPackWorld}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-300">
                  {activePackUniverseMeta.description}
                </p>
              </div>

              <div className="hidden rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 sm:block">
                BGM Switch
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {packUniverseOptions.map((option) => {
                const isSelected = selectedPackUniverse === option.id
                const packCount = packUniverseCounts[option.id]

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setSelectedPackUniverse(option.id)
                      setSelectedCategory('All')
                      void audioManager.playBgm(option.id === 'pokemon' ? 'pokemon' : 'onePiece')
                    }}
                    className={`group relative min-h-[200px] overflow-hidden rounded-[1.35rem] border p-0 text-left transition active:scale-[0.98] ${
                      isSelected ? option.activeClass : option.inactiveClass
                    }`}
                  >
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${option.iconClass} opacity-[0.14]`} />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.22),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.55))]" />

                    <img
                      src={option.image}
                      alt={option.imageAlt}
                      className={`pointer-events-none absolute object-contain drop-shadow-[0_0_28px_rgba(255,255,255,0.2)] transition duration-300 ${
                        option.id === 'pokemon'
                          ? 'bottom-[-8px] right-[-10px] h-[142px] w-[110px]'
                          : 'bottom-2 right-[-12px] h-[120px] w-[140px]'
                      } ${
                        isSelected ? 'scale-110 opacity-100' : 'scale-100 opacity-70 grayscale-[0.25]'
                      }`}
                      draggable={false}
                    />

                    <div className="relative z-10 flex h-full min-h-[200px] flex-col justify-between p-4">
                      <div>
                        <div className="flex h-[4.65rem] flex-col justify-start gap-1 text-[10px] font-black uppercase leading-none tracking-[0.22em] text-current/65">
                          {option.eyebrow.split(' ').map((word) => (
                            <span key={`${option.id}-${word}`}>{word}</span>
                          ))}
                        </div>

                        <h3 className="mt-1 min-h-[2.15rem] text-2xl font-black leading-none tracking-tight text-white">
                          {option.label}
                        </h3>
                      </div>

                      <div className="pr-[5.6rem]">
                        <p className="text-xs font-black leading-4 text-current/72">
                          {packCount} {t.activePacks}
                        </p>
                        <div className={`mt-2 h-1.5 rounded-full bg-gradient-to-r ${option.iconClass} ${
                          isSelected ? 'opacity-100' : 'opacity-35'
                        }`} />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {filteredPacks.length === 0 ? (
            <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] px-6 py-16 text-center">
              <p className="text-xl font-black text-white">{t.noPacksFound}</p>
              <p className="mt-2 text-sm text-slate-400">
                {t.tryAnotherPack}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
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
                    className={`group relative overflow-hidden rounded-[1.25rem] border border-white/6 bg-[#0a1322]/95 p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:shadow-[0_18px_55px_rgba(8,145,178,0.18)] sm:rounded-[1.55rem] sm:p-4 ${
                      isSoldOut ? 'cursor-not-allowed opacity-60 grayscale' : 'cursor-pointer'
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.07),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />

                    <div className="relative flex min-h-[245px] flex-col sm:min-h-[400px]">
                      <div className="text-center">
                        <h3 className="line-clamp-2 min-h-[2.3rem] text-xs font-black leading-tight text-white sm:min-h-[3.4rem] sm:text-[1.05rem]">
                          {pack.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">{pack.category}</p>
                      </div>

                      <div className="flex flex-1 items-center justify-center px-2 py-4 sm:px-4 sm:py-6">
                        <img
                          src={pack.cover}
                          alt={pack.name}
                          loading="lazy"
                          className="max-h-[128px] w-auto object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.45)] transition duration-300 group-hover:scale-[1.03] sm:max-h-[215px]"
                        />
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-1.5 text-sm font-black text-white sm:gap-2 sm:text-lg">
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
                          className={`inline-flex items-center gap-1 text-sm font-bold transition sm:text-base ${
                            isSoldOut ? 'text-slate-500' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {isSoldOut ? 'Sold Out' : t.pull}
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


            </>
          )}

          {mobilePage === 'auction' && (
            <MobileAuctionPanel
              language={language}
              walletBalance={walletBalance}
              onBid={handleAuctionBid}
              onNeedTopUp={openTopUpModal}
            />
          )}

          {mobilePage === 'rewards' && (
            <section id="how-it-works" className="mx-auto w-full max-w-7xl px-4 py-5">
              <div className="mb-3 rounded-[1.35rem] border border-purple-300/18 bg-purple-300/[0.06] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.26em] text-purple-300">
                      {t.navRewards}
                    </p>
                    <h2 className="mt-1 text-xl font-black text-white">
                      {t.raffleDailyBonus}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDailyLoginOpen(true)
                    }}
                    className="shrink-0 rounded-2xl bg-gradient-to-r from-orange-300 to-yellow-300 px-3 py-2 text-xs font-black text-black"
                  >
                    {t.dailyLogin}
                  </button>
                </div>
              </div>

              <RaffleCenterPanel
                language={language}
                ticketBalance={raffleTickets}
                entries={raffleEntries}
                winners={raffleWinners}
                onEnterRaffle={handleEnterRaffle}
              />
            </section>
          )}


          {mobilePage === 'account' && (
            <section id="account" className="mx-auto w-full max-w-md px-4 pb-28 pt-4">
              <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#07111f]/[0.88] shadow-[0_24px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl">
                <div className="relative border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_20%_0%,rgba(168,85,247,0.18),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(3,7,18,0.98))] px-4 pb-4 pt-5">
                  <div className="absolute right-4 top-4 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">
                    {t.level} 01
                  </div>

                  <div className="flex items-center gap-3 pr-20">
                    <img
                      src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(playerProfile.username || playerProfile.displayName)}&radius=50&backgroundColor=8b5cf6`}
                      alt={playerProfile.displayName}
                      className="h-[54px] w-[54px] shrink-0 rounded-2xl border border-purple-300/25 bg-purple-300/10 shadow-[0_0_28px_rgba(168,85,247,0.24)]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-black text-white">{playerProfile.displayName}</p>
                      <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">@{playerProfile.username} · {t.demoAccount}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-black text-cyan-200">
                        <Gem className="h-3.5 w-3.5" />
                        {walletBalance.toLocaleString()} {t.points}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-4">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <button type="button" onClick={() => changeMobilePage('auction')} className="rounded-2xl border border-yellow-300/15 bg-yellow-300/[0.06] px-2 py-3 text-slate-200">
                      <Gavel className="mx-auto h-5 w-5 text-yellow-300" />
                      <p className="mt-1.5 text-[10px] font-black leading-tight">{t.bidOffer}</p>
                    </button>
                    <button type="button" onClick={() => setIsVaultOpen(true)} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] px-2 py-3 text-slate-200">
                      <PackageOpen className="mx-auto h-5 w-5 text-cyan-200" />
                      <p className="mt-1.5 text-[10px] font-black leading-tight">{t.myVault}</p>
                    </button>
                    <button type="button" className="rounded-2xl border border-purple-300/15 bg-purple-300/[0.06] px-2 py-3 text-slate-200">
                      <Trophy className="mx-auto h-5 w-5 text-purple-200" />
                      <p className="mt-1.5 text-[10px] font-black leading-tight">{t.favorite}</p>
                    </button>
                    <button type="button" className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] px-2 py-3 text-slate-200">
                      <UserCircle className="mx-auto h-5 w-5 text-emerald-200" />
                      <p className="mt-1.5 text-[10px] font-black leading-tight">{t.following}</p>
                    </button>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-yellow-300/25 bg-[linear-gradient(135deg,rgba(250,204,21,0.96),rgba(245,158,11,0.94))] p-4 text-black shadow-[0_18px_42px_rgba(250,204,21,0.16)]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-black">{t.startTradingToday}</p>
                        <p className="mt-1 max-w-[220px] text-[11px] font-bold leading-4 text-black/70">
                          {t.startTradingSubtitle}
                        </p>
                        <button type="button" onClick={() => changeMobilePage('auction')} className="mt-3 rounded-xl bg-black px-4 py-2 text-xs font-black text-yellow-200">
                          {t.goAuction}
                        </button>
                      </div>
                      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl border border-black/10 bg-black/10">
                        <Gavel className="h-9 w-9" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-base font-black text-white">{t.myActivity}</p>
                      <button type="button" onClick={() => setIsTransactionOpen(true)} className="flex items-center gap-1 text-xs font-black text-slate-400">
                        {t.viewAll} <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-4 gap-3 text-center">
                      <button type="button" onClick={openTopUpModal} className="rounded-2xl border border-white/10 bg-[#0b1220] px-2 py-3">
                        <Gem className="mx-auto h-5 w-5 text-cyan-200" />
                        <p className="mt-1.5 text-[10px] font-bold text-slate-300">{t.topUp}</p>
                      </button>
                      <button type="button" onClick={() => setIsTransactionOpen(true)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-2 py-3">
                        <Gift className="mx-auto h-5 w-5 text-purple-200" />
                        <p className="mt-1.5 text-[10px] font-bold text-slate-300">{t.paid}</p>
                      </button>
                      <button type="button" onClick={() => setIsShippingCenterOpen(true)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-2 py-3">
                        <PackageOpen className="mx-auto h-5 w-5 text-yellow-200" />
                        <p className="mt-1.5 text-[10px] font-bold text-slate-300">{t.toShip}</p>
                      </button>
                      <button type="button" onClick={() => setIsVaultOpen(true)} className="rounded-2xl border border-white/10 bg-[#0b1220] px-2 py-3">
                        <Trophy className="mx-auto h-5 w-5 text-emerald-200" />
                        <p className="mt-1.5 text-[10px] font-bold text-slate-300">{t.completed}</p>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045]">
                    <button type="button" onClick={openTopUpModal} className="flex w-full items-center justify-between gap-3 border-b border-white/10 px-4 py-3.5 text-left">
                      <span className="flex items-center gap-3 text-sm font-black text-white"><Gem className="h-5 w-5 text-cyan-200" />{t.jomluffyzBalance}</span>
                      <span className="flex items-center gap-1 text-xs font-black text-cyan-200">{walletBalance.toLocaleString()} <ChevronRight className="h-4 w-4 text-slate-500" /></span>
                    </button>
                    <button type="button" onClick={() => setIsDailyLoginOpen(true)} className="flex w-full items-center justify-between gap-3 border-b border-white/10 px-4 py-3.5 text-left">
                      <span className="flex items-center gap-3 text-sm font-black text-white"><Gift className="h-5 w-5 text-purple-200" />{t.dailyBonusCoin}</span>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </button>
                    <button type="button" onClick={() => setIsShippingCenterOpen(true)} className="flex w-full items-center justify-between gap-3 border-b border-white/10 px-4 py-3.5 text-left">
                      <span className="flex items-center gap-3 text-sm font-black text-white"><PackageOpen className="h-5 w-5 text-yellow-200" />{t.shippingRequests}</span>
                      <span className="flex items-center gap-1 text-xs font-black text-slate-400">{vaultCards.filter((card) => card.status === 'Shipping Requested').length} <ChevronRight className="h-4 w-4 text-slate-500" /></span>
                    </button>
                    <button type="button" onClick={toggleSound} className="flex w-full items-center justify-between gap-3 border-b border-white/10 px-4 py-3.5 text-left">
                      <span className="flex items-center gap-3 text-sm font-black text-white">
                        {isSoundEnabled ? <Volume2 className="h-5 w-5 text-cyan-200" /> : <VolumeX className="h-5 w-5 text-slate-400" />}
                        {t.soundMusic}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black ${isSoundEnabled ? 'bg-cyan-300/15 text-cyan-200' : 'bg-white/[0.06] text-slate-400'}`}>
                        {isSoundEnabled ? t.soundOn : t.soundOff}
                      </span>
                    </button>
                    <button type="button" onClick={() => setIsProfileSettingsOpen(true)} className="flex w-full items-center justify-between gap-3 border-b border-white/10 px-4 py-3.5 text-left">
                      <span className="flex items-center gap-3 text-sm font-black text-white"><UserCircle className="h-5 w-5 text-emerald-200" />{t.accountSettings}</span>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </button>
                    <button type="button" className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
                      <span className="flex items-center gap-3 text-sm font-black text-white"><Bell className="h-5 w-5 text-slate-300" />{t.supportLanguage}</span>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>

                  <div className="mt-4 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.055] px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">{t.demoAccount}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-300">{t.demoAccountCompact}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>

        <div className="hidden lg:block">


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

        <section id="packs" className="mx-auto w-full max-w-7xl scroll-mt-8 px-4 py-7 sm:px-5 lg:px-8">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="hud-label text-sm">{t.packCatalog}</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">{t.browseActivePacks}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {t.packCatalogHint}
              </p>
            </div>


          </div>

          <div className="mb-5 overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.035] p-3 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200/75">
                  {t.chooseYourPackWorld}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-300">
                  {activePackUniverseMeta.description}
                </p>
              </div>

              <div className="hidden rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 sm:block">
                BGM Switch
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {packUniverseOptions.map((option) => {
                const isSelected = selectedPackUniverse === option.id
                const packCount = packUniverseCounts[option.id]

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setSelectedPackUniverse(option.id)
                      setSelectedCategory('All')
                      void audioManager.playBgm(option.id === 'pokemon' ? 'pokemon' : 'onePiece')
                    }}
                    className={`relative overflow-hidden rounded-[1.35rem] border p-3 text-left transition active:scale-[0.98] ${
                      isSelected ? option.activeClass : option.inactiveClass
                    }`}
                  >
                    <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${option.iconClass} opacity-20 blur-xl`} />
                    <div className="relative flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-current/60">
                          {option.eyebrow}
                        </p>
                        <h3 className="mt-1 text-lg font-black tracking-tight text-white">
                          {option.label}
                        </h3>
                        <p className="mt-1 text-[11px] font-bold text-current/65">
                          {packCount} {t.activePacks}
                        </p>
                      </div>

                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${option.iconClass} text-black shadow-[0_0_24px_rgba(255,255,255,0.12)]`}>
                        <PackageOpen className="h-5 w-5" />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {filteredPacks.length === 0 ? (
            <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] px-6 py-16 text-center">
              <p className="text-xl font-black text-white">{t.noPacksFound}</p>
              <p className="mt-2 text-sm text-slate-400">
                {t.tryAnotherPack}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
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
                    className={`group relative overflow-hidden rounded-[1.25rem] border border-white/6 bg-[#0a1322]/95 p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:shadow-[0_18px_55px_rgba(8,145,178,0.18)] sm:rounded-[1.55rem] sm:p-4 ${
                      isSoldOut ? 'cursor-not-allowed opacity-60 grayscale' : 'cursor-pointer'
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.07),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />

                    <div className="relative flex min-h-[245px] flex-col sm:min-h-[400px]">
                      <div className="text-center">
                        <h3 className="line-clamp-2 min-h-[2.3rem] text-xs font-black leading-tight text-white sm:min-h-[3.4rem] sm:text-[1.05rem]">
                          {pack.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">{pack.category}</p>
                      </div>

                      <div className="flex flex-1 items-center justify-center px-2 py-4 sm:px-4 sm:py-6">
                        <img
                          src={pack.cover}
                          alt={pack.name}
                          loading="lazy"
                          className="max-h-[128px] w-auto object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.45)] transition duration-300 group-hover:scale-[1.03] sm:max-h-[215px]"
                        />
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-1.5 text-sm font-black text-white sm:gap-2 sm:text-lg">
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
                          className={`inline-flex items-center gap-1 text-sm font-bold transition sm:text-base ${
                            isSoldOut ? 'text-slate-500' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {isSoldOut ? 'Sold Out' : t.pull}
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
          language={language}
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



        <div id="auction" className="hidden lg:block">
          <LiveAuctionPanel
            walletBalance={walletBalance}
            onBid={handleAuctionBid}
            onNeedTopUp={openTopUpModal}
          />
        </div>

        <RaffleCenterPanel
          language={language}
          ticketBalance={raffleTickets}
          entries={raffleEntries}
          winners={raffleWinners}
          onEnterRaffle={handleEnterRaffle}
        />


        {/* Real Card Catalog Preview is hidden for boss/demo presentation. */}

        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-[99990] border-t border-white/10 bg-[#05070d]/94 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          <button type="button" onClick={() => changeMobilePage('home')} className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black ${mobilePage === 'home' ? 'text-cyan-200' : 'text-slate-400'}`}><Home className="h-5 w-5" />{t.navHome}</button>
          <button type="button" onClick={() => changeMobilePage('packs')} className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black ${mobilePage === 'packs' ? 'text-cyan-200' : 'text-slate-400'}`}><PackageOpen className="h-5 w-5" />{t.navPacks}</button>
          <button type="button" onClick={() => changeMobilePage('auction')} className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black ${mobilePage === 'auction' ? 'text-yellow-300' : 'text-slate-400'}`}><Gavel className="h-5 w-5" />{t.navAuction}</button>
          <button type="button" onClick={() => changeMobilePage('rewards')} className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black ${mobilePage === 'rewards' ? 'text-purple-300' : 'text-slate-400'}`}><Gift className="h-5 w-5" />{t.navRewards}</button>
          <button type="button" onClick={() => changeMobilePage('account')} className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black ${mobilePage === 'account' ? 'text-emerald-300' : 'text-slate-400'}`}><UserCircle className="h-5 w-5" />{t.navAccount}</button>
        </div>
      </nav>

      <AudioGateModal
        isOpen={isAudioGateOpen}
        onEnterWithSound={enterWithSound}
        onContinueMuted={continueMuted}
      />

      <PackDetailModal
        language={language}
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
        language={language}
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
        username={playerProfile.displayName}
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
        language={language}
        dailyLoginState={dailyLoginState}
        onClose={() => setIsDailyLoginOpen(false)}
        onClaim={handleClaimDailyLoginReward}
      />

      <ShippingCenterDrawer
        isOpen={isShippingCenterOpen}
        cards={vaultCards}
        onClose={() => setIsShippingCenterOpen(false)}
      />

      <ProfileSettingsDrawer
        isOpen={isProfileSettingsOpen}
        language={language}
        languageLabel={getLanguageLabel(language)}
        onChangeLanguage={setLanguage}
        playerProfile={playerProfile}
        isSoundEnabled={isSoundEnabled}
        walletBalance={walletBalance}
        shippingRequestCount={vaultCards.filter((card) => card.status === 'Shipping Requested').length}
        onSaveProfile={handleSavePlayerProfile}
        onClose={() => setIsProfileSettingsOpen(false)}
        onToggleSound={toggleSound}
        onOpenShippingCenter={() => {
          setIsProfileSettingsOpen(false)
          setIsShippingCenterOpen(true)
        }}
        onResetDemoData={() => {
          resetDemoData()
          setIsProfileSettingsOpen(false)
        }}
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
