import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is admin
    const userCheck = await sql("SELECT is_admin FROM users WHERE id = $1", [userId])
    if (!userCheck || userCheck.length === 0 || !userCheck[0].is_admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    // Get all users with their progress
    const users = await sql(
      `SELECT u.id, u.email, u.name, u.theme, u.is_admin, u.created_at, 
              p.points, p.level, p.streak 
       FROM users u 
       LEFT JOIN user_progress p ON u.id = p.user_id 
       ORDER BY u.created_at DESC`,
    )

    return NextResponse.json(users)
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
