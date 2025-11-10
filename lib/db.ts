import mysql from "mysql2/promise"

let connection: mysql.Connection | null = null

async function getConnection() {
  if (connection) {
    return connection
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }

  // Parse MySQL connection URL: mysql://user:password@host:port/database
  const url = new URL(process.env.DATABASE_URL)
  const config = {
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    port: url.port ? Number.parseInt(url.port) : 3306,
  }

  connection = await mysql.createConnection(config)
  return connection
}

export async function sql(query: string, values: any[] = []) {
  const conn = await getConnection()
  try {
    // Convert PostgreSQL $1, $2 syntax to MySQL ? syntax
    let convertedQuery = query
    for (let i = values.length; i >= 1; i--) {
      convertedQuery = convertedQuery.replace(new RegExp(`\\$${i}`, "g"), "?")
    }

    // Also handle PostgreSQL specific functions
    convertedQuery = convertedQuery.replace(/NOW$$$$/gi, "NOW()")
    convertedQuery = convertedQuery.replace(/INTERVAL '7 days'/gi, "INTERVAL 7 DAY")
    convertedQuery = convertedQuery.replace(/BOOLEAN/gi, "TINYINT(1)")

    const [rows] = await conn.execute(convertedQuery, values)
    return rows
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function query(queryStr: string, values: any[] = []) {
  return sql(queryStr, values)
}

export async function execute(queryStr: string, values: any[] = []) {
  const conn = await getConnection()
  try {
    let convertedQuery = queryStr
    for (let i = values.length; i >= 1; i--) {
      convertedQuery = convertedQuery.replace(new RegExp(`\\$${i}`, "g"), "?")
    }
    const result = await conn.execute(convertedQuery, values)
    return result[0]
  } catch (error) {
    console.error("Database execute error:", error)
    throw error
  }
}

export { sql as default }
