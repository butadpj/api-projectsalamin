import dotenv from 'dotenv'
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { cors } from 'hono/cors'
import { SubmitResponseRequestSchema } from './response-contract.js'
import { createDatabase, type SalaminDatabase } from './db/client.js'
import { responseStore } from './responses/store.js'

export function createApp(db: SalaminDatabase, allowedOrigins: string[]) {
  const app = new Hono()
  const store = responseStore(db)

  app.use(
    '/api/*',
    cors({
      origin: (origin) => (allowedOrigins.includes(origin) ? origin : ''),
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
      maxAge: 86400,
    }),
  )

  app.get('/api/health', (context) => context.json({ ok: true }))

  app.post(
    '/api/responses',
    bodyLimit({ maxSize: 16 * 1024 }),
    async (context) => {
      let body: unknown
      try {
        body = await context.req.json()
      } catch {
        return context.json({ error: 'Invalid JSON body.' }, 400)
      }

      const parsed = SubmitResponseRequestSchema.safeParse(body)
      if (!parsed.success) {
        return context.json({ error: 'Invalid response data.' }, 400)
      }

      try {
        await store.create(parsed.data)
        return context.json({ saved: true }, 201)
      } catch (error) {
        console.error('Failed to save a consented SALAMIN response.', error)
        return context.json({ error: 'Response could not be saved.' }, 500)
      }
    },
  )

  return app
}

if (!process.env.POSTGRES_URL) dotenv.config({ path: '.env.local' })

const postgresUrl = process.env.POSTGRES_URL
if (!postgresUrl) throw new Error('POSTGRES_URL is required.')

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const { db } = createDatabase(postgresUrl)

export const app = createApp(db, allowedOrigins)
