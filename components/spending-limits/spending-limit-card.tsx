"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trash2, TrendingDown, TrendingUp, Bell, BellOff, Power } from "lucide-react"
import type { SpendingLimit } from "@/lib/types"
import { spendingLimits } from "@/lib/spending-limits"
import { Badge } from "@/components/ui/badge"

interface SpendingLimitCardProps {
  limit: SpendingLimit
  onLimitChanged: () => void
}

export function SpendingLimitCard({ limit, onLimitChanged }: SpendingLimitCardProps) {
  const status = spendingLimits.getLimitStatus(limit)

  const handleDelete = () => {
    spendingLimits.delete(limit.id)
    onLimitChanged()
  }

  const handleToggle = () => {
    spendingLimits.toggle(limit.id)
    onLimitChanged()
  }

  const getProgressColor = () => {
    if (status.percentage >= 100) return "bg-destructive"
    if (status.percentage >= 90) return "bg-amber-500"
    if (status.percentage >= 75) return "bg-amber-400"
    return "bg-accent"
  }

  const hasNotifications = limit.notifyAt && limit.notifyAt.length > 0

  return (
    <Card className={!limit.enabled ? "opacity-60" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-medium">
            {limit.category === "overall" ? "Overall Spending" : limit.category}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {limit.limitType}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {hasNotifications ? (
            <Bell className="h-3.5 w-3.5 text-accent" title="Notifications enabled" />
          ) : (
            <BellOff className="h-3.5 w-3.5 text-muted-foreground" title="Notifications disabled" />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="h-7 w-7"
            title={limit.enabled ? "Disable limit" : "Enable limit"}
          >
            <Power className={`h-3.5 w-3.5 ${limit.enabled ? "text-accent" : "text-muted-foreground"}`} />
            <span className="sr-only">{limit.enabled ? "Disable" : "Enable"} limit</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete} className="h-7 w-7">
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            <span className="sr-only">Delete limit</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-2xl font-bold">₹{status.spent.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">of ₹{limit.amount.toFixed(0)}</p>
          </div>
          <div className="text-right">
            {status.isOverLimit ? (
              <div className="flex items-center gap-1 text-destructive">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Over limit</span>
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

        {hasNotifications && limit.notifyAt && limit.notifyAt.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Alerts at: {limit.notifyAt.sort((a, b) => a - b).join("%, ")}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
