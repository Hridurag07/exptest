import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, theme } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql("SELECT id FROM users WHERE email = $1", [email])
    if (existingUser && existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await sql(
      `INSERT INTO users (email, password_hash, name, theme) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, name, theme, created_at`,
      [email, hashedPassword, name, theme || "light"],
    )

    if (!result || result.length === 0) {
      throw new Error("Failed to create user")
    }

    const user = result[0]

    // Initialize user progress
    await sql(
      `INSERT INTO user_progress (user_id, points, level, streak) 
       VALUES ($1, 0, 1, 0)`,
      [user.id],
    )

    // Initialize avatar settings
    await sql(
      `INSERT INTO avatar_settings (user_id, selected_face, selected_outfit, selected_shoes, selected_headdress, selected_background) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.id, "face-male-1", "outfit-casual", "shoes-sneakers", "headdress-none", "bg-simple"],
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
      await sql(
        `INSERT INTO objectives (user_id, type, title, description, target, current, completed, points) 
         VALUES ($1, $2, $3, $4, $5, 0, false, $6)`,
        [user.id, obj.type, obj.title, obj.description, obj.target, obj.points],
      )
    }

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
