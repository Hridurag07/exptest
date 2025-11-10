import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export function verifyToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { userId: string }
    return decoded.userId
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}
