"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Expense } from "@/lib/types"
import { expenses } from "@/lib/expenses"

interface ExpenseListProps {
  expenses: Expense[]
  onExpenseDeleted: () => void
  showPeriodFilter?: boolean
}

type TimePeriod = "weekly" | "monthly" | "yearly" | "all-time"

export function ExpenseList({ expenses: expenseList, onExpenseDeleted, showPeriodFilter = false }: ExpenseListProps) {
  const [period, setPeriod] = useState<TimePeriod>("monthly")

  const handleDelete = (id: string) => {
    expenses.delete(id)
    onExpenseDeleted()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getFrequencyBadgeColor = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "bg-chart-1/20 text-chart-1"
      case "weekly":
        return "bg-chart-2/20 text-chart-2"
      case "monthly":
        return "bg-chart-3/20 text-chart-3"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getFilteredExpenses = () => {
    if (!showPeriodFilter) return expenseList

    const now = new Date()
    let startDate: Date

    switch (period) {
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

    return expenseList.filter((expense) => new Date(expense.date) >= startDate)
  }

  const filteredExpenses = getFilteredExpenses()

  if (expenseList.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-center">No expenses logged yet. Start tracking to earn points!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest spending activity</CardDescription>
          </div>
          {showPeriodFilter && (
            <Select value={period} onValueChange={(value) => setPeriod(value as TimePeriod)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{expense.category}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${getFrequencyBadgeColor(expense.frequency)}`}
                  >
                    {expense.frequency}
                  </span>
                </div>
                {expense.description && <p className="text-sm text-muted-foreground">{expense.description}</p>}
                <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-semibold">₹{expense.amount.toFixed(2)}</p>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)} className="h-8 w-8">
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Delete expense</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
