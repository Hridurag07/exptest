import { jwtVerify, SignJWT } from "jose"

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function signToken(payload: any, expiresIn = "7d") {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET)

  return token
}

export async function verifyTokenClient(token: string) {
  try {
    const verified = await jwtVerify(token, SECRET)
    return verified.payload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7)
}
