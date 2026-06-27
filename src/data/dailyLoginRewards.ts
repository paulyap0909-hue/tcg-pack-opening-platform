export type DailyLoginReward = {
  day: number
  title: string
  subtitle: string
  points: number
  xp: number
  raffleTickets: number
  kind: 'pack' | 'bonus' | 'gem' | 'free-pull'
}

export type DailyLoginState = {
  streakDay: number
  lastClaimDate: string | null
  totalClaims: number
}

export const initialDailyLoginState: DailyLoginState = {
  streakDay: 1,
  lastClaimDate: null,
  totalClaims: 0,
}

export const dailyLoginRewards: DailyLoginReward[] = [
  {
    day: 1,
    title: 'Starter Pack',
    subtitle: '40 pts + 1 ticket',
    points: 40,
    xp: 20,
    raffleTickets: 1,
    kind: 'pack',
  },
  {
    day: 2,
    title: '+5% Boost',
    subtitle: '60 pts + 1 ticket',
    points: 60,
    xp: 25,
    raffleTickets: 1,
    kind: 'bonus',
  },
  {
    day: 3,
    title: '15 Gems',
    subtitle: '80 pts + 2 tickets',
    points: 80,
    xp: 35,
    raffleTickets: 2,
    kind: 'gem',
  },
  {
    day: 4,
    title: '+3% Bonus',
    subtitle: '100 pts + 2 tickets',
    points: 100,
    xp: 45,
    raffleTickets: 2,
    kind: 'bonus',
  },
  {
    day: 5,
    title: 'Rare Pack',
    subtitle: '150 pts + 3 tickets',
    points: 150,
    xp: 70,
    raffleTickets: 3,
    kind: 'pack',
  },
  {
    day: 6,
    title: '+10% Top Up',
    subtitle: '220 pts + 5 tickets',
    points: 220,
    xp: 90,
    raffleTickets: 5,
    kind: 'bonus',
  },
  {
    day: 7,
    title: 'Free Pull',
    subtitle: '350 pts + 10 tickets',
    points: 350,
    xp: 150,
    raffleTickets: 10,
    kind: 'free-pull',
  },
]

export const getTodayDateKey = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const getDailyRewardForStreak = (streakDay: number) => {
  const normalizedDay = Math.min(Math.max(streakDay, 1), dailyLoginRewards.length)

  return dailyLoginRewards[normalizedDay - 1] ?? dailyLoginRewards[0]
}

export const hasClaimedDailyRewardToday = (state: DailyLoginState) => {
  return state.lastClaimDate === getTodayDateKey()
}

export const getNextDailyStreakDay = (streakDay: number) => {
  return streakDay >= dailyLoginRewards.length ? 1 : streakDay + 1
}
