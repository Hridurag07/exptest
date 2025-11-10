import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await sql(
      `SELECT u.id, u.email, u.name, u.theme, u.created_at, 
              p.points, p.level, p.streak, p.last_log_date 
       FROM users u 
       LEFT JOIN user_progress p ON u.id = p.user_id 
       WHERE u.id = $1`,
      [userId],
    )

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user[0])
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
