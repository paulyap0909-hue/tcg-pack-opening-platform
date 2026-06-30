export type TopUpPackageId =
  | 'starter_spark'
  | 'rookie_pack'
  | 'hunter_pack'
  | 'elite_pack'
  | 'master_pack'
  | 'whale_vault'

export type TopUpPackage = {
  id: TopUpPackageId
  labelKey:
    | 'topUpStarterSpark'
    | 'topUpRookiePack'
    | 'topUpHunterPack'
    | 'topUpElitePack'
    | 'topUpMasterPack'
    | 'topUpWhaleVault'
  amountMyr: number
  points: number
  basePoints: number
  bonusPoints: number
  badgeKey?: 'mostPopular' | 'bestValue' | 'maxBonus'
  icon: 'gem' | 'spark' | 'wallet' | 'zap'
}

export const TOP_UP_PACKAGES: TopUpPackage[] = [
  {
    id: 'starter_spark',
    labelKey: 'topUpStarterSpark',
    amountMyr: 5,
    points: 450,
    basePoints: 500,
    bonusPoints: -50,
    icon: 'gem',
  },
  {
    id: 'rookie_pack',
    labelKey: 'topUpRookiePack',
    amountMyr: 10,
    points: 1000,
    basePoints: 1000,
    bonusPoints: 0,
    icon: 'gem',
  },
  {
    id: 'hunter_pack',
    labelKey: 'topUpHunterPack',
    amountMyr: 30,
    points: 3300,
    basePoints: 3000,
    bonusPoints: 300,
    badgeKey: 'mostPopular',
    icon: 'spark',
  },
  {
    id: 'elite_pack',
    labelKey: 'topUpElitePack',
    amountMyr: 50,
    points: 5800,
    basePoints: 5000,
    bonusPoints: 800,
    icon: 'wallet',
  },
  {
    id: 'master_pack',
    labelKey: 'topUpMasterPack',
    amountMyr: 100,
    points: 12000,
    basePoints: 10000,
    bonusPoints: 2000,
    badgeKey: 'bestValue',
    icon: 'zap',
  },
  {
    id: 'whale_vault',
    labelKey: 'topUpWhaleVault',
    amountMyr: 200,
    points: 26000,
    basePoints: 20000,
    bonusPoints: 6000,
    badgeKey: 'maxBonus',
    icon: 'wallet',
  },
]

export const DEFAULT_TOP_UP_PACKAGE_ID: TopUpPackageId = 'hunter_pack'

export const getTopUpPackage = (packageId: string) =>
  TOP_UP_PACKAGES.find((topUpPackage) => topUpPackage.id === packageId)
