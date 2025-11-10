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
import { budgets } from "@/lib/budgets"
import { Switch } from "@/components/ui/switch"

interface AddBudgetDialogProps {
  onBudgetAdded: () => void
}

export function AddBudgetDialog({ onBudgetAdded }: AddBudgetDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<string>("overall")
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly")
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [threshold50, setThreshold50] = useState(false)
  const [threshold80, setThreshold80] = useState(true)
  const [threshold90, setThreshold90] = useState(true)
  const [threshold100, setThreshold100] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount) return

    const thresholds: number[] = []
    if (enableNotifications) {
      if (threshold50) thresholds.push(50)
      if (threshold80) thresholds.push(80)
      if (threshold90) thresholds.push(90)
      if (threshold100) thresholds.push(100)
    }

    budgets.add(category, Number.parseFloat(amount), period, thresholds.length > 0 ? thresholds : undefined)

    // Reset form
    setAmount("")
    setCategory("overall")
    setPeriod("monthly")
    setEnableNotifications(true)
    setThreshold50(false)
    setThreshold80(true)
    setThreshold90(true)
    setThreshold100(true)
    setOpen(false)

    onBudgetAdded()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Add Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Budget</DialogTitle>
          <DialogDescription>Create a spending limit to help you stay on track</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget-amount">Budget Amount (₹)</Label>
            <Input
              id="budget-amount"
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
            <Label htmlFor="budget-category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="budget-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall Budget</SelectItem>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget-period">Period</Label>
            <Select value={period} onValueChange={(value) => setPeriod(value as "weekly" | "monthly")} required>
              <SelectTrigger id="budget-period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
                  Budget Alerts
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
                    50% of budget
                  </Label>
                  <Switch id="threshold-50" checked={threshold50} onCheckedChange={setThreshold50} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold-80" className="text-sm font-normal cursor-pointer">
                    80% of budget
                  </Label>
                  <Switch id="threshold-80" checked={threshold80} onCheckedChange={setThreshold80} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold-90" className="text-sm font-normal cursor-pointer">
                    90% of budget
                  </Label>
                  <Switch id="threshold-90" checked={threshold90} onCheckedChange={setThreshold90} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold-100" className="text-sm font-normal cursor-pointer">
                    100% of budget (exceeded)
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
              Set Budget
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
