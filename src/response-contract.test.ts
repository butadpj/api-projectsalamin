import { describe, expect, it } from 'vitest'
import { SubmitResponseRequestSchema } from './response-contract.js'

const validSubmission = {
  submissionId: '81a0b1bf-26b5-4d2a-9f95-33e41b2fc467',
  affinity: 'leni',
  reactions: [
    { pairId: 'presidential-candidacy', variantId: 'leni-candidacy', position: 0, reaction: 'check' },
    { pairId: 'flood-control', variantId: 'leni-frame', position: 1, reaction: 'doubt' },
    { pairId: 'presidential-candidacy', variantId: 'sara-candidacy', position: 2, reaction: 'check' },
    { pairId: 'flood-control', variantId: 'dds-frame', position: 3, reaction: 'doubt' },
  ],
  reflection: 'same',
  durationSeconds: 72,
} as const

describe('SubmitResponseRequestSchema', () => {
  it('accepts the controlled route for the selected affinity', () => {
    expect(SubmitResponseRequestSchema.safeParse(validSubmission).success).toBe(true)
  })

  it('rejects a reordered or fabricated route', () => {
    const invalid = {
      ...validSubmission,
      reactions: validSubmission.reactions.map((reaction, index) =>
        index === 0 ? { ...reaction, variantId: 'sara-candidacy' as const } : reaction,
      ),
    }

    expect(SubmitResponseRequestSchema.safeParse(invalid).success).toBe(false)
  })
})
