"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth"
import { gamification } from "@/lib/gamification"
import type { UserProgress } from "@/lib/types"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AvatarCustomization } from "@/components/avatar/avatar-customization"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CustomizePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [user, setUser] = useState(auth.getCurrentUser())

  useEffect(() => {
    setMounted(true)
    if (!auth.isAuthenticated()) {
      router.push("/")
      return
    }

    loadData()
  }, [router])

  const loadData = () => {
    setProgress(gamification.getProgress())
    setUser(auth.getCurrentUser())
  }

  if (!mounted || !user || !progress) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Customize Avatar</h1>
            <p className="text-muted-foreground">Personalize your financial companion</p>
          </div>
        </div>

        <AvatarCustomization settings={progress.avatarSettings} onUpdate={loadData} />
      </main>
    </div>
  )
}
