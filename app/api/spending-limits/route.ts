import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const limits = await sql("SELECT * FROM spending_limits WHERE user_id = $1 ORDER BY created_at DESC", [userId])
    return NextResponse.json(limits)
  } catch (error) {
    console.error("Get spending limits error:", error)
    return NextResponse.json({ error: "Failed to fetch spending limits" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { category, limitType, amount, notifyAt, enabled } = await request.json()

    const result = await sql(
      `INSERT INTO spending_limits (user_id, category, limit_type, amount, notify_at, enabled) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [userId, category, limitType, amount, notifyAt || [50, 80, 90], enabled !== false],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Create spending limit error:", error)
    return NextResponse.json({ error: "Failed to create spending limit" }, { status: 500 })
  }
}
