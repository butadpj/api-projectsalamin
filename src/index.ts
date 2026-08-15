import 'dotenv/config'
import { serve } from '@hono/node-server'
import { createApp } from './app.js'
import { createDatabase } from './db/client.js'

const postgresUrl = process.env.POSTGRES_URL
if (!postgresUrl) throw new Error('POSTGRES_URL is required.')

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const { db } = createDatabase(postgresUrl)
const app = createApp(db, allowedOrigins)
const port = Number(process.env.PORT ?? 3001)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`SALAMIN API listening on http://localhost:${info.port}`)
})
