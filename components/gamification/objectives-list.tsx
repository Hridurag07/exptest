"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Calendar, CalendarDays, CalendarRange, Plus } from "lucide-react"
import type { Objective } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { storage } from "@/lib/storage"

interface ObjectivesListProps {
  objectives: Objective[]
}

export function ObjectivesList({ objectives }: ObjectivesListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newObjective, setNewObjective] = useState({
    type: "daily" as "daily" | "weekly" | "monthly",
    title: "",
    description: "",
    target: 1,
    points: 10,
  })

  const getObjectivesByType = (type: "daily" | "weekly" | "monthly") => {
    return objectives.filter((obj) => obj.type === type)
  }

  const getTypeIcon = (type: "daily" | "weekly" | "monthly") => {
    switch (type) {
      case "daily":
        return <Calendar className="h-4 w-4" />
      case "weekly":
        return <CalendarDays className="h-4 w-4" />
      case "monthly":
        return <CalendarRange className="h-4 w-4" />
    }
  }

  const handleAddObjective = () => {
    if (!newObjective.title || !newObjective.description) {
      alert("Please fill in all fields")
      return
    }

    const objective: Objective = {
      id: crypto.randomUUID(),
      type: newObjective.type,
      title: newObjective.title,
      description: newObjective.description,
      target: newObjective.target,
      current: 0,
      completed: false,
      points: newObjective.points,
    }

    const currentObjectives = storage.getObjectives()
    storage.setObjectives([...currentObjectives, objective])

    setNewObjective({
      type: "daily",
      title: "",
      description: "",
      target: 1,
      points: 10,
    })
    setIsAddDialogOpen(false)
    window.location.reload()
  }

  const ObjectiveItem = ({ objective }: { objective: Objective }) => {
    const progress = objective.target > 0 ? (objective.current / objective.target) * 100 : 0

    return (
      <div className="space-y-2 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1">
            {objective.completed ? (
              <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`font-medium ${objective.completed ? "text-muted-foreground line-through" : ""}`}>
                  {objective.title}
                </p>
                <Badge variant="outline" className="text-xs gap-1">
                  {getTypeIcon(objective.type)}
                  {objective.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-medium text-accent">+{objective.points} pts</p>
          </div>
        </div>
        {!objective.completed && (
          <div className="space-y-1 pl-8">
            <Progress value={progress} className="h-1.5" />
            <p className="text-xs text-muted-foreground">
              {objective.current} / {objective.target} {progress >= 50 ? `(${progress.toFixed(0)}%)` : ""}
            </p>
          </div>
        )}
        {objective.completed && (
          <div className="pl-8">
            <p className="text-xs text-accent font-medium">Completed! Points awarded</p>
          </div>
        )}
      </div>
    )
  }

  const dailyObjectives = getObjectivesByType("daily")
  const weeklyObjectives = getObjectivesByType("weekly")
  const monthlyObjectives = getObjectivesByType("monthly")

  const totalObjectives = objectives.length
  const completedObjectives = objectives.filter((obj) => obj.completed).length
  const completionRate = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Objectives</CardTitle>
            <CardDescription>Complete goals to earn points and level up</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={completionRate === 100 ? "default" : "secondary"} className="text-sm">
              {completedObjectives}/{totalObjectives} Complete
            </Badge>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Objective
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Custom Objective</DialogTitle>
                  <DialogDescription>Set your own financial goals and track your progress</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newObjective.type}
                      onValueChange={(value) =>
                        setNewObjective({ ...newObjective, type: value as "daily" | "weekly" | "monthly" })
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Save for vacation"
                      value={newObjective.title}
                      onChange={(e) => setNewObjective({ ...newObjective, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="e.g., Set aside money for summer trip"
                      value={newObjective.description}
                      onChange={(e) => setNewObjective({ ...newObjective, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="target">Target</Label>
                      <Input
                        id="target"
                        type="number"
                        min="1"
                        value={newObjective.target}
                        onChange={(e) => setNewObjective({ ...newObjective, target: Number(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="points">Points Reward</Label>
                      <Input
                        id="points"
                        type="number"
                        min="1"
                        value={newObjective.points}
                        onChange={(e) => setNewObjective({ ...newObjective, points: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <Button onClick={handleAddObjective} className="w-full">
                    Create Objective
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {dailyObjectives.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Daily
              </h3>
              <span className="text-xs text-muted-foreground">
                {dailyObjectives.filter((obj) => obj.completed).length}/{dailyObjectives.length}
              </span>
            </div>
            {dailyObjectives.map((obj) => (
              <ObjectiveItem key={obj.id} objective={obj} />
            ))}
          </div>
        )}

        {weeklyObjectives.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Weekly
              </h3>
              <span className="text-xs text-muted-foreground">
                {weeklyObjectives.filter((obj) => obj.completed).length}/{weeklyObjectives.length}
              </span>
            </div>
            {weeklyObjectives.map((obj) => (
              <ObjectiveItem key={obj.id} objective={obj} />
            ))}
          </div>
        )}

        {monthlyObjectives.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <CalendarRange className="h-4 w-4" />
                Monthly
              </h3>
              <span className="text-xs text-muted-foreground">
                {monthlyObjectives.filter((obj) => obj.completed).length}/{monthlyObjectives.length}
              </span>
            </div>
            {monthlyObjectives.map((obj) => (
              <ObjectiveItem key={obj.id} objective={obj} />
            ))}
          </div>
        )}

        {completionRate === 100 && (
          <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg text-center">
            <p className="text-sm font-medium text-accent">
              All objectives completed! You're crushing your financial goals!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
