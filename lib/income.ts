import { storage } from "./storage"
import type { Income, IncomeFrequency } from "./types"

export const income = {
  add: (amount: number, source: string, frequency: IncomeFrequency, description?: string): Income => {
    const allIncome = storage.getIncome()

    const newIncome: Income = {
      id: crypto.randomUUID(),
      amount,
      source,
      frequency,
      description,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    allIncome.push(newIncome)
    storage.setIncome(allIncome)

    return newIncome
  },

  getAll: (): Income[] => {
    return storage.getIncome()
  },

  getByDateRange: (startDate: Date, endDate: Date): Income[] => {
    const allIncome = storage.getIncome()
    return allIncome.filter((inc) => {
      const incomeDate = new Date(inc.date)
      return incomeDate >= startDate && incomeDate <= endDate
    })
  },

  delete: (id: string): void => {
    const allIncome = storage.getIncome()
    const filtered = allIncome.filter((inc) => inc.id !== id)
    storage.setIncome(filtered)
  },

  getTotalByPeriod: (period: "daily" | "weekly" | "monthly" | "yearly" | "all-time"): number => {
    const allIncome = storage.getIncome()
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

    return allIncome
      .filter((inc) => new Date(inc.date) >= startDate)
      .reduce((total, inc) => {
        let amount = inc.amount

        // Convert frequency-based income to the requested period
        if (inc.frequency === "one-time") {
          return total + amount
        }

        if (period === "daily") {
          if (inc.frequency === "weekly") amount = inc.amount / 7
          else if (inc.frequency === "monthly") amount = inc.amount / 30
        } else if (period === "weekly") {
          if (inc.frequency === "monthly") amount = inc.amount / 4
        } else if (period === "yearly") {
          if (inc.frequency === "daily") amount = inc.amount * 365
          else if (inc.frequency === "weekly") amount = inc.amount * 52
          else if (inc.frequency === "monthly") amount = inc.amount * 12
        }
        // For all-time, we just sum up the actual amounts without conversion

        return total + amount
      }, 0)
  },

  getNetIncome: (period: "daily" | "weekly" | "monthly" | "yearly" | "all-time"): number => {
    const totalIncome = income.getTotalByPeriod(period)
    return totalIncome
  },
}
