"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth"
import { storage } from "@/lib/storage"
import { gamification } from "@/lib/gamification"
import type { Expense, Budget, Objective, UserProgress, Income, SpendingLimit } from "@/lib/types"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog"
import { ExpenseList } from "@/components/expenses/expense-list"
import { BudgetOverview } from "@/components/budgets/budget-overview"
import { ProgressStats } from "@/components/gamification/progress-stats"
import { ObjectivesList } from "@/components/gamification/objectives-list"
import { BadgesDisplay } from "@/components/gamification/badges-display"
import { AddIncomeDialog } from "@/components/income/add-income-dialog"
import { IncomeOverview } from "@/components/income/income-overview"
import { RewardsDisplay } from "@/components/rewards/rewards-display"
import { AvatarDialogueBox } from "@/components/avatar/avatar-dialogue-box"
import { SpendingLimitsOverview } from "@/components/spending-limits/spending-limits-overview"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [user, setUser] = useState(auth.getCurrentUser())
  const [incomes, setIncomes] = useState<Income[]>([])
  const [spendingLimits, setSpendingLimits] = useState<SpendingLimit[]>([])

  const [budgetsOpen, setBudgetsOpen] = useState(true)
  const [spendingLimitsOpen, setSpendingLimitsOpen] = useState(true)
  const [objectivesOpen, setObjectivesOpen] = useState(true)
  const [achievementsOpen, setAchievementsOpen] = useState(false)
  const [rewardsOpen, setRewardsOpen] = useState(true)

  useEffect(() => {
    setMounted(true)
    if (!auth.isAuthenticated()) {
      router.push("/")
      return
    }

    loadData()
  }, [router])

  const loadData = () => {
    setExpenses(storage.getExpenses())
    setBudgets(storage.getBudgets())
    setObjectives(storage.getObjectives())
    setProgress(gamification.getProgress())
    setUser(auth.getCurrentUser())
    setIncomes(storage.getIncome())
    setSpendingLimits(storage.getSpendingLimits())
  }

  const handleExpenseAdded = () => {
    gamification.onExpenseLogged()
    loadData()
  }

  const handleExpenseDeleted = () => {
    loadData()
  }

  const handleBudgetChange = () => {
    loadData()
  }

  const handleIncomeAdded = () => {
    loadData()
  }

  const handleSpendingLimitChange = () => {
    loadData()
  }

  if (!mounted || !user || !progress) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Progress Stats */}
        <section>
          <ProgressStats progress={progress} />
        </section>

        {/* Avatar Dialogue */}
        <section>
          <AvatarDialogueBox progress={progress} />
        </section>

        {/* Financial Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Financial Overview</h2>
          <IncomeOverview />
        </section>

        {/* Quick Actions */}
        <section className="flex justify-center gap-4">
          <AddExpenseDialog onExpenseAdded={handleExpenseAdded} />
          <AddIncomeDialog onIncomeAdded={handleIncomeAdded} />
        </section>

        {/* Rewards Section */}
        <section>
          <Collapsible open={rewardsOpen} onOpenChange={setRewardsOpen}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Rewards</h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ChevronDown className={`h-4 w-4 transition-transform ${rewardsOpen ? "rotate-180" : ""}`} />
                  {rewardsOpen ? "Collapse" : "Expand"}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <RewardsDisplay rewards={progress.rewards} />
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* Spending Limits Section */}
        <section>
          <Collapsible open={spendingLimitsOpen} onOpenChange={setSpendingLimitsOpen}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Spending Limits</h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ChevronDown className={`h-4 w-4 transition-transform ${spendingLimitsOpen ? "rotate-180" : ""}`} />
                  {spendingLimitsOpen ? "Collapse" : "Expand"}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <SpendingLimitsOverview limits={spendingLimits} onLimitChange={handleSpendingLimitChange} />
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* Budgets Section */}
        <section>
          <Collapsible open={budgetsOpen} onOpenChange={setBudgetsOpen}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Budgets</h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ChevronDown className={`h-4 w-4 transition-transform ${budgetsOpen ? "rotate-180" : ""}`} />
                  {budgetsOpen ? "Collapse" : "Expand"}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <BudgetOverview budgets={budgets} onBudgetChange={handleBudgetChange} />
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* Objectives Section */}
        <section>
          <Collapsible open={objectivesOpen} onOpenChange={setObjectivesOpen}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Objectives</h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ChevronDown className={`h-4 w-4 transition-transform ${objectivesOpen ? "rotate-180" : ""}`} />
                  {objectivesOpen ? "Collapse" : "Expand"}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <ObjectivesList objectives={objectives} />
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* Achievements Section */}
        <section>
          <Collapsible open={achievementsOpen} onOpenChange={setAchievementsOpen}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Achievements</h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ChevronDown className={`h-4 w-4 transition-transform ${achievementsOpen ? "rotate-180" : ""}`} />
                  {achievementsOpen ? "Collapse" : "Expand"}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <BadgesDisplay badges={progress.badges} />
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* Recent Expenses */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Expenses</h2>
          <ExpenseList expenses={expenses.slice(-10).reverse()} onExpenseDeleted={handleExpenseDeleted} />
        </section>
      </main>
    </div>
  )
}
