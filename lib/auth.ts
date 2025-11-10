import { storage } from "./storage"
import { apiClient } from "./api-client"
import type { User } from "./types"

export const auth = {
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const user = await apiClient.login(email, password)
      storage.setUser(user)
      return user
    } catch (error) {
      console.error("Login failed:", error)
      return null
    }
  },

  signup: async (email: string, password: string, name: string, theme: "light" | "dark"): Promise<User> => {
    const user = await apiClient.register(email, password, name, theme)
    storage.setUser(user)
    return user
  },

  logout: () => {
    apiClient.logout()
    storage.clearAll()
  },

  getCurrentUser: (): User | null => {
    return storage.getUser()
  },

  isAuthenticated: (): boolean => {
    const user = storage.getUser()
    const token = storage.getAuthToken()
    return user !== null && token !== null
  },

  loginAsAdmin: async () => {
    try {
      // For development, use hardcoded credentials
      const user = await apiClient.login("admin@expensetracker.com", "0487")
      storage.setUser(user)
      storage.setAdminSession(true)
      return user
    } catch (error) {
      console.error("Admin login failed:", error)
      return null
    }
  },

  isAdmin: (): boolean => {
    return storage.getAdminSession()
  },

  hasValidToken: (): boolean => {
    const token = storage.getAuthToken()
    return token !== null && token.length > 0
  },

  refreshSession: async (): Promise<boolean> => {
    try {
      const profile = await apiClient.getProfile()
      if (profile) {
        storage.setUser(profile)
        return true
      }
      return false
    } catch (error) {
      console.error("Failed to refresh session:", error)
      return false
    }
  },
}

function initializeObjectives() {
  const objectives = [
    {
      id: crypto.randomUUID(),
      type: "daily" as const,
      title: "Log Your First Expense",
      description: "Track at least one expense today",
      target: 1,
      current: 0,
      completed: false,
      points: 10,
    },
    {
      id: crypto.randomUUID(),
      type: "daily" as const,
      title: "Track Multiple Expenses",
      description: "Log at least 3 expenses today",
      target: 3,
      current: 0,
      completed: false,
      points: 20,
    },
    {
      id: crypto.randomUUID(),
      type: "daily" as const,
      title: "Add Income Source",
      description: "Record at least one income entry today",
      target: 1,
      current: 0,
      completed: false,
      points: 15,
    },
    {
      id: crypto.randomUUID(),
      type: "weekly" as const,
      title: "Stay Within Budget",
      description: "Keep expenses under 80% of weekly budget",
      target: 80,
      current: 0,
      completed: false,
      points: 50,
    },
    {
      id: crypto.randomUUID(),
      type: "weekly" as const,
      title: "Log Daily This Week",
      description: "Log expenses for at least 5 days this week",
      target: 5,
      current: 0,
      completed: false,
      points: 40,
    },
    {
      id: crypto.randomUUID(),
      type: "weekly" as const,
      title: "Review Your Budgets",
      description: "Create or update at least one budget this week",
      target: 1,
      current: 0,
      completed: false,
      points: 30,
    },
    {
      id: crypto.randomUUID(),
      type: "monthly" as const,
      title: "Consistent Logging",
      description: "Log expenses for 25 out of 30 days",
      target: 25,
      current: 0,
      completed: false,
      points: 100,
    },
    {
      id: crypto.randomUUID(),
      type: "monthly" as const,
      title: "Budget Master",
      description: "Stay within all budgets for the entire month",
      target: 1,
      current: 0,
      completed: false,
      points: 150,
    },
    {
      id: crypto.randomUUID(),
      type: "monthly" as const,
      title: "Savings Goal",
      description: "Save at least 20% of your monthly income",
      target: 20,
      current: 0,
      completed: false,
      points: 120,
    },
  ]

  storage.setObjectives(objectives)
}
