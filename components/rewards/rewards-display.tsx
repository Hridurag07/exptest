"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Check } from "lucide-react"
import type { Reward } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface RewardsDisplayProps {
  rewards: Reward[]
}

export function RewardsDisplay({ rewards }: RewardsDisplayProps) {
  if (!rewards || rewards.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Gift className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No rewards earned yet</p>
            <p className="text-sm mt-1">Keep leveling up and completing achievements to earn gift cards!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rewards.map((reward) => (
        <Card key={reward.id} className={reward.claimed ? "opacity-60" : ""}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{reward.name}</CardTitle>
              </div>
              {reward.claimed && (
                <Badge variant="secondary" className="gap-1">
                  <Check className="h-3 w-3" />
                  Claimed
                </Badge>
              )}
            </div>
            <CardDescription>{reward.reason}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">₹{reward.value}</span>
              <span className="text-sm text-muted-foreground">value</span>
            </div>

            {reward.code && !reward.claimed && (
              <div className="space-y-2">
                <div className="p-3 bg-muted rounded-lg font-mono text-sm">{reward.code}</div>
                <p className="text-xs text-muted-foreground">Use this code at {reward.provider}</p>
              </div>
            )}

            <p className="text-xs text-muted-foreground">Earned {new Date(reward.earnedAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
