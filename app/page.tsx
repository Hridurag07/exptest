"use client"

import { useEffect, useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { AdminLoginForm } from "@/components/auth/admin-login-form"
import { auth } from "@/lib/auth"
import { Coffee } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Check if user is already authenticated
    if (auth.isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [router])

  const handleAuthSuccess = () => {
    router.push("/dashboard")
  }

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-2xl">
              <Coffee className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-balance">Expense Tracker</h1>
          <p className="text-muted-foreground text-pretty">
            Track your spending, achieve your goals, and level up your financial game
          </p>
        </div>

        {isAdminLogin ? (
          <AdminLoginForm onSuccess={handleAuthSuccess} onSwitchToUser={() => setIsAdminLogin(false)} />
        ) : isLogin ? (
          <LoginForm onSuccess={handleAuthSuccess} onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSuccess={handleAuthSuccess} onSwitchToLogin={() => setIsLogin(true)} />
        )}

        {!isAdminLogin && (
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsAdminLogin(true)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Admin Login
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
