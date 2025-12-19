import { createClient } from '@sanity/client'
import type { SanityClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const draftToken = process.env.SANITY_DRAFT_TOKEN
const apiVersion = '2024-12-14'

export const draftConfigured = Boolean(projectId && dataset && draftToken)

let _draftClient: SanityClient | null = null

/**
 * Get or create Sanity client for draft/preview mode
 * Returns null when config or token is missing so builds don't fail.
 */
export function getDraftClient(): SanityClient | null {
  if (!draftConfigured) return null

  if (!_draftClient) {
    _draftClient = createClient({
      projectId: projectId!,
      dataset: dataset!,
      apiVersion,
      token: draftToken!,
      useCdn: false,
      perspective: 'previewDrafts',
    })
  }

  return _draftClient
}
