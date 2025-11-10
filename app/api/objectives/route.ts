import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const objectives = await sql("SELECT * FROM objectives WHERE user_id = $1 ORDER BY type, created_at DESC", [userId])
    return NextResponse.json(objectives)
  } catch (error) {
    console.error("Get objectives error:", error)
    return NextResponse.json({ error: "Failed to fetch objectives" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, title, description, target, current, completed, points } = await request.json()

    const result = await sql(
      `INSERT INTO objectives (user_id, type, title, description, target, current, completed, points) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [userId, type, title, description, target, current || 0, completed || false, points],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Create objective error:", error)
    return NextResponse.json({ error: "Failed to create objective" }, { status: 500 })
  }
}
