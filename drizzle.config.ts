import { readFileSync } from 'node:fs'
import dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'

const isSchemaGeneration = process.env.npm_lifecycle_event === 'db:generate'

if (!process.env.POSTGRES_URL_NON_POOLING && !process.env.POSTGRES_URL && !isSchemaGeneration) {
  dotenv.config({ path: '.env.local' })
}

const postgresUrl = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL

if (!postgresUrl && !isSchemaGeneration) {
  throw new Error('POSTGRES_URL_NON_POOLING or POSTGRES_URL is required.')
}

function createDrizzleCredentials(value: string) {
  const url = new URL(value)
  const ca =
    process.env.SUPABASE_DB_CA_CERT ??
    (process.env.SUPABASE_DB_CA_CERT_PATH
      ? readFileSync(process.env.SUPABASE_DB_CA_CERT_PATH, 'utf8')
      : undefined)

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 5432,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.replace(/^\//, '')),
    ...(ca ? { ssl: { ca } } : { ssl: { rejectUnauthorized: false } }),
  }
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  tablesFilter: ['salamin_responses'],
  ...(postgresUrl ? { dbCredentials: createDrizzleCredentials(postgresUrl) } : {}),
  verbose: true,
})
