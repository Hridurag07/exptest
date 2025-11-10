import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const budgets = await sql("SELECT * FROM budgets WHERE user_id = $1 ORDER BY created_at DESC", [userId])
    return NextResponse.json(budgets)
  } catch (error) {
    console.error("Get budgets error:", error)
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { category, amount, period, notificationThresholds } = await request.json()

    const result = await sql(
      `INSERT INTO budgets (user_id, category, amount, period, notification_thresholds) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [userId, category, amount, period, notificationThresholds || [50, 80, 90]],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Create budget error:", error)
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 })
  }
}
