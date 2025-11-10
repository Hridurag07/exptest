import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const expenses = await sql("SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC", [userId])
    return NextResponse.json(expenses)
  } catch (error) {
    console.error("Get expenses error:", error)
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, category, frequency, description, date, isRecurring } = await request.json()

    const result = await sql(
      `INSERT INTO expenses (user_id, amount, category, frequency, description, date, is_recurring) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [userId, amount, category, frequency, description || null, date, isRecurring || false],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Create expense error:", error)
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 })
  }
}
