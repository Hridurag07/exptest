import type { UserProgress } from "./types"
import { expenses } from "./expenses"
import { income } from "./income"
import { budgets } from "./budgets"

export const avatarDialogue = {
  getGreeting: (progress: UserProgress): string => {
    const hour = new Date().getHours()
    const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

    const greetings = [
      `${timeGreeting}! Ready to track your finances?`,
      `${timeGreeting}! Let's make today count!`,
      `Hey there! You're on level ${progress.level}!`,
      `Welcome back! Your streak is ${progress.streak} days!`,
      `${timeGreeting}, financial champion! Level ${progress.level} and counting!`,
      `Great to see you! ${progress.badges.length} badges earned so far!`,
      progress.streak >= 7
        ? `${timeGreeting}! Your ${progress.streak}-day streak is impressive!`
        : `${timeGreeting}! Start building your streak today!`,
      progress.level >= 10
        ? `${timeGreeting}, expert! You've mastered level ${progress.level}!`
        : `${timeGreeting}! Keep logging to level up!`,
    ]

    return greetings[Math.floor(Math.random() * greetings.length)]
  },

  getSpendingFeedback: (): string => {
    const monthlyExpenses = expenses.getTotalByPeriod("monthly")
    const monthlyIncome = income.getTotalByPeriod("monthly")
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0

    const allBudgets = budgets.getAll()
    const overBudgetCount = allBudgets.filter((b) => {
      const status = budgets.getBudgetStatus(b)
      return status.isOverBudget
    }).length

    if (savingsRate >= 50) {
      return "Wow! You're saving over 50% of your income. That's incredible financial discipline! You're on track for early financial independence!"
    } else if (savingsRate >= 30) {
      return (
        "Great job! You're maintaining a healthy savings rate of " +
        savingsRate.toFixed(0) +
        "%. Financial experts recommend 20-30%, so you're exceeding expectations!"
      )
    } else if (savingsRate >= 20) {
      return (
        "You're doing well with a " +
        savingsRate.toFixed(0) +
        "% savings rate. Small optimizations could push you to 30%+ savings!"
      )
    } else if (savingsRate >= 10) {
      if (overBudgetCount > 0) {
        return `You have ${overBudgetCount} budget${overBudgetCount > 1 ? "s" : ""} exceeded. Review your spending categories to boost your ${savingsRate.toFixed(0)}% savings rate.`
      }
      return (
        "Your savings could use a boost at " +
        savingsRate.toFixed(0) +
        "%. Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings."
      )
    } else if (savingsRate > 0) {
      return `You're spending most of your income (${savingsRate.toFixed(0)}% savings). Consider reviewing your budget to find savings opportunities. Every rupee counts!`
    } else {
      return "You're spending more than you earn. Let's work together to get your finances back on track! Start by identifying your top 3 expenses."
    }
  },

  getMotivationalMessage: (progress: UserProgress): string => {
    if (progress.streak >= 30) {
      return "30-day streak! You're a financial tracking champion! Your consistency is building wealth-building habits that will last a lifetime!"
    } else if (progress.streak >= 14) {
      return "Two weeks of consistent tracking! Research shows it takes 21 days to form a habit. You're almost there!"
    } else if (progress.streak >= 7) {
      return "One week streak! Consistency is the key to financial success! Keep this momentum going!"
    } else if (progress.level >= 20) {
      return "Level 20+! You're a budgeting master! Your financial awareness is in the top tier!"
    } else if (progress.level >= 10) {
      return "Level 10+! You're becoming a budgeting expert! Your dedication is truly inspiring!"
    } else if (progress.badges.length >= 10) {
      return `${progress.badges.length} badges earned! You're crushing your goals! Each achievement brings you closer to financial freedom!`
    } else if (progress.badges.length >= 5) {
      return `${progress.badges.length} badges earned! You're making excellent progress! Keep up the great work!`
    } else if (progress.points >= 100) {
      return `${progress.points} points earned! Every expense logged is a step toward better financial health!`
    } else {
      return "Every expense logged brings you closer to financial freedom! Small steps lead to big changes!"
    }
  },

  getTip: (): string => {
    const tips = [
      "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. It's a simple framework for balanced finances!",
      "Track every expense, no matter how small. Those daily coffees can add up to thousands per year!",
      "Set specific savings goals with deadlines. 'Save 50,000 by December' is better than 'save more money'.",
      "Review your spending weekly to catch bad habits early. Sunday evening is a great time for a financial check-in!",
      "Automate your savings to make it effortless. Set up automatic transfers on payday!",
      "Use the envelope method for discretionary spending. Allocate cash to categories and stop when it's gone!",
      "Cook at home more often to save on food expenses. Meal prep on weekends can save 40% on food costs!",
      "Cancel subscriptions you don't actively use. The average person has 3-5 forgotten subscriptions!",
      "Wait 24 hours before making impulse purchases. You'll avoid 80% of regrettable buys!",
      "Celebrate small wins on your financial journey! Reward yourself (within budget) for hitting milestones!",
      "Use the 'one in, one out' rule for purchases. Buy something new? Donate or sell something old!",
      "Track your net worth monthly. Seeing it grow is incredibly motivating!",
      "Build an emergency fund of 3-6 months expenses. Financial security reduces stress!",
      "Negotiate bills annually. A 10-minute call can save hundreds on insurance, internet, or phone plans!",
      "Use cashback and rewards strategically. But never spend more just to earn rewards!",
      "Set spending limits for different categories. Constraints breed creativity and savings!",
      "Review your biggest expenses first. A 10% cut on rent saves more than eliminating coffee!",
      "Find free alternatives to paid entertainment. Libraries, parks, and community events are treasure troves!",
      "Buy quality items that last. Cheap often costs more in the long run!",
      "Track your income too! Knowing your earning patterns helps with better planning!",
    ]

    return tips[Math.floor(Math.random() * tips.length)]
  },

  getCelebration: (event: string): string => {
    const celebrations: Record<string, string[]> = {
      levelUp: [
        "Level up! You're on fire!",
        "New level unlocked! Keep going!",
        "Amazing progress! You've leveled up!",
        "Congratulations! Your dedication is paying off!",
        "Level up achieved! You're unstoppable!",
      ],
      badgeEarned: [
        "New badge earned! You're doing great!",
        "Badge unlocked! Your hard work is paying off!",
        "Congratulations on your new achievement!",
        "Achievement unlocked! You're a star!",
        "New badge! Your consistency is impressive!",
      ],
      streakMilestone: [
        "Streak milestone! Your consistency is impressive!",
        "What a streak! You're unstoppable!",
        "Streak achievement unlocked! Keep it going!",
        "Amazing streak! Consistency is your superpower!",
        "Streak milestone reached! You're building great habits!",
      ],
      rewardEarned: [
        "Gift card earned! Treat yourself, you've earned it!",
        "New reward unlocked! Your dedication is paying off!",
        "Congratulations! You've earned a special reward!",
        "Reward time! Your hard work deserves recognition!",
        "Gift card unlocked! Enjoy your well-earned reward!",
      ],
      objectiveComplete: [
        "Objective completed! You're crushing your goals!",
        "Goal achieved! Your focus is paying off!",
        "Objective unlocked! Keep up the momentum!",
        "Mission accomplished! You're doing amazing!",
        "Objective complete! You're a goal-crushing machine!",
      ],
    }

    const messages = celebrations[event] || ["Great job!"]
    return messages[Math.floor(Math.random() * messages.length)]
  },

  getBudgetAdvice: (): string => {
    const allBudgets = budgets.getAll()

    if (allBudgets.length === 0) {
      return "You haven't set any budgets yet! Creating budgets is the first step to taking control of your finances. Start with your biggest expense categories!"
    }

    const budgetStatuses = allBudgets.map((b) => ({
      budget: b,
      status: budgets.getBudgetStatus(b),
    }))

    const overBudget = budgetStatuses.filter((bs) => bs.status.isOverBudget)
    const nearLimit = budgetStatuses.filter((bs) => bs.status.percentage >= 80 && !bs.status.isOverBudget)
    const onTrack = budgetStatuses.filter((bs) => bs.status.percentage < 80)

    if (overBudget.length > 0) {
      const category = overBudget[0].budget.category === "overall" ? "overall spending" : overBudget[0].budget.category
      return `You're over budget on ${category}. Review your recent expenses in this category and identify areas to cut back. Small changes add up!`
    } else if (nearLimit.length > 0) {
      const category = nearLimit[0].budget.category === "overall" ? "overall spending" : nearLimit[0].budget.category
      return `You're at ${nearLimit[0].status.percentage.toFixed(0)}% of your ${category} budget. Be mindful of spending in this category for the rest of the period!`
    } else if (onTrack.length === allBudgets.length) {
      return `All ${allBudgets.length} budgets are on track! Excellent financial discipline! Keep up the great work!`
    }

    return "Your budgets are looking good! Keep tracking your expenses to maintain this healthy financial balance!"
  },

  getProgressEncouragement: (progress: UserProgress): string => {
    const pointsToNextLevel = progress.level * 100 - progress.points
    const levelProgress = ((progress.points % 100) / 100) * 100

    if (levelProgress >= 90) {
      return `You're so close to level ${progress.level + 1}! Just ${pointsToNextLevel} more points! Log a few more expenses to level up!`
    } else if (levelProgress >= 75) {
      return `You're ${levelProgress.toFixed(0)}% of the way to level ${progress.level + 1}! Keep up the momentum!`
    } else if (progress.streak === 0) {
      return "Start your tracking streak today! Consistent logging is the foundation of financial success. Even one expense counts!"
    } else if (progress.streak < 7) {
      return `You're on a ${progress.streak}-day streak! Can you make it to 7 days? Consistency builds powerful habits!`
    } else {
      return `Level ${progress.level} with ${progress.points} points! You're making excellent progress on your financial journey!`
    }
  },
}
