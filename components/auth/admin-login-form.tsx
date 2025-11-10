"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { Shield } from "lucide-react"

interface AdminLoginFormProps {
  onSuccess: () => void
  onSwitchToUser: () => void
}

export function AdminLoginForm({ onSuccess, onSwitchToUser }: AdminLoginFormProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const user = await auth.loginAsAdmin()
      if (pin === "0487" && user) {
        onSuccess()
      } else {
        setError("Invalid admin PIN. Please try again.")
      }
    } catch (err) {
      setError("Admin login failed. Please try again.")
      console.error("[v0] Admin login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-primary/50">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Admin Access</CardTitle>
        </div>
        <CardDescription>Enter admin PIN to access with full privileges</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">Admin PIN</Label>
            <Input
              id="pin"
              type="password"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              required
              disabled={loading}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Accessing..." : "Access Admin Panel"}
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={onSwitchToUser} disabled={loading}>
            Back to User Login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
