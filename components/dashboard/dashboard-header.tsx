"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Palette } from "lucide-react"
import { auth } from "@/lib/auth"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/lib/types"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { notifications } from "@/lib/notifications"
import { useEffect } from "react"
import Link from "next/link"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    notifications.requestPermission()
  }, [])

  const handleLogout = () => {
    auth.logout()
    // Use window.location to force a full page reload
    window.location.href = "/"
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/transactions", label: "Transactions" },
    { href: "/objectives", label: "Objectives" },
    { href: "/rewards", label: "Rewards" },
  ]

  if (auth.isAdmin()) {
    navLinks.push({ href: "/admin", label: "Admin" })
  }

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-balance">Expense Tracker</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user.name}!</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/customize">
              <Button variant="ghost" size="icon" title="Customize Avatar">
                <Palette className="h-5 w-5" />
                <span className="sr-only">Customize Avatar</span>
              </Button>
            </Link>
            <ThemeToggle />
            <NotificationCenter />
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button variant={pathname === link.href ? "default" : "ghost"} size="sm" className="whitespace-nowrap">
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
