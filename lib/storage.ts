import { apiClient } from "./api-client"
import type { Expense, Budget, Objective, UserProgress, User, Income, SpendingLimit } from "./types"

const STORAGE_KEYS = {
  USER: "expense_tracker_user",
  EXPENSES: "expense_tracker_expenses",
  BUDGETS: "expense_tracker_budgets",
  OBJECTIVES: "expense_tracker_objectives",
  PROGRESS: "expense_tracker_progress",
  INCOME: "expense_tracker_income",
  ADMIN_SESSION: "expense_tracker_admin_session",
  SPENDING_LIMITS: "expense_tracker_spending_limits",
  PASSWORD: "expense_tracker_password",
  AUTH_TOKEN: "authToken",
}

export const storage = {
  getUser: (): User | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(STORAGE_KEYS.USER)
    return data ? JSON.parse(data) : null
  },

  setUser: (user: User) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  getExpenses: (): Expense[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES)
    return data ? JSON.parse(data) : []
  },

  setExpenses: (expenses: Expense[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses))
  },

  getBudgets: (): Budget[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS)
    return data ? JSON.parse(data) : []
  },

  setBudgets: (budgets: Budget[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets))
  },

  getObjectives: (): Objective[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.OBJECTIVES)
    return data ? JSON.parse(data) : []
  },

  setObjectives: (objectives: Objective[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.OBJECTIVES, JSON.stringify(objectives))
  },

  getProgress: (): UserProgress | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS)
    return data ? JSON.parse(data) : null
  },

  setProgress: (progress: UserProgress) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
  },

  getIncome: (): Income[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.INCOME)
    return data ? JSON.parse(data) : []
  },

  setIncome: (income: Income[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.INCOME, JSON.stringify(income))
  },

  getSpendingLimits: (): SpendingLimit[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.SPENDING_LIMITS)
    return data ? JSON.parse(data) : []
  },

  setSpendingLimits: (limits: SpendingLimit[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.SPENDING_LIMITS, JSON.stringify(limits))
  },

  getPassword: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(STORAGE_KEYS.PASSWORD)
  },

  setPassword: (password: string) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.PASSWORD, password)
  },

  getAdminSession: (): boolean => {
    if (typeof window === "undefined") return false
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION)
    return data === "true"
  },

  setAdminSession: (isAdmin: boolean) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, isAdmin.toString())
  },

  clearAll: () => {
    if (typeof window === "undefined") return
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
  },

  // New cloud sync methods
  async syncExpensesFromCloud(): Promise<Expense[]> {
    try {
      const expenses = await apiClient.getExpenses()
      storage.setExpenses(expenses)
      return expenses
    } catch (error) {
      console.error("Failed to sync expenses from cloud:", error)
      return storage.getExpenses()
    }
  },

  async syncBudgetsFromCloud(): Promise<Budget[]> {
    try {
      const budgets = await apiClient.getBudgets()
      storage.setBudgets(budgets)
      return budgets
    } catch (error) {
      console.error("Failed to sync budgets from cloud:", error)
      return storage.getBudgets()
    }
  },

  async addExpenseToCloud(expense: Omit<Expense, "id" | "createdAt">) {
    try {
      return await apiClient.addExpense(expense)
    } catch (error) {
      console.error("Failed to add expense to cloud:", error)
      throw error
    }
  },

  async addBudgetToCloud(budget: Omit<Budget, "id" | "createdAt">) {
    try {
      return await apiClient.addBudget(budget)
    } catch (error) {
      console.error("Failed to add budget to cloud:", error)
      throw error
    }
  },

  // Auth token management
  getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  },

  setAuthToken(token: string) {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  },

  clearAuthToken() {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  },
}
