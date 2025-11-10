import type { Reward } from "./types"

const GIFT_CARD_PROVIDERS = [
  { name: "Amazon", minValue: 50, maxValue: 500 },
  { name: "Flipkart", minValue: 50, maxValue: 500 },
  { name: "Swiggy", minValue: 25, maxValue: 200 },
  { name: "Zomato", minValue: 25, maxValue: 200 },
  { name: "BookMyShow", minValue: 50, maxValue: 300 },
  { name: "Myntra", minValue: 50, maxValue: 500 },
  { name: "Nykaa", minValue: 50, maxValue: 300 },
]

export const rewards = {
  generateGiftCard: (level: number, reason: string): Reward => {
    // Calculate reward value based on level
    const baseValue = 25
    const value = Math.min(baseValue * Math.floor(level / 5 + 1), 500)

    // Select random provider
    const availableProviders = GIFT_CARD_PROVIDERS.filter((p) => value >= p.minValue && value <= p.maxValue)
    const provider = availableProviders[Math.floor(Math.random() * availableProviders.length)]

    // Generate mock gift card code
    const code = `GC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    return {
      id: crypto.randomUUID(),
      type: "gift-card",
      name: `${provider.name} Gift Card`,
      value,
      provider: provider.name,
      code,
      earnedAt: new Date().toISOString(),
      claimed: false,
      reason,
    }
  },

  getRewardForLevel: (level: number): Reward | null => {
    // Award gift card every 5 levels
    if (level % 5 === 0 && level > 0) {
      return rewards.generateGiftCard(level, `Reached Level ${level}`)
    }
    return null
  },

  getRewardForAchievement: (achievementName: string, level: number): Reward | null => {
    // Award gift cards for special achievements
    const specialAchievements = ["Month Master", "Century Club", "Dedicated Tracker"]

    if (specialAchievements.includes(achievementName)) {
      return rewards.generateGiftCard(level, `Earned ${achievementName} badge`)
    }

    return null
  },
}
