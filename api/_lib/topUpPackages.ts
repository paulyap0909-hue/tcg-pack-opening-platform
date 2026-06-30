export type TopUpPackageId =
  | 'starter_spark'
  | 'rookie_pack'
  | 'hunter_pack'
  | 'elite_pack'
  | 'master_pack'
  | 'whale_vault'

export type TopUpPackage = {
  id: TopUpPackageId
  label: string
  amountMyr: number
  amountCents: number
  points: number
}

export const TOP_UP_PACKAGES: TopUpPackage[] = [
  {
    id: 'starter_spark',
    label: 'Starter Spark',
    amountMyr: 5,
    amountCents: 500,
    points: 450,
  },
  {
    id: 'rookie_pack',
    label: 'Rookie Pack',
    amountMyr: 10,
    amountCents: 1000,
    points: 1000,
  },
  {
    id: 'hunter_pack',
    label: 'Hunter Pack',
    amountMyr: 30,
    amountCents: 3000,
    points: 3300,
  },
  {
    id: 'elite_pack',
    label: 'Elite Pack',
    amountMyr: 50,
    amountCents: 5000,
    points: 5800,
  },
  {
    id: 'master_pack',
    label: 'Master Pack',
    amountMyr: 100,
    amountCents: 10000,
    points: 12000,
  },
  {
    id: 'whale_vault',
    label: 'Whale Vault',
    amountMyr: 200,
    amountCents: 20000,
    points: 26000,
  },
]

export const getTopUpPackage = (packageId: string) =>
  TOP_UP_PACKAGES.find((topUpPackage) => topUpPackage.id === packageId)
