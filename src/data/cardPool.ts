export type Pack = {
  name: string
  category: string
  price: string
  remaining: string
  remainingQuantity: number
  totalQuantity: number
  glow: string
  badge: string
  cover: string
}

export type RevealCard = {
  id: string
  name: string
  rarity: string
  grade: string
  image: string
  glow: string
  chance: number
  rank: number
  sellBackPoints: number
  description: string
  setName: string
  cardNumber: string
  game: 'pokemon'
}

export const pokemonPackCoverUrls = {
  charizard151: 'https://images.pokemontcg.io/sv3pt5/199_hires.png',
  pikachuVmax: 'https://images.pokemontcg.io/swsh4/188_hires.png',
  arceusGallery: 'https://images.pokemontcg.io/swsh12pt5gg/GG70_hires.png',
  baseCharizard: 'https://images.pokemontcg.io/base1/4_hires.png',
  mewEx: 'https://images.pokemontcg.io/sv3pt5/151_hires.png',
  blastoiseBase: 'https://images.pokemontcg.io/base1/2_hires.png',
  venusaurBase: 'https://images.pokemontcg.io/base1/15_hires.png',
  crownPikachu: 'https://images.pokemontcg.io/swsh12pt5gg/GG30_hires.png',
}

export const pokemonRealCardPool: RevealCard[] = [
  {
    id: 'pokemon-sv3pt5-199',
    game: 'pokemon',
    name: 'Charizard ex',
    rarity: 'Special Illustration Rare',
    grade: 'Mint Style',
    image: 'https://images.pokemontcg.io/sv3pt5/199_hires.png',
    glow: 'from-orange-300 to-red-600',
    chance: 0.7,
    rank: 5,
    sellBackPoints: 1200,
    description: 'Scarlet & Violet 151 chase card with premium showcase artwork.',
    setName: 'Scarlet & Violet 151',
    cardNumber: '199/165',
  },
  {
    id: 'pokemon-swsh45sv-SV107',
    game: 'pokemon',
    name: 'Charizard VMAX',
    rarity: 'Rare Shiny VMAX',
    grade: 'Mint Style',
    image: 'https://images.pokemontcg.io/swsh45sv/SV107_hires.png',
    glow: 'from-red-400 to-fuchsia-700',
    chance: 0.9,
    rank: 5,
    sellBackPoints: 1100,
    description: 'Shining Fates shiny vault chase pull.',
    setName: 'Shining Fates Shiny Vault',
    cardNumber: 'SV107/SV122',
  },
  {
    id: 'pokemon-swsh4-188',
    game: 'pokemon',
    name: 'Pikachu VMAX',
    rarity: 'Rare Rainbow',
    grade: 'Mint Style',
    image: 'https://images.pokemontcg.io/swsh4/188_hires.png',
    glow: 'from-yellow-300 to-pink-600',
    chance: 1.1,
    rank: 5,
    sellBackPoints: 1000,
    description: 'Vivid Voltage rainbow chase pull.',
    setName: 'Vivid Voltage',
    cardNumber: '188/185',
  },
  {
    id: 'pokemon-swsh12pt5gg-GG70',
    game: 'pokemon',
    name: 'Arceus VSTAR',
    rarity: 'Rare Secret',
    grade: 'Mint Style',
    image: 'https://images.pokemontcg.io/swsh12pt5gg/GG70_hires.png',
    glow: 'from-amber-200 to-violet-600',
    chance: 1.2,
    rank: 5,
    sellBackPoints: 900,
    description: 'Crown Zenith Galarian Gallery gold chase card.',
    setName: 'Crown Zenith Galarian Gallery',
    cardNumber: 'GG70/GG70',
  },
  {
    id: 'pokemon-base1-4',
    game: 'pokemon',
    name: 'Charizard',
    rarity: 'Rare Holo',
    grade: 'Classic Holo Style',
    image: 'https://images.pokemontcg.io/base1/4_hires.png',
    glow: 'from-orange-300 to-red-600',
    chance: 1.5,
    rank: 4,
    sellBackPoints: 800,
    description: 'Classic Base Set holo chase pull.',
    setName: 'Base Set',
    cardNumber: '4/102',
  },
  {
    id: 'pokemon-base1-2',
    game: 'pokemon',
    name: 'Blastoise',
    rarity: 'Rare Holo',
    grade: 'Classic Holo Style',
    image: 'https://images.pokemontcg.io/base1/2_hires.png',
    glow: 'from-cyan-300 to-blue-700',
    chance: 2,
    rank: 4,
    sellBackPoints: 650,
    description: 'Classic water-type holo from Base Set.',
    setName: 'Base Set',
    cardNumber: '2/102',
  },
  {
    id: 'pokemon-base1-15',
    game: 'pokemon',
    name: 'Venusaur',
    rarity: 'Rare Holo',
    grade: 'Classic Holo Style',
    image: 'https://images.pokemontcg.io/base1/15_hires.png',
    glow: 'from-lime-300 to-emerald-700',
    chance: 2,
    rank: 4,
    sellBackPoints: 650,
    description: 'Classic grass-type holo from Base Set.',
    setName: 'Base Set',
    cardNumber: '15/102',
  },
  {
    id: 'pokemon-sv3pt5-151',
    game: 'pokemon',
    name: 'Mew ex',
    rarity: 'Double Rare',
    grade: 'Near Mint Style',
    image: 'https://images.pokemontcg.io/sv3pt5/151_hires.png',
    glow: 'from-pink-300 to-purple-600',
    chance: 3.5,
    rank: 3,
    sellBackPoints: 350,
    description: 'Scarlet & Violet 151 Mew ex pull.',
    setName: 'Scarlet & Violet 151',
    cardNumber: '151/165',
  },
  {
    id: 'pokemon-sv3pt5-6',
    game: 'pokemon',
    name: 'Charizard ex',
    rarity: 'Double Rare',
    grade: 'Near Mint Style',
    image: 'https://images.pokemontcg.io/sv3pt5/6_hires.png',
    glow: 'from-orange-300 to-red-600',
    chance: 3.8,
    rank: 3,
    sellBackPoints: 320,
    description: 'Playable Charizard ex from Pokémon 151.',
    setName: 'Scarlet & Violet 151',
    cardNumber: '006/165',
  },
  {
    id: 'pokemon-swsh9-172',
    game: 'pokemon',
    name: 'Arceus VSTAR',
    rarity: 'Rare Rainbow',
    grade: 'Near Mint Style',
    image: 'https://images.pokemontcg.io/swsh9/172_hires.png',
    glow: 'from-amber-200 to-purple-600',
    chance: 3.2,
    rank: 4,
    sellBackPoints: 450,
    description: 'Rainbow rare Arceus VSTAR from Brilliant Stars.',
    setName: 'Brilliant Stars',
    cardNumber: '172/172',
  },
  {
    id: 'pokemon-swsh4-44',
    game: 'pokemon',
    name: 'Pikachu VMAX',
    rarity: 'Rare Holo VMAX',
    grade: 'Near Mint Style',
    image: 'https://images.pokemontcg.io/swsh4/44_hires.png',
    glow: 'from-yellow-300 to-amber-600',
    chance: 4.5,
    rank: 3,
    sellBackPoints: 250,
    description: 'Gigantamax Pikachu from Vivid Voltage.',
    setName: 'Vivid Voltage',
    cardNumber: '044/185',
  },
  {
    id: 'pokemon-xy1-1',
    game: 'pokemon',
    name: 'Venusaur-EX',
    rarity: 'Rare Holo EX',
    grade: 'Near Mint Style',
    image: 'https://images.pokemontcg.io/xy1/1_hires.png',
    glow: 'from-lime-300 to-green-700',
    chance: 4.8,
    rank: 3,
    sellBackPoints: 220,
    description: 'Classic EX-era Venusaur pull.',
    setName: 'XY',
    cardNumber: '1/146',
  },
  {
    id: 'pokemon-xy1-29',
    game: 'pokemon',
    name: 'Blastoise-EX',
    rarity: 'Rare Holo EX',
    grade: 'Near Mint Style',
    image: 'https://images.pokemontcg.io/xy1/29_hires.png',
    glow: 'from-cyan-300 to-blue-700',
    chance: 4.8,
    rank: 3,
    sellBackPoints: 220,
    description: 'Classic EX-era Blastoise pull.',
    setName: 'XY',
    cardNumber: '29/146',
  },
  {
    id: 'pokemon-base1-10',
    game: 'pokemon',
    name: 'Mewtwo',
    rarity: 'Rare Holo',
    grade: 'Classic Holo Style',
    image: 'https://images.pokemontcg.io/base1/10_hires.png',
    glow: 'from-purple-300 to-fuchsia-700',
    chance: 4.6,
    rank: 3,
    sellBackPoints: 200,
    description: 'Base Set psychic legendary holo.',
    setName: 'Base Set',
    cardNumber: '10/102',
  },
  {
    id: 'pokemon-sv3pt5-25',
    game: 'pokemon',
    name: 'Pikachu',
    rarity: 'Common',
    grade: 'Pack Fresh',
    image: 'https://images.pokemontcg.io/sv3pt5/25_hires.png',
    glow: 'from-yellow-300 to-cyan-500',
    chance: 15,
    rank: 1,
    sellBackPoints: 30,
    description: 'Pokémon 151 Pikachu base pull.',
    setName: 'Scarlet & Violet 151',
    cardNumber: '025/165',
  },
  {
    id: 'pokemon-base1-58',
    game: 'pokemon',
    name: 'Pikachu',
    rarity: 'Common',
    grade: 'Classic Pack Fresh',
    image: 'https://images.pokemontcg.io/base1/58_hires.png',
    glow: 'from-yellow-300 to-amber-500',
    chance: 15,
    rank: 1,
    sellBackPoints: 30,
    description: 'Classic Base Set Pikachu common pull.',
    setName: 'Base Set',
    cardNumber: '58/102',
  },
  {
    id: 'pokemon-sv3pt5-150',
    game: 'pokemon',
    name: 'Mewtwo',
    rarity: 'Rare',
    grade: 'Pack Fresh',
    image: 'https://images.pokemontcg.io/sv3pt5/150_hires.png',
    glow: 'from-purple-300 to-indigo-600',
    chance: 13,
    rank: 2,
    sellBackPoints: 80,
    description: 'Pokémon 151 Mewtwo rare pull.',
    setName: 'Scarlet & Violet 151',
    cardNumber: '150/165',
  },
  {
    id: 'pokemon-sv3pt5-9',
    game: 'pokemon',
    name: 'Blastoise ex',
    rarity: 'Double Rare',
    grade: 'Pack Fresh',
    image: 'https://images.pokemontcg.io/sv3pt5/9_hires.png',
    glow: 'from-cyan-300 to-blue-700',
    chance: 5.4,
    rank: 3,
    sellBackPoints: 160,
    description: 'Pokémon 151 Blastoise ex pull.',
    setName: 'Scarlet & Violet 151',
    cardNumber: '009/165',
  },
  {
    id: 'pokemon-sv3pt5-3',
    game: 'pokemon',
    name: 'Venusaur ex',
    rarity: 'Double Rare',
    grade: 'Pack Fresh',
    image: 'https://images.pokemontcg.io/sv3pt5/3_hires.png',
    glow: 'from-lime-300 to-green-700',
    chance: 5.4,
    rank: 3,
    sellBackPoints: 160,
    description: 'Pokémon 151 Venusaur ex pull.',
    setName: 'Scarlet & Violet 151',
    cardNumber: '003/165',
  },
  {
    id: 'pokemon-swsh12pt5-GG30',
    game: 'pokemon',
    name: 'Pikachu',
    rarity: 'Trainer Gallery Rare Holo',
    grade: 'Gallery Style',
    image: 'https://images.pokemontcg.io/swsh12pt5gg/GG30_hires.png',
    glow: 'from-yellow-300 to-orange-500',
    chance: 7.5,
    rank: 2,
    sellBackPoints: 120,
    description: 'Crown Zenith Galarian Gallery Pikachu pull.',
    setName: 'Crown Zenith Galarian Gallery',
    cardNumber: 'GG30/GG70',
  },
]

