import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify ownership
    const expense = await sql("SELECT user_id FROM expenses WHERE id = $1", [params.id])
    if (!expense || expense.length === 0 || expense[0].user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await sql("DELETE FROM expenses WHERE id = $1", [params.id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete expense error:", error)
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 })
  }
}
