# Project SALAMIN API

Small Hono API for storing consented, anonymous Project SALAMIN challenge responses in Supabase Postgres through Drizzle ORM.

## Environment

Copy `.env.example` to `.env.local` and provide:

- `POSTGRES_URL` — required runtime pooled Supabase Postgres URL
- `POSTGRES_URL_NON_POOLING` — required direct Supabase Postgres URL for migrations
- `ALLOWED_ORIGINS` — required production frontend origin; comma-separated when needed
- `PORT` — optional; defaults to `3001`
- `SUPABASE_DB_CA_CERT` or `SUPABASE_DB_CA_CERT_PATH` — optional explicit CA configuration

The API does not use `SUPABASE_URL`, an anon key, or a service-role key. Drizzle connects directly to Postgres from the server.

## Commands

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

`db:push` is intentionally disabled. Generate and commit migrations instead.

## Endpoints

- `GET /api/health`
- `POST /api/responses`

Only consented responses should be sent. The client-generated `submissionId` makes retries idempotent.
