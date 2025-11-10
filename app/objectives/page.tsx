"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { storage } from "@/lib/storage"
import type { User } from "@/lib/types"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ObjectivesList } from "@/components/gamification/objectives-list"

export default function ObjectivesPage() {
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

  const objectives = storage.getObjectives()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Your Objectives</h2>
          <ObjectivesList objectives={objectives} />
        </div>
      </main>
    </div>
  )
}
