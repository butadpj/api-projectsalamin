import { index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { Affinity, Reflection, ResponseReaction } from '../response-contract.js'

export const salaminResponses = pgTable(
  'salamin_responses',
  {
    submissionId: uuid('submission_id').primaryKey(),
    experimentVersion: text('experiment_version').notNull(),
    affinity: text('affinity').notNull().$type<Affinity>(),
    reactions: jsonb('reactions').notNull().$type<ResponseReaction[]>(),
    reflection: text('reflection').notNull().$type<Reflection>(),
    durationSeconds: integer('duration_seconds').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('salamin_responses_created_at_idx').on(table.createdAt)],
).enableRLS()

export const SalaminResponseRowSchema = createSelectSchema(salaminResponses)
export const SalaminResponseInsertSchema = createInsertSchema(salaminResponses)
