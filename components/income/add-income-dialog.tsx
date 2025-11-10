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
import { Textarea } from "@/components/ui/textarea"
import { TrendingUp } from "lucide-react"
import { INCOME_SOURCES } from "@/lib/income-sources"
import { income } from "@/lib/income"
import type { IncomeFrequency } from "@/lib/types"

interface AddIncomeDialogProps {
  onIncomeAdded: () => void
}

export function AddIncomeDialog({ onIncomeAdded }: AddIncomeDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [source, setSource] = useState("")
  const [frequency, setFrequency] = useState<IncomeFrequency>("monthly")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !source) return

    income.add(Number.parseFloat(amount), source, frequency, description || undefined)

    // Reset form
    setAmount("")
    setSource("")
    setFrequency("monthly")
    setDescription("")
    setOpen(false)

    onIncomeAdded()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="gap-2 bg-transparent">
          <TrendingUp className="h-5 w-5" />
          Add Income
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
          <DialogDescription>Track your earnings and see your net savings</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income-amount">Amount (₹)</Label>
            <Input
              id="income-amount"
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
            <Label htmlFor="source">Source</Label>
            <Select value={source} onValueChange={setSource} required>
              <SelectTrigger id="source">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {INCOME_SOURCES.map((src) => (
                  <SelectItem key={src} value={src}>
                    {src}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-frequency">Frequency</Label>
            <Select value={frequency} onValueChange={(value) => setFrequency(value as IncomeFrequency)} required>
              <SelectTrigger id="income-frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-description">Description (Optional)</Label>
            <Textarea
              id="income-description"
              placeholder="Add notes about this income..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Income
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
