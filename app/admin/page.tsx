"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { storage } from "@/lib/storage"
import type { User } from "@/lib/types"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Unlock, Lock } from "lucide-react"
import { gamification } from "@/lib/gamification"
import { DEFAULT_COSMETICS } from "@/lib/avatar-cosmetics"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const currentUser = storage.getUser()
    if (!currentUser) {
      router.push("/")
    } else {
      setUser(currentUser)
      setIsAdmin(storage.getAdminSession())
    }
  }, [router])

  const handleLogin = () => {
    if (pin === "0487") {
      storage.setAdminSession(true)
      setIsAdmin(true)
      setError("")
      setPin("")
    } else {
      setError("Incorrect PIN")
    }
  }

  const handleLogout = () => {
    storage.setAdminSession(false)
    setIsAdmin(false)
  }

  const handleUnlockAll = () => {
    const progress = gamification.getProgress()

    // Unlock all levels
    progress.level = 50
    progress.points = 50000

    // Unlock all avatar cosmetics
    progress.avatarSettings.cosmetics = DEFAULT_COSMETICS.map((cosmetic) => ({
      ...cosmetic,
      unlocked: true,
      unlockedAt: new Date().toISOString(),
    }))

    // Add all possible badges
    const allBadges = [
      {
        id: "welcome",
        name: "Welcome Bonus",
        description: "Started your journey",
        icon: "🎉",
        earnedAt: new Date().toISOString(),
      },
      {
        id: "first-expense",
        name: "First Expense",
        description: "Tracked your first expense",
        icon: "💰",
        earnedAt: new Date().toISOString(),
      },
      {
        id: "budget-master",
        name: "Budget Master",
        description: "Set your first budget",
        icon: "📊",
        earnedAt: new Date().toISOString(),
      },
      {
        id: "goal-setter",
        name: "Goal Setter",
        description: "Created your first objective",
        icon: "🎯",
        earnedAt: new Date().toISOString(),
      },
      {
        id: "streak-3",
        name: "3-Day Streak",
        description: "Logged expenses for 3 days",
        icon: "🔥",
        earnedAt: new Date().toISOString(),
      },
      {
        id: "streak-7",
        name: "Week Warrior",
        description: "7-day logging streak",
        icon: "⚡",
        earnedAt: new Date().toISOString(),
      },
      {
        id: "streak-30",
        name: "Monthly Master",
        description: "30-day logging streak",
        icon: "👑",
        earnedAt: new Date().toISOString(),
      },
      {
        id: "century-club",
        name: "Century Club",
        description: "Logged 100 expenses",
        icon: "💯",
        earnedAt: new Date().toISOString(),
      },
      {
        id: "month-master",
        name: "Month Master",
        description: "Completed all monthly objectives",
        icon: "🏅",
        earnedAt: new Date().toISOString(),
      },
      { id: "saver-100", name: "Saver", description: "Saved $100", icon: "💎", earnedAt: new Date().toISOString() },
      {
        id: "saver-500",
        name: "Super Saver",
        description: "Saved $500",
        icon: "💍",
        earnedAt: new Date().toISOString(),
      },
      {
        id: "saver-1000",
        name: "Savings Champion",
        description: "Saved $1000",
        icon: "🏆",
        earnedAt: new Date().toISOString(),
      },
    ]

    progress.badges = allBadges

    // Add all rewards
    const allRewards = [
      {
        id: "reward-1",
        type: "gift-card" as const,
        name: "Amazon Gift Card",
        value: 10,
        provider: "Amazon",
        earnedAt: new Date().toISOString(),
        claimed: false,
        reason: "Admin unlock",
      },
      {
        id: "reward-2",
        type: "gift-card" as const,
        name: "Starbucks Gift Card",
        value: 5,
        provider: "Starbucks",
        earnedAt: new Date().toISOString(),
        claimed: false,
        reason: "Admin unlock",
      },
      {
        id: "reward-3",
        type: "gift-card" as const,
        name: "Netflix Gift Card",
        value: 25,
        provider: "Netflix",
        earnedAt: new Date().toISOString(),
        claimed: false,
        reason: "Admin unlock",
      },
    ]

    progress.rewards = allRewards
    storage.setProgress(progress)

    alert("All features unlocked! Level 50 achieved with all rewards, badges, and avatar cosmetics.")
    window.location.reload()
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Admin Panel</CardTitle>
                  <CardDescription>Manage system settings and unlock features</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isAdmin ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Lock className="h-5 w-5" />
                    <p>Admin access required</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pin">Enter Admin PIN</Label>
                    <div className="flex gap-2">
                      <Input
                        id="pin"
                        type="password"
                        placeholder="Enter PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        maxLength={4}
                      />
                      <Button onClick={handleLogin}>Login</Button>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Unlock className="h-5 w-5" />
                    <p className="font-medium">Admin access granted</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <h3 className="font-semibold">Admin Actions</h3>
                    <Button onClick={handleUnlockAll} className="w-full" size="lg">
                      Unlock All Features
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      This will unlock all levels, rewards, badges, and avatar cosmetics instantly.
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent">
                      Logout from Admin
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
