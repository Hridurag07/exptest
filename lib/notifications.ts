import { storage } from "./storage"
import { budgets } from "./budgets"
import type { BudgetNotification, Budget } from "./types"

const STORAGE_KEY = "expense_tracker_notifications"

export const notifications = {
  getAll: (): BudgetNotification[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  save: (notifications: BudgetNotification[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  },

  add: (notification: Omit<BudgetNotification, "id" | "timestamp" | "read">): BudgetNotification => {
    const allNotifications = notifications.getAll()
    const newNotification: BudgetNotification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      read: false,
    }
    allNotifications.push(newNotification)
    notifications.save(allNotifications)
    return newNotification
  },

  markAsRead: (id: string) => {
    const allNotifications = notifications.getAll()
    const updated = allNotifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    notifications.save(updated)
  },

  markAllAsRead: () => {
    const allNotifications = notifications.getAll()
    const updated = allNotifications.map((n) => ({ ...n, read: true }))
    notifications.save(updated)
  },

  getUnreadCount: (): number => {
    return notifications.getAll().filter((n) => !n.read).length
  },

  delete: (id: string) => {
    const allNotifications = notifications.getAll()
    const filtered = allNotifications.filter((n) => n.id !== id)
    notifications.save(filtered)
  },

  clearAll: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  },

  checkBudgetThresholds: (category: string): void => {
    const allBudgets = storage.getBudgets()

    // Check category-specific budget
    const categoryBudget = allBudgets.find((b) => b.category === category)
    if (categoryBudget) {
      notifications.checkSingleBudget(categoryBudget)
    }

    // Check overall budget
    const overallBudget = allBudgets.find((b) => b.category === "overall")
    if (overallBudget) {
      notifications.checkSingleBudget(overallBudget)
    }
  },

  checkSingleBudget: (budget: Budget): void => {
    if (!budget.notificationThresholds || budget.notificationThresholds.length === 0) {
      return
    }

    const status = budgets.getBudgetStatus(budget)
    const currentPercentage = status.percentage

    // Check if we've crossed any thresholds
    for (const threshold of budget.notificationThresholds) {
      if (currentPercentage >= threshold) {
        // Check if we already sent a notification for this threshold recently (within last hour)
        const recentNotifications = notifications
          .getAll()
          .filter((n) => n.budgetId === budget.id && Math.abs(n.threshold - threshold) < 1)

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
        const hasRecentNotification = recentNotifications.some((n) => n.timestamp > oneHourAgo)

        if (!hasRecentNotification) {
          // Create notification
          notifications.add({
            budgetId: budget.id,
            budgetCategory: budget.category === "overall" ? "Overall Budget" : budget.category,
            threshold,
            spent: status.spent,
            budgetAmount: budget.amount,
          })

          // Show browser notification if permission granted
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            const message =
              currentPercentage >= 100
                ? `You've exceeded your ${budget.category} budget!`
                : `You've reached ${threshold}% of your ${budget.category} budget`

            new Notification("Budget Alert", {
              body: message,
              icon: "/favicon.ico",
              tag: `budget-${budget.id}-${threshold}`,
            })
          }
        }
      }
    }
  },

  requestPermission: async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false
    }

    if (Notification.permission === "granted") {
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }

    return false
  },
}