export const getOpenedTime = () =>
  new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

const getSafeLowerText = (value: string | undefined | null) => {
  return String(value ?? '').toLowerCase()
}

const getPoolForPack = (packName = '') => {
  const normalizedName = getSafeLowerText(packName)

  if (normalizedName.includes('151') || normalizedName.includes('charizard')) {
    return pokemonRealCardPool.filter(
      (card) =>
        card.setName.includes('151') ||
        getSafeLowerText(card.name).includes('charizard') ||
        getSafeLowerText(card.name).includes('mew'),
    )
  }

  if (normalizedName.includes('electric') || normalizedName.includes('pikachu')) {
    return pokemonRealCardPool.filter(
      (card) =>
        getSafeLowerText(card.name).includes('pikachu') ||
        getSafeLowerText(card.description).includes('lightning') ||
        getSafeLowerText(card.setName).includes('lightning'),
    )
  }

  if (normalizedName.includes('classic') || normalizedName.includes('base')) {
    return pokemonRealCardPool.filter((card) => card.setName === 'Base Set')
  }

  if (normalizedName.includes('crown') || normalizedName.includes('vault')) {
    return pokemonRealCardPool.filter(
      (card) =>
        card.setName.includes('Crown Zenith') ||
        getSafeLowerText(card.rarity).includes('secret') ||
        card.rank >= 4,
    )
  }

  return pokemonRealCardPool
}

export const getWeightedRandomCard = (packName = '') => {
  const pool = getPoolForPack(packName)
  const totalChance = pool.reduce((total, card) => total + card.chance, 0)
  let random = Math.random() * totalChance

  for (const card of pool) {
    random -= card.chance

    if (random <= 0) {
      return card
    }
  }

  return pool[pool.length - 1] ?? pokemonRealCardPool[0]!
}

export const createWeightedResults = (quantity: number, packName = '') => {
  return Array.from({ length: quantity }, () => getWeightedRandomCard(packName))
}

export const getBestPull = (cards: RevealCard[]) => {
  return [...cards].sort((firstCard, secondCard) => secondCard.rank - firstCard.rank)[0]
}
