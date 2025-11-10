import { query, execute } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, theme } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await query("SELECT id FROM users WHERE email = ?", [email])
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await execute(
      `INSERT INTO users (email, password_hash, name, theme) 
       VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, name, theme || "light"],
    )

    const userId = (result as any).insertId

    if (!userId) {
      throw new Error("Failed to create user")
    }

    // Initialize user progress
    await execute(
      `INSERT INTO user_progress (user_id, points, level, streak) 
       VALUES (?, 0, 1, 0)`,
      [userId],
    )

    // Initialize avatar settings
    await execute(
      `INSERT INTO avatar_settings (user_id, selected_face, selected_outfit, selected_shoes, selected_headdress, selected_background) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, "face-male-1", "outfit-casual", "shoes-sneakers", "headdress-none", "bg-simple"],
    )

    // Initialize default objectives
    const objectivesData = [
      {
        type: "daily",
        title: "Log Your First Expense",
        description: "Track at least one expense today",
        target: 1,
        points: 10,
      },
      {
        type: "daily",
        title: "Track Multiple Expenses",
        description: "Log at least 3 expenses today",
        target: 3,
        points: 20,
      },
      {
        type: "weekly",
        title: "Stay Within Budget",
        description: "Keep expenses under 80% of weekly budget",
        target: 80,
        points: 50,
      },
    ]

    for (const obj of objectivesData) {
      await execute(
        `INSERT INTO objectives (user_id, type, title, description, target, current, completed, points) 
         VALUES (?, ?, ?, ?, ?, 0, false, ?)`,
        [userId, obj.type, obj.title, obj.description, obj.target, obj.points],
      )
    }

    // Get user data
    const users = (await query("SELECT id, email, name, theme, created_at FROM users WHERE id = ?", [userId])) as any[]
    const user = users[0]

    // Create JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "secret", {
      expiresIn: process.env.JWT_EXPIRATION || "7d",
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          theme: user.theme,
          createdAt: user.created_at,
        },
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
