"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import type { SpendingLimit } from "@/lib/types"
import { AddSpendingLimitDialog } from "./add-spending-limit-dialog"
import { SpendingLimitCard } from "./spending-limit-card"
import { AlertCircle } from "lucide-react"

interface SpendingLimitsOverviewProps {
  limits: SpendingLimit[]
  onLimitChange: () => void
}

export function SpendingLimitsOverview({ limits, onLimitChange }: SpendingLimitsOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Spending Limits</h3>
          <p className="text-sm text-muted-foreground">Set limits and get notified before you overspend</p>
        </div>
        <AddSpendingLimitDialog onLimitAdded={onLimitChange} />
      </div>

      {limits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-lg mb-2">No spending limits set</CardTitle>
            <CardDescription className="text-center max-w-sm">
              Create spending limits to track your expenses and receive notifications when you're approaching your
              limits
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {limits.map((limit) => (
            <SpendingLimitCard key={limit.id} limit={limit} onLimitChanged={onLimitChange} />
          ))}
        </div>
      )}
    </div>
  )
}
