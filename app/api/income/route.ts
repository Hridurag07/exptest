import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const income = await sql("SELECT * FROM income WHERE user_id = $1 ORDER BY date DESC", [userId])
    return NextResponse.json(income)
  } catch (error) {
    console.error("Get income error:", error)
    return NextResponse.json({ error: "Failed to fetch income" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, source, frequency, description, date } = await request.json()

    const result = await sql(
      `INSERT INTO income (user_id, amount, source, frequency, description, date) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [userId, amount, source, frequency, description || null, date],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Create income error:", error)
    return NextResponse.json({ error: "Failed to create income" }, { status: 500 })
  }
}
