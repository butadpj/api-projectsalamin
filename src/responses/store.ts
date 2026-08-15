import type { SalaminDatabase } from '../db/client.js'
import { salaminResponses } from '../db/schema.js'
import { SALAMIN_EXPERIMENT_VERSION, type SubmitResponseRequest } from '../response-contract.js'

export function responseStore(db: SalaminDatabase) {
  return {
    async create(input: SubmitResponseRequest) {
      await db
        .insert(salaminResponses)
        .values({
          submissionId: input.submissionId,
          experimentVersion: SALAMIN_EXPERIMENT_VERSION,
          affinity: input.affinity,
          reactions: input.reactions,
          reflection: input.reflection,
          durationSeconds: input.durationSeconds,
        })
        .onConflictDoNothing({ target: salaminResponses.submissionId })
    },
  }
}
