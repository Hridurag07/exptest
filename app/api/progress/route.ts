import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const progress = await sql("SELECT * FROM user_progress WHERE user_id = $1", [userId])

    if (!progress || progress.length === 0) {
      return NextResponse.json({ error: "Progress not found" }, { status: 404 })
    }

    return NextResponse.json(progress[0])
  } catch (error) {
    console.error("Get progress error:", error)
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { points, level, streak, lastLogDate } = await request.json()

    const result = await sql(
      `UPDATE user_progress 
       SET points = COALESCE($2, points), 
           level = COALESCE($3, level), 
           streak = COALESCE($4, streak),
           last_log_date = COALESCE($5, last_log_date),
           updated_at = NOW()
       WHERE user_id = $1
       RETURNING *`,
      [userId, points, level, streak, lastLogDate],
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Update progress error:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
