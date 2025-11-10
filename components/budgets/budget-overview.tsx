"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddBudgetDialog } from "./add-budget-dialog"
import { BudgetCard } from "./budget-card"
import type { Budget } from "@/lib/types"

interface BudgetOverviewProps {
  budgets: Budget[]
  onBudgetChange: () => void
}

export function BudgetOverview({ budgets: budgetList, onBudgetChange }: BudgetOverviewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Budgets</CardTitle>
          <CardDescription>Track your spending limits</CardDescription>
        </div>
        <AddBudgetDialog onBudgetAdded={onBudgetChange} />
      </CardHeader>
      <CardContent>
        {budgetList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No budgets set yet. Create one to start tracking!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {budgetList.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} onBudgetDeleted={onBudgetChange} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
