export type ExpenseFrequency = "daily" | "weekly" | "monthly"

export interface Expense {
  id: string
  amount: number
  category: string
  frequency: ExpenseFrequency
  description?: string
  date: string
  createdAt: string
  isRecurring: boolean
}

export interface Budget {
  id: string
  category: string | "overall"
  amount: number
  period: "weekly" | "monthly"
  createdAt: string
  notificationThresholds?: number[] // e.g., [50, 80, 90] for 50%, 80%, 90% alerts
  lastNotificationAt?: string // Track when last notification was sent to avoid spam
}

export interface BudgetNotification {
  id: string
  budgetId: string
  budgetCategory: string
  threshold: number
  spent: number
  budgetAmount: number
  timestamp: string
  read: boolean
}

export interface SpendingLimit {
  id: string
  category: string | "overall"
  limitType: "daily" | "weekly" | "monthly"
  amount: number
  notifyAt: number[] // Percentage thresholds
  createdAt: string
  enabled: boolean
}

export interface Objective {
  id: string
  type: "daily" | "weekly" | "monthly"
  title: string
  description: string
  target: number
  current: number
  completed: boolean
  points: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt?: string
}

export interface Reward {
  id: string
  type: "gift-card"
  name: string
  value: number
  provider: string
  code?: string
  earnedAt: string
  claimed: boolean
  reason: string
}

export interface AvatarCosmetic {
  id: string
  type: "face" | "outfit" | "shoes" | "headdress" | "background"
  name: string
  unlocked: boolean
  unlockedAt?: string
  requiredLevel?: number
  requiredBadge?: string
  gender?: "male" | "female" | "neutral"
}

export interface AvatarSettings {
  selectedFace: string
  selectedOutfit: string
  selectedShoes: string
  selectedHeaddress: string
  selectedBackground: string
  cosmetics: AvatarCosmetic[]
}

export interface UserProgress {
  points: number
  level: number
  streak: number
  lastLogDate: string | null
  badges: Badge[]
  rewards: Reward[]
  avatarSettings: AvatarSettings
}

export interface User {
  id: string
  email: string
  name: string
  theme: "light" | "dark"
  createdAt: string
  password: string
}

export type IncomeFrequency = "one-time" | "daily" | "weekly" | "monthly"

export interface Income {
  id: string
  amount: number
  source: string
  frequency: IncomeFrequency
  description?: string
  date: string
  createdAt: string
}
