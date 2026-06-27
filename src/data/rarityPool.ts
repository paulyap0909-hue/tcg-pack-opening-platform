import thunderCard from '../assets/cards/thunder-card.png'
import pirateCard from '../assets/cards/pirate-card.png'
import mysticCard from '../assets/cards/mystic-card.png'

export type Pack = {
  name: string
  category: string
  price: string
  remaining: string
  glow: string
  badge: string
  cover: string
}

export type RevealCard = {
  name: string
  rarity: string
  grade: string
  glow: string
  image: string
  rate: number
  rank: number
}

export const rarityCards: RevealCard[] = [
  {
    name: 'Holographic Thunder Dragon',
    rarity: 'Top Prize',
    grade: 'Chase Pull',
    glow: 'from-yellow-300 via-amber-400 to-red-500',
    image: thunderCard,
    rate: 0.5,
    rank: 4,
  },
  {
    name: 'Pirate King Wanted Card',
    rarity: 'Super Rare',
    grade: 'Premium Pull',
    glow: 'from-red-400 via-orange-400 to-yellow-300',
    image: pirateCard,
    rate: 3,
    rank: 3,
  },
  {
    name: 'Mystic Energy Collector Card',
    rarity: 'Rare',
    grade: 'Vault Pull',
    glow: 'from-cyan-300 via-blue-400 to-purple-500',
    image: mysticCard,
    rate: 12,
    rank: 2,
  },
]

export function createCommonCard(pack: Pack): RevealCard {
  return {
    name: `${pack.name} Standard Vault Card`,
    rarity: 'Common',
    grade: 'Standard Pull',
    glow: 'from-slate-400 via-cyan-300 to-slate-500',
    image: pack.cover,
    rate: 84.5,
    rank: 1,
  }
}

export function getWeightedRandomCard(pack: Pack): RevealCard {
  const pool = [...rarityCards, createCommonCard(pack)]
  const random = Math.random() * 100

  let cumulative = 0

  for (const card of pool) {
    cumulative += card.rate

    if (random <= cumulative) {
      return card
    }
  }

  return createCommonCard(pack)
}

export function createWeightedResults(pack: Pack, quantity: number): RevealCard[] {
  return Array.from({ length: quantity }, () => getWeightedRandomCard(pack))
}

export function getBestPull(cards: RevealCard[]) {
  return [...cards].sort((a, b) => b.rank - a.rank)[0]
}