import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    // Find user
    const result = await sql("SELECT id, email, name, theme, password_hash, created_at FROM users WHERE email = $1", [
      email,
    ])

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = result[0]

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "secret", {
      expiresIn: process.env.JWT_EXPIRATION || "7d",
    })

    // Store session
    await sql(
      `INSERT INTO sessions (user_id, token_hash, expires_at) 
       VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [user.id, token],
    )

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        theme: user.theme,
        createdAt: user.created_at,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
