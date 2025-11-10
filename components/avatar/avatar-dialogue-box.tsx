"use client"

import { Card, CardContent } from "@/components/ui/card"
import { avatarDialogue } from "@/lib/avatar-dialogue"
import type { UserProgress } from "@/lib/types"
import { AvatarDisplay } from "./avatar-display"
import { useState, useEffect } from "react"

interface AvatarDialogueBoxProps {
  progress: UserProgress
}

export function AvatarDialogueBox({ progress }: AvatarDialogueBoxProps) {
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<
    "greeting" | "spending" | "motivation" | "tip" | "budget" | "progress"
  >("greeting")

  useEffect(() => {
    setMessage(avatarDialogue.getGreeting(progress))

    const messageTypes: Array<"greeting" | "spending" | "motivation" | "tip" | "budget" | "progress"> = [
      "greeting",
      "spending",
      "motivation",
      "tip",
      "budget",
      "progress",
    ]

    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % messageTypes.length
      const nextType = messageTypes[currentIndex]
      setMessageType(nextType)

      switch (nextType) {
        case "greeting":
          setMessage(avatarDialogue.getGreeting(progress))
          break
        case "spending":
          setMessage(avatarDialogue.getSpendingFeedback())
          break
        case "motivation":
          setMessage(avatarDialogue.getMotivationalMessage(progress))
          break
        case "tip":
          setMessage(avatarDialogue.getTip())
          break
        case "budget":
          setMessage(avatarDialogue.getBudgetAdvice())
          break
        case "progress":
          setMessage(avatarDialogue.getProgressEncouragement(progress))
          break
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [progress])

  const getMessageTypeLabel = () => {
    switch (messageType) {
      case "greeting":
        return "Greeting"
      case "spending":
        return "Spending Insight"
      case "motivation":
        return "Motivation"
      case "tip":
        return "Financial Tip"
      case "budget":
        return "Budget Advice"
      case "progress":
        return "Progress Update"
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4 items-start">
          <AvatarDisplay settings={progress.avatarSettings} size="md" />

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {getMessageTypeLabel()}
              </span>
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse delay-75" />
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse delay-150" />
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg relative">
              <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-muted" />
              <p className="text-sm leading-relaxed">{message}</p>
            </div>
            <p className="text-xs text-muted-foreground">Messages update automatically every 8 seconds</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
