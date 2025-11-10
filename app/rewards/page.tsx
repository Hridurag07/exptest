"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { storage } from "@/lib/storage"
import type { User } from "@/lib/types"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RewardsDisplay } from "@/components/rewards/rewards-display"
import { gamification } from "@/lib/gamification"

export default function RewardsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = storage.getUser()
    if (!currentUser) {
      router.push("/")
    } else {
      setUser(currentUser)
    }
  }, [router])

  if (!user) {
    return null
  }

  const progress = gamification.getProgress()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Your Rewards</h2>
          <RewardsDisplay rewards={progress.rewards || []} />
        </div>
      </main>
    </div>
  )
}
