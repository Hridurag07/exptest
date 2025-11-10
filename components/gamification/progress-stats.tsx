"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Flame, Star } from "lucide-react"
import type { UserProgress } from "@/lib/types"

interface ProgressStatsProps {
  progress: UserProgress
}

export function ProgressStats({ progress }: ProgressStatsProps) {
  const pointsToNextLevel = progress.level * 100 - progress.points
  const levelProgress = ((progress.points % 100) / 100) * 100

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Level</p>
              <p className="text-3xl font-bold">{progress.level}</p>
              <p className="text-xs text-muted-foreground mt-1">{pointsToNextLevel} pts to next</p>
            </div>
            <div className="p-3 bg-accent/20 rounded-full">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${levelProgress}%` }} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-chart-1/20 to-chart-1/5 border-chart-1/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Streak</p>
              <p className="text-3xl font-bold">{progress.streak}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {progress.streak === 0 ? "Start today!" : "days in a row"}
              </p>
            </div>
            <div className="p-3 bg-chart-1/20 rounded-full">
              <Flame className="h-6 w-6 text-chart-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-chart-5/20 to-chart-5/5 border-chart-5/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Points</p>
              <p className="text-3xl font-bold">{progress.points}</p>
              <p className="text-xs text-muted-foreground mt-1">{progress.badges.length} badges earned</p>
            </div>
            <div className="p-3 bg-chart-5/20 rounded-full">
              <Star className="h-6 w-6 text-chart-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
