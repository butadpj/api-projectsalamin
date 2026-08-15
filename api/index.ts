import { app } from '../src/app.js'

function handle(request: Request) {
  return app.fetch(request)
}

export const GET = handle
export const POST = handle
export const OPTIONS = handle
