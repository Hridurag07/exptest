"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trash2, TrendingDown, TrendingUp, Bell, BellOff } from "lucide-react"
import type { Budget } from "@/lib/types"
import { budgets } from "@/lib/budgets"

interface BudgetCardProps {
  budget: Budget
  onBudgetDeleted: () => void
}

export function BudgetCard({ budget, onBudgetDeleted }: BudgetCardProps) {
  const status = budgets.getBudgetStatus(budget)

  const handleDelete = () => {
    budgets.delete(budget.id)
    onBudgetDeleted()
  }

  const getProgressColor = () => {
    if (status.percentage >= 100) return "bg-destructive"
    if (status.percentage >= 80) return "bg-amber-500"
    return "bg-accent"
  }

  const hasNotifications = budget.notificationThresholds && budget.notificationThresholds.length > 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          {budget.category === "overall" ? "Overall Budget" : budget.category}
        </CardTitle>
        <div className="flex items-center gap-2">
          {hasNotifications ? (
            <Bell className="h-3.5 w-3.5 text-accent" title="Notifications enabled" />
          ) : (
            <BellOff className="h-3.5 w-3.5 text-muted-foreground" title="Notifications disabled" />
          )}
          <span className="text-xs text-muted-foreground capitalize">{budget.period}</span>
          <Button variant="ghost" size="icon" onClick={handleDelete} className="h-7 w-7">
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            <span className="sr-only">Delete budget</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-2xl font-bold">₹{status.spent.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">of ₹{budget.amount.toFixed(0)}</p>
          </div>
          <div className="text-right">
            {status.isOverBudget ? (
              <div className="flex items-center gap-1 text-destructive">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Over budget</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-accent">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">₹{status.remaining.toFixed(0)} left</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <Progress value={status.percentage} className="h-2" indicatorClassName={getProgressColor()} />
          <p className="text-xs text-muted-foreground text-right">{status.percentage.toFixed(0)}% used</p>
        </div>

        {hasNotifications && budget.notificationThresholds && budget.notificationThresholds.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Alerts at: {budget.notificationThresholds.sort((a, b) => a - b).join("%, ")}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
