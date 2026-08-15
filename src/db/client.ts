import { readFileSync } from 'node:fs'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

export function createDatabase(postgresUrl: string) {
  const url = new URL(postgresUrl)
  const sslMode = url.searchParams.get('sslmode')
  const needsSsl = Boolean(sslMode) || url.hostname.includes('supabase.co')
  const ca =
    process.env.SUPABASE_DB_CA_CERT ??
    (process.env.SUPABASE_DB_CA_CERT_PATH
      ? readFileSync(process.env.SUPABASE_DB_CA_CERT_PATH, 'utf8')
      : undefined)

  url.searchParams.delete('sslmode')

  const client = new Pool({
    connectionString: url.toString(),
    max: 3,
    ...(ca ? { ssl: { ca } } : needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  })

  return { client, db: drizzle({ client }) }
}

export type SalaminDatabase = ReturnType<typeof createDatabase>['db']
