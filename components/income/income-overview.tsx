"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { income } from "@/lib/income"
import { expenses } from "@/lib/expenses"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TimePeriod = "weekly" | "monthly" | "yearly" | "all-time"

export function IncomeOverview() {
  const [period, setPeriod] = useState<TimePeriod>("monthly")

  const getIncomeForPeriod = () => {
    switch (period) {
      case "weekly":
        return income.getTotalByPeriod("weekly")
      case "monthly":
        return income.getTotalByPeriod("monthly")
      case "yearly":
        return income.getTotalByPeriod("yearly")
      case "all-time":
        return income.getTotalByPeriod("all-time")
    }
  }

  const getExpensesForPeriod = () => {
    switch (period) {
      case "weekly":
        return expenses.getTotalByPeriod("weekly")
      case "monthly":
        return expenses.getTotalByPeriod("monthly")
      case "yearly":
        return expenses.getTotalByPeriod("yearly")
      case "all-time":
        return expenses.getTotalByPeriod("all-time")
    }
  }

  const totalIncome = getIncomeForPeriod()
  const totalExpenses = getExpensesForPeriod()
  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0

  const getPeriodLabel = () => {
    switch (period) {
      case "weekly":
        return "Weekly"
      case "monthly":
        return "Monthly"
      case "yearly":
        return "Yearly"
      case "all-time":
        return "All Time"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={period} onValueChange={(value) => setPeriod(value as TimePeriod)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="all-time">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{getPeriodLabel()} Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalIncome.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{getPeriodLabel()} Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalExpenses.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{netSavings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{savingsRate.toFixed(1)}% savings rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
