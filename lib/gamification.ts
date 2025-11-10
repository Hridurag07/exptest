import { storage } from "./storage"
import type { UserProgress, Badge } from "./types"
import { expenses } from "./expenses"
import { budgets } from "./budgets"
import { rewards } from "./rewards"
import { DEFAULT_COSMETICS, checkUnlockedCosmetics } from "./avatar-cosmetics"

export const gamification = {
  getProgress: (): UserProgress => {
    const progress = storage.getProgress()
    if (!progress) {
      const initial: UserProgress = {
        points: 0,
        level: 1,
        xp: 0,
        streak: 0,
        lastLogDate: null,
        badges: [],
        rewards: [],
        avatarSettings: {
          selectedFace: "face-male-1",
          selectedOutfit: "outfit-casual",
          selectedShoes: "shoes-sneakers",
          selectedHeaddress: "headdress-none",
          selectedBackground: "bg-simple",
          cosmetics: DEFAULT_COSMETICS,
        },
      }
      storage.setProgress(initial)
      return initial
    }

    if (!progress.rewards) {
      progress.rewards = []
    }

    if (!progress.avatarSettings || !progress.avatarSettings.selectedFace) {
      progress.avatarSettings = {
        selectedFace: "face-male-1",
        selectedOutfit: "outfit-casual",
        selectedShoes: "shoes-sneakers",
        selectedHeaddress: "headdress-none",
        selectedBackground: "bg-simple",
        cosmetics: DEFAULT_COSMETICS,
      }
      storage.setProgress(progress)
    }

    return progress
  },

  addPoints: (points: number): void => {
    const progress = gamification.getProgress()
    progress.points += points

    // Level up logic: every 100 points = 1 level
    const newLevel = Math.floor(progress.points / 100) + 1
    if (newLevel > progress.level) {
      const oldLevel = progress.level
      progress.level = newLevel

      // Award level-up badge
      gamification.awardBadge({
        id: crypto.randomUUID(),
        name: `Level ${newLevel}`,
        description: `Reached level ${newLevel}`,
        icon: "trophy",
      })

      const badgeNames = progress.badges.map((b) => b.name)
      progress.avatarSettings.cosmetics = checkUnlockedCosmetics(newLevel, badgeNames)

      const reward = rewards.getRewardForLevel(newLevel)
      if (reward) {
        progress.rewards.push(reward)
      }
    }

    storage.setProgress(progress)
  },

  updateStreak: (): void => {
    const progress = gamification.getProgress()
    const today = new Date().toDateString()
    const lastLog = progress.lastLogDate ? new Date(progress.lastLogDate).toDateString() : null

    if (lastLog === today) {
      // Already logged today
      return
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()

    if (lastLog === yesterdayStr) {
      // Continuing streak
      progress.streak += 1
    } else if (lastLog !== today) {
      // Streak broken or starting new
      progress.streak = 1
    }

    progress.lastLogDate = new Date().toISOString()

    // Award streak badges
    if (progress.streak === 7) {
      gamification.awardBadge({
        id: crypto.randomUUID(),
        name: "Week Warrior",
        description: "7-day logging streak",
        icon: "flame",
      })
    } else if (progress.streak === 30) {
      gamification.awardBadge({
        id: crypto.randomUUID(),
        name: "Month Master",
        description: "30-day logging streak",
        icon: "star",
      })

      const reward = rewards.getRewardForAchievement("Month Master", progress.level)
      if (reward) {
        progress.rewards.push(reward)
      }
    }

    storage.setProgress(progress)
  },

  awardBadge: (badge: Badge): void => {
    const progress = gamification.getProgress()

    // Check if badge already exists
    const exists = progress.badges.some((b) => b.name === badge.name)
    if (exists) return

    progress.badges.push({
      ...badge,
      earnedAt: new Date().toISOString(),
    })

    const badgeNames = progress.badges.map((b) => b.name)
    progress.avatarSettings.cosmetics = checkUnlockedCosmetics(progress.level, badgeNames)

    storage.setProgress(progress)
  },

  checkAndUpdateObjectives: (): void => {
    const objectives = storage.getObjectives()
    const allExpenses = expenses.getAll()
    const allBudgets = budgets.getAll()
    let objectivesCompleted = false

    objectives.forEach((objective) => {
      if (objective.completed) return

      const wasIncomplete = !objective.completed

      switch (objective.type) {
        case "daily": {
          // Check if logged at least one expense today
          const today = new Date().toDateString()
          const todayExpenses = allExpenses.filter((e) => new Date(e.date).toDateString() === today)
          objective.current = todayExpenses.length
          if (objective.current >= objective.target && wasIncomplete) {
            objective.completed = true
            gamification.addPoints(objective.points)
            objectivesCompleted = true
          }
          break
        }

        case "weekly": {
          // Check if within 80% of weekly budget
          const weeklyBudget = allBudgets.find((b) => b.period === "weekly" && b.category === "overall")
          if (weeklyBudget) {
            const status = budgets.getBudgetStatus(weeklyBudget)
            objective.current = Math.round(status.percentage)
            if (status.percentage <= objective.target && wasIncomplete) {
              objective.completed = true
              gamification.addPoints(objective.points)
              objectivesCompleted = true
            }
          } else {
            // If no weekly budget exists, check if user has logged expenses consistently
            const now = new Date()
            const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
            const weekExpenses = allExpenses.filter((e) => new Date(e.date) >= startOfWeek)
            const uniqueDays = new Set(weekExpenses.map((e) => new Date(e.date).toDateString()))
            objective.current = uniqueDays.size
            if (uniqueDays.size >= 5 && wasIncomplete) {
              objective.completed = true
              gamification.addPoints(objective.points)
              objectivesCompleted = true
            }
          }
          break
        }

        case "monthly": {
          // Check if logged for 25 out of 30 days this month
          const now = new Date()
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          const monthExpenses = allExpenses.filter((e) => new Date(e.date) >= startOfMonth)

          // Count unique days with expenses
          const uniqueDays = new Set(monthExpenses.map((e) => new Date(e.date).toDateString()))
          objective.current = uniqueDays.size

          if (objective.current >= objective.target && wasIncomplete) {
            objective.completed = true
            gamification.addPoints(objective.points)
            objectivesCompleted = true
          }
          break
        }
      }
    })

    storage.setObjectives(objectives)

    if (objectivesCompleted) {
      const allComplete = objectives.every((obj) => obj.completed)
      if (allComplete) {
        gamification.awardBadge({
          id: crypto.randomUUID(),
          name: "Goal Crusher",
          description: "Completed all objectives",
          icon: "target",
        })
      }
    }
  },

  onExpenseLogged: (): void => {
    // Award points for logging
    gamification.addPoints(5)

    // Update streak
    gamification.updateStreak()

    // Check objectives
    gamification.checkAndUpdateObjectives()

    const progress = gamification.getProgress()
    const allExpenses = expenses.getAll()

    // Check for first expense badge
    if (allExpenses.length === 1) {
      gamification.awardBadge({
        id: crypto.randomUUID(),
        name: "First Step",
        description: "Logged your first expense",
        icon: "check",
      })
    }

    // Check for milestone badges
    if (allExpenses.length === 10) {
      gamification.awardBadge({
        id: crypto.randomUUID(),
        name: "Getting Started",
        description: "Logged 10 expenses",
        icon: "target",
      })
    } else if (allExpenses.length === 50) {
      gamification.awardBadge({
        id: crypto.randomUUID(),
        name: "Dedicated Tracker",
        description: "Logged 50 expenses",
        icon: "award",
      })

      const reward = rewards.getRewardForAchievement("Dedicated Tracker", progress.level)
      if (reward) {
        progress.rewards.push(reward)
        storage.setProgress(progress)
      }
    } else if (allExpenses.length === 100) {
      gamification.awardBadge({
        id: crypto.randomUUID(),
        name: "Century Club",
        description: "Logged 100 expenses",
        icon: "trophy",
      })

      const reward = rewards.getRewardForAchievement("Century Club", progress.level)
      if (reward) {
        progress.rewards.push(reward)
        storage.setProgress(progress)
      }
    }
  },
}
