"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Plus, Bell } from "lucide-react"
import { EXPENSE_CATEGORIES } from "@/lib/categories"
import { spendingLimits } from "@/lib/spending-limits"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface AddSpendingLimitDialogProps {
  onLimitAdded: () => void
}

export function AddSpendingLimitDialog({ onLimitAdded }: AddSpendingLimitDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<string>("overall")
  const [limitType, setLimitType] = useState<"daily" | "weekly" | "monthly">("daily")
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [threshold50, setThreshold50] = useState(false)
  const [threshold75, setThreshold75] = useState(true)
  const [threshold80, setThreshold80] = useState(true)
  const [threshold90, setThreshold90] = useState(true)
  const [threshold100, setThreshold100] = useState(true)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount) return

    const thresholds: number[] = []
    if (enableNotifications) {
      if (threshold50) thresholds.push(50)
      if (threshold75) thresholds.push(75)
      if (threshold80) thresholds.push(80)
      if (threshold90) thresholds.push(90)
      if (threshold100) thresholds.push(100)
    }

    spendingLimits.add(category, limitType, Number.parseFloat(amount), thresholds.length > 0 ? thresholds : [])

    toast({
      title: "Spending limit set",
      description: `${limitType.charAt(0).toUpperCase() + limitType.slice(1)} limit of ₹${amount} created for ${category === "overall" ? "all categories" : category}`,
    })

    // Reset form
    setAmount("")
    setCategory("overall")
    setLimitType("daily")
    setEnableNotifications(true)
    setThreshold50(false)
    setThreshold75(true)
    setThreshold80(true)
    setThreshold90(true)
    setThreshold100(true)
    setOpen(false)

    onLimitAdded()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Add Spending Limit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Spending Limit</DialogTitle>
          <DialogDescription>
            Create a spending limit and get notified when you're close to exceeding it
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="limit-amount">Limit Amount (₹)</Label>
            <Input
              id="limit-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit-category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="limit-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">All Categories</SelectItem>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit-type">Time Period</Label>
            <Select
              value={limitType}
              onValueChange={(value) => setLimitType(value as "daily" | "weekly" | "monthly")}
              required
            >
              <SelectTrigger id="limit-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="enable-notifications" className="cursor-pointer">
                  Spending Alerts
                </Label>
              </div>
              <Switch
                id="enable-notifications"
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
              />
            </div>

            {enableNotifications && (
              <div className="space-y-2 pl-6">
                <p className="text-xs text-muted-foreground mb-3">Get notified when you reach:</p>

                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold-50" className="text-sm font-normal cursor-pointer">
                    50% of limit
                  </Label>
                  <Switch id="threshold-50" checked={threshold50} onCheckedChange={setThreshold50} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold-75" className="text-sm font-normal cursor-pointer">
                    75% of limit
                  </Label>
                  <Switch id="threshold-75" checked={threshold75} onCheckedChange={setThreshold75} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold-80" className="text-sm font-normal cursor-pointer">
                    80% of limit
                  </Label>
                  <Switch id="threshold-80" checked={threshold80} onCheckedChange={setThreshold80} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold-90" className="text-sm font-normal cursor-pointer">
                    90% of limit
                  </Label>
                  <Switch id="threshold-90" checked={threshold90} onCheckedChange={setThreshold90} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold-100" className="text-sm font-normal cursor-pointer">
                    100% of limit (exceeded)
                  </Label>
                  <Switch id="threshold-100" checked={threshold100} onCheckedChange={setThreshold100} />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Set Limit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
