import type { User, Expense, Budget } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

class ApiClient {
  private token: string | null = null
  private isLocalMode = false

  constructor() {
    // Check if we're in development/preview mode (no API endpoints available)
    this.isLocalMode = typeof window !== "undefined" && !process.env.NEXT_PUBLIC_API_URL
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem("authToken", token)
  }

  getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("authToken")
    }
    return this.token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    const token = this.getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.error || "API request failed")
    }

    return response.json()
  }

  // Auth methods
  async register(email: string, password: string, name: string, theme: "light" | "dark") {
    if (this.isLocalMode) {
      // Preview/Development mode - use localStorage
      const existingUsers = JSON.parse(localStorage.getItem("_users") || "[]")
      if (existingUsers.some((u: any) => u.email === email)) {
        throw new Error("Email already registered")
      }

      const user: User = {
        id: crypto.randomUUID(),
        email,
        name,
        theme,
        createdAt: new Date().toISOString(),
      }

      const token = `token_${user.id}`
      existingUsers.push({ ...user, password })
      localStorage.setItem("_users", JSON.stringify(existingUsers))
      this.setToken(token)
      return user
    }

    // Cloud mode - use API
    const data = await this.request<{ user: User; token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name, theme }),
    })
    this.setToken(data.token)
    return data.user
  }

  async login(email: string, password: string) {
    if (this.isLocalMode) {
      // Preview/Development mode - use localStorage
      const users = JSON.parse(localStorage.getItem("_users") || "[]")
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (!user) {
        throw new Error("Invalid email or password")
      }

      const token = `token_${user.id}`
      this.setToken(token)
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword as User
    }

    // Cloud mode - use API
    const data = await this.request<{ user: User; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    this.setToken(data.token)
    return data.user
  }

  async logout() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
    }
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    if (this.isLocalMode) return []
    return this.request("/api/expenses")
  }

  async addExpense(expense: Omit<Expense, "id" | "createdAt">) {
    if (this.isLocalMode) return expense as Expense
    return this.request<Expense>("/api/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
    })
  }

  // Budgets
  async getBudgets(): Promise<Budget[]> {
    if (this.isLocalMode) return []
    return this.request("/api/budgets")
  }

  async addBudget(budget: Omit<Budget, "id" | "createdAt">) {
    if (this.isLocalMode) return budget as Budget
    return this.request<Budget>("/api/budgets", {
      method: "POST",
      body: JSON.stringify(budget),
    })
  }

  // User Profile
  async getProfile() {
    if (this.isLocalMode) return null
    return this.request("/api/user/profile")
  }
}

export const apiClient = new ApiClient()
