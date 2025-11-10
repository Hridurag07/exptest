"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Check, Flame, Star, Target, Trophy } from "lucide-react"
import type { Badge } from "@/lib/types"

interface BadgesDisplayProps {
  badges: Badge[]
}

export function BadgesDisplay({ badges }: BadgesDisplayProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "trophy":
        return <Trophy className="h-6 w-6" />
      case "flame":
        return <Flame className="h-6 w-6" />
      case "star":
        return <Star className="h-6 w-6" />
      case "check":
        return <Check className="h-6 w-6" />
      case "target":
        return <Target className="h-6 w-6" />
      case "award":
        return <Award className="h-6 w-6" />
      default:
        return <Award className="h-6 w-6" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>Badges you've earned on your journey</CardDescription>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No badges yet. Keep tracking to earn your first achievement!</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 p-4 rounded-lg border bg-gradient-to-br from-accent/10 to-transparent"
              >
                <div className="p-2 bg-accent/20 rounded-full text-accent">{getIcon(badge.icon)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{badge.name}</p>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                  {badge.earnedAt && (
                    <p className="text-xs text-muted-foreground mt-1">Earned {formatDate(badge.earnedAt)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
