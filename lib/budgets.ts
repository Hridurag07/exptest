import { storage } from "./storage"
import type { Budget } from "./types"
import { expenses } from "./expenses"

export const budgets = {
  add: (
    category: string | "overall",
    amount: number,
    period: "weekly" | "monthly",
    notificationThresholds?: number[],
  ): Budget => {
    const allBudgets = storage.getBudgets()

    const newBudget: Budget = {
      id: crypto.randomUUID(),
      category,
      amount,
      period,
      createdAt: new Date().toISOString(),
      notificationThresholds: notificationThresholds || [80, 90, 100],
    }

    allBudgets.push(newBudget)
    storage.setBudgets(allBudgets)

    return newBudget
  },

  getAll: (): Budget[] => {
    return storage.getBudgets()
  },

  getByCategory: (category: string): Budget | undefined => {
    const allBudgets = storage.getBudgets()
    return allBudgets.find((budget) => budget.category === category)
  },

  getOverallBudget: (period: "weekly" | "monthly"): Budget | undefined => {
    const allBudgets = storage.getBudgets()
    return allBudgets.find((budget) => budget.category === "overall" && budget.period === period)
  },

  update: (id: string, amount: number, notificationThresholds?: number[]): void => {
    const allBudgets = storage.getBudgets()
    const updated = allBudgets.map((budget) =>
      budget.id === id
        ? {
            ...budget,
            amount,
            ...(notificationThresholds !== undefined && { notificationThresholds }),
          }
        : budget,
    )
    storage.setBudgets(updated)
  },

  delete: (id: string): void => {
    const allBudgets = storage.getBudgets()
    const filtered = allBudgets.filter((budget) => budget.id !== id)
    storage.setBudgets(filtered)
  },

  getBudgetStatus: (
    budget: Budget,
  ): {
    spent: number
    remaining: number
    percentage: number
    isOverBudget: boolean
  } => {
    let spent = 0

    if (budget.category === "overall") {
      // Calculate total spending for the period
      spent = expenses.getTotalByPeriod(budget.period === "weekly" ? "weekly" : "monthly")
    } else {
      // Calculate spending for specific category
      const categoryExpenses = expenses.getByCategory(budget.category)
      const now = new Date()
      let startDate: Date

      if (budget.period === "weekly") {
        const dayOfWeek = now.getDay()
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek)
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      }

      spent = categoryExpenses
        .filter((expense) => new Date(expense.date) >= startDate)
        .reduce((total, expense) => {
          let amount = expense.amount
          // Convert frequency-based expenses to match budget period
          if (budget.period === "weekly" && expense.frequency === "monthly") {
            amount = expense.amount / 4
          } else if (budget.period === "monthly" && expense.frequency === "weekly") {
            amount = expense.amount * 4
          }
          return total + amount
        }, 0)
    }

    const remaining = budget.amount - spent
    const percentage = (spent / budget.amount) * 100
    const isOverBudget = spent > budget.amount

    return {
      spent,
      remaining,
      percentage: Math.min(percentage, 100),
      isOverBudget,
    }
  },
}
