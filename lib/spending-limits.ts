import { storage } from "./storage"
import type { SpendingLimit } from "./types"
import { expenses } from "./expenses"
import { notifications } from "./notifications"

export const spendingLimits = {
  add: (
    category: string | "overall",
    limitType: "daily" | "weekly" | "monthly",
    amount: number,
    notifyAt: number[] = [80, 90, 100],
  ): SpendingLimit => {
    const allLimits = storage.getSpendingLimits()

    const newLimit: SpendingLimit = {
      id: crypto.randomUUID(),
      category,
      limitType,
      amount,
      notifyAt: notifyAt.sort((a, b) => a - b),
      createdAt: new Date().toISOString(),
      enabled: true,
    }

    allLimits.push(newLimit)
    storage.setSpendingLimits(allLimits)

    return newLimit
  },

  getAll: (): SpendingLimit[] => {
    return storage.getSpendingLimits()
  },

  getEnabled: (): SpendingLimit[] => {
    return storage.getSpendingLimits().filter((limit) => limit.enabled)
  },

  getByCategory: (category: string): SpendingLimit[] => {
    return storage.getSpendingLimits().filter((limit) => limit.category === category)
  },

  update: (id: string, updates: Partial<Omit<SpendingLimit, "id" | "createdAt">>): void => {
    const allLimits = storage.getSpendingLimits()
    const updated = allLimits.map((limit) => (limit.id === id ? { ...limit, ...updates } : limit))
    storage.setSpendingLimits(updated)
  },

  delete: (id: string): void => {
    const allLimits = storage.getSpendingLimits()
    const filtered = allLimits.filter((limit) => limit.id !== id)
    storage.setSpendingLimits(filtered)
  },

  toggle: (id: string): void => {
    const allLimits = storage.getSpendingLimits()
    const updated = allLimits.map((limit) => (limit.id === id ? { ...limit, enabled: !limit.enabled } : limit))
    storage.setSpendingLimits(updated)
  },

  getLimitStatus: (
    limit: SpendingLimit,
  ): {
    spent: number
    remaining: number
    percentage: number
    isOverLimit: boolean
  } => {
    let spent = 0

    if (limit.category === "overall") {
      // Calculate total spending for the period
      spent = expenses.getTotalByPeriod(
        limit.limitType === "daily" ? "daily" : limit.limitType === "weekly" ? "weekly" : "monthly",
      )
    } else {
      // Calculate spending for specific category
      const categoryExpenses = expenses.getByCategory(limit.category)
      const now = new Date()
      let startDate: Date

      if (limit.limitType === "daily") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      } else if (limit.limitType === "weekly") {
        const dayOfWeek = now.getDay()
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek)
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      }

      spent = categoryExpenses
        .filter((expense) => new Date(expense.date) >= startDate)
        .reduce((total, expense) => {
          let amount = expense.amount
          // Convert frequency-based expenses to match limit period
          if (limit.limitType === "daily") {
            if (expense.frequency === "weekly") amount = expense.amount / 7
            else if (expense.frequency === "monthly") amount = expense.amount / 30
          } else if (limit.limitType === "weekly" && expense.frequency === "monthly") {
            amount = expense.amount / 4
          } else if (limit.limitType === "monthly" && expense.frequency === "weekly") {
            amount = expense.amount * 4
          }
          return total + amount
        }, 0)
    }

    const remaining = limit.amount - spent
    const percentage = (spent / limit.amount) * 100
    const isOverLimit = spent > limit.amount

    return {
      spent,
      remaining,
      percentage: Math.min(percentage, 100),
      isOverLimit,
    }
  },

  checkLimitThresholds: (category: string): void => {
    const allLimits = spendingLimits.getEnabled()

    // Check category-specific limits
    const categoryLimits = allLimits.filter((l) => l.category === category)
    categoryLimits.forEach((limit) => {
      spendingLimits.checkSingleLimit(limit)
    })

    // Check overall limits
    const overallLimits = allLimits.filter((l) => l.category === "overall")
    overallLimits.forEach((limit) => {
      spendingLimits.checkSingleLimit(limit)
    })
  },

  checkSingleLimit: (limit: SpendingLimit): void => {
    if (!limit.enabled || !limit.notifyAt || limit.notifyAt.length === 0) {
      return
    }

    const status = spendingLimits.getLimitStatus(limit)
    const currentPercentage = status.percentage

    // Check if we've crossed any thresholds
    for (const threshold of limit.notifyAt) {
      if (currentPercentage >= threshold) {
        // Check if we already sent a notification for this threshold recently (within last hour)
        const recentNotifications = notifications
          .getAll()
          .filter(
            (n) =>
              n.budgetCategory === (limit.category === "overall" ? "Overall Limit" : limit.category) &&
              Math.abs(n.threshold - threshold) < 1,
          )

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
        const hasRecentNotification = recentNotifications.some((n) => n.timestamp > oneHourAgo)

        if (!hasRecentNotification) {
          // Create notification
          notifications.add({
            budgetId: limit.id,
            budgetCategory:
              limit.category === "overall"
                ? `Overall ${limit.limitType} limit`
                : `${limit.category} (${limit.limitType})`,
            threshold,
            spent: status.spent,
            budgetAmount: limit.amount,
          })

          // Show browser notification if permission granted
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            const message =
              currentPercentage >= 100
                ? `You've exceeded your ${limit.limitType} ${limit.category} spending limit!`
                : `You've reached ${threshold}% of your ${limit.limitType} ${limit.category} spending limit`

            new Notification("Spending Limit Alert", {
              body: message,
              icon: "/favicon.ico",
              tag: `limit-${limit.id}-${threshold}`,
            })
          }
        }
      }
    }
  },

  checkAllLimits: (): void => {
    const allLimits = spendingLimits.getEnabled()
    allLimits.forEach((limit) => {
      spendingLimits.checkSingleLimit(limit)
    })
  },
}
