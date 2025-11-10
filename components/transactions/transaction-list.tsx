"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { expenses } from "@/lib/expenses"
import { income } from "@/lib/income"

type TimePeriod = "weekly" | "monthly" | "yearly" | "all-time"

type Transaction = {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description?: string
  date: string
  frequency?: string
}

export function TransactionList() {
  const [period, setPeriod] = useState<TimePeriod>("monthly")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [sortBy, setSortBy] = useState<"date" | "amount">("date")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [availableCategories, setAvailableCategories] = useState<string[]>([])

  useEffect(() => {
    loadTransactions()
  }, [period, sortBy, filterType, filterCategory])

  const loadTransactions = () => {
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

    const endDate = new Date()

    const expenseList = expenses.getByDateRange(startDate, endDate)
    const incomeList = income.getByDateRange(startDate, endDate)

    const allTransactions: Transaction[] = [
      ...expenseList.map((exp) => ({
        id: exp.id,
        type: "expense" as const,
        amount: exp.amount,
        category: exp.category,
        description: exp.description,
        date: exp.date,
        frequency: exp.isRecurring ? exp.frequency : undefined,
      })),
      ...incomeList.map((inc) => ({
        id: inc.id,
        type: "income" as const,
        amount: inc.amount,
        category: inc.source,
        description: inc.description,
        date: inc.date,
        frequency: inc.frequency !== "one-time" ? inc.frequency : undefined,
      })),
    ]

    const categories = Array.from(new Set(allTransactions.map((t) => t.category))).sort()
    setAvailableCategories(categories)

    let filtered = allTransactions
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType)
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory)
    }

    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else {
      filtered.sort((a, b) => b.amount - a.amount)
    }

    setTransactions(filtered)
  }

  const handleDelete = (id: string, type: "income" | "expense") => {
    if (type === "expense") {
      expenses.delete(id)
    } else {
      income.delete(id)
    }
    loadTransactions()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getPeriodLabel = () => {
    switch (period) {
      case "weekly":
        return "This Week"
      case "monthly":
        return "This Month"
      case "yearly":
        return "This Year"
      case "all-time":
        return "All Time"
    }
  }

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const netAmount = totalIncome - totalExpenses

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₹{totalIncome.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              ₹{totalExpenses.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${netAmount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              ₹{Math.abs(netAmount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{netAmount >= 0 ? "Surplus" : "Deficit"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Transactions - {getPeriodLabel()}</CardTitle>
              <CardDescription>{transactions.length} transactions found</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income Only</SelectItem>
                  <SelectItem value="expense">Expenses Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="amount">Sort by Amount</SelectItem>
                </SelectContent>
              </Select>

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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions found for this period</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={transaction.type === "income" ? "default" : "secondary"}>
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {transaction.type}
                      </Badge>
                      <p className="font-medium">{transaction.category}</p>
                      {transaction.frequency && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {transaction.frequency}
                        </span>
                      )}
                    </div>
                    {transaction.description && (
                      <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p
                      className={`text-lg font-semibold ${transaction.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction.id, transaction.type)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete transaction</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
