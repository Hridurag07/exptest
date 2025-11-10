import { storage } from "./storage"
import type { Expense, ExpenseFrequency } from "./types"
import { notifications } from "./notifications"
import { spendingLimits } from "./spending-limits"

export const expenses = {
  add: (
    amount: number,
    category: string,
    frequency: ExpenseFrequency,
    isRecurring: boolean,
    description?: string,
  ): Expense => {
    const allExpenses = storage.getExpenses()

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount,
      category,
      frequency,
      description,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isRecurring,
    }

    allExpenses.push(newExpense)
    storage.setExpenses(allExpenses)

    notifications.checkBudgetThresholds(category)
    spendingLimits.checkLimitThresholds(category)

    return newExpense
  },

  getAll: (): Expense[] => {
    return storage.getExpenses()
  },

  getByDateRange: (startDate: Date, endDate: Date): Expense[] => {
    const allExpenses = storage.getExpenses()
    return allExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= startDate && expenseDate <= endDate
    })
  },

  getByCategory: (category: string): Expense[] => {
    const allExpenses = storage.getExpenses()
    return allExpenses.filter((expense) => expense.category === category)
  },

  delete: (id: string): void => {
    const allExpenses = storage.getExpenses()
    const filtered = allExpenses.filter((expense) => expense.id !== id)
    storage.setExpenses(filtered)
  },

  getTotalByPeriod: (period: "daily" | "weekly" | "monthly" | "yearly" | "all-time"): number => {
    const allExpenses = storage.getExpenses()
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "daily":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "weekly":
        const dayOfWeek = now.getDay()
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek)
        break
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case "all-time":
        startDate = new Date(0) // Beginning of time
        break
    }

    return allExpenses
      .filter((expense) => new Date(expense.date) >= startDate)
      .reduce((total, expense) => {
        if (!expense.isRecurring) {
          return total + expense.amount
        }

        let amount = expense.amount
        if (period === "daily") {
          if (expense.frequency === "weekly") amount = expense.amount / 7
          else if (expense.frequency === "monthly") amount = expense.amount / 30
        } else if (period === "weekly") {
          if (expense.frequency === "monthly") amount = expense.amount / 4
        } else if (period === "yearly") {
          if (expense.frequency === "daily") amount = expense.amount * 365
          else if (expense.frequency === "weekly") amount = expense.amount * 52
          else if (expense.frequency === "monthly") amount = expense.amount * 12
        }
        // For all-time, we just sum up the actual amounts without conversion

        return total + amount
      }, 0)
  },

  getCategoryTotals: (period: "daily" | "weekly" | "monthly" | "yearly" | "all-time"): Record<string, number> => {
    const allExpenses = storage.getExpenses()
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "daily":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "weekly":
        const dayOfWeek = now.getDay()
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek)
        break
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case "all-time":
        startDate = new Date(0)
        break
    }

    const categoryTotals: Record<string, number> = {}

    allExpenses
      .filter((expense) => new Date(expense.date) >= startDate)
      .forEach((expense) => {
        let amount = expense.amount

        if (expense.isRecurring) {
          if (period === "daily") {
            if (expense.frequency === "weekly") amount = expense.amount / 7
            else if (expense.frequency === "monthly") amount = expense.amount / 30
          } else if (period === "weekly") {
            if (expense.frequency === "monthly") amount = expense.amount / 4
          } else if (period === "yearly") {
            if (expense.frequency === "daily") amount = expense.amount * 365
            else if (expense.frequency === "weekly") amount = expense.amount * 52
            else if (expense.frequency === "monthly") amount = expense.amount * 12
          }
        }

        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + amount
      })

    return categoryTotals
  },
}
