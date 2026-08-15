import { z } from 'zod'

export const SALAMIN_EXPERIMENT_VERSION = 'v1'

export const AffinitySchema = z.enum(['leni', 'sara'])
export const ReactionSchema = z.enum(['believe', 'check', 'share', 'doubt'])
export const ReflectionSchema = z.enum(['more-belief', 'more-doubt', 'same', 'unsure'])
export const PairIdSchema = z.enum(['presidential-candidacy', 'flood-control'])
export const VariantIdSchema = z.enum(['leni-candidacy', 'sara-candidacy', 'leni-frame', 'dds-frame'])

export type Affinity = z.infer<typeof AffinitySchema>
export type Reflection = z.infer<typeof ReflectionSchema>

export const ResponseReactionSchema = z.object({
  pairId: PairIdSchema,
  variantId: VariantIdSchema,
  position: z.number().int().min(0).max(3),
  reaction: ReactionSchema,
})

export type ResponseReaction = z.infer<typeof ResponseReactionSchema>

const routes: Record<Affinity, Array<Pick<ResponseReaction, 'pairId' | 'variantId'>>> = {
  leni: [
    { pairId: 'presidential-candidacy', variantId: 'leni-candidacy' },
    { pairId: 'flood-control', variantId: 'leni-frame' },
    { pairId: 'presidential-candidacy', variantId: 'sara-candidacy' },
    { pairId: 'flood-control', variantId: 'dds-frame' },
  ],
  sara: [
    { pairId: 'presidential-candidacy', variantId: 'sara-candidacy' },
    { pairId: 'flood-control', variantId: 'dds-frame' },
    { pairId: 'presidential-candidacy', variantId: 'leni-candidacy' },
    { pairId: 'flood-control', variantId: 'leni-frame' },
  ],
}

export const SubmitResponseRequestSchema = z
  .object({
    submissionId: z.uuid(),
    affinity: AffinitySchema,
    reactions: z.array(ResponseReactionSchema).length(4),
    reflection: ReflectionSchema,
    durationSeconds: z.number().int().min(1).max(3600),
  })
  .superRefine((submission, context) => {
    const expectedRoute = routes[submission.affinity]

    submission.reactions.forEach((reaction, index) => {
      const expected = expectedRoute[index]
      if (
        reaction.position !== index ||
        reaction.pairId !== expected.pairId ||
        reaction.variantId !== expected.variantId
      ) {
        context.addIssue({
          code: 'custom',
          path: ['reactions', index],
          message: 'Reaction does not match the expected experiment route.',
        })
      }
    })
  })

export type SubmitResponseRequest = z.infer<typeof SubmitResponseRequestSchema>
