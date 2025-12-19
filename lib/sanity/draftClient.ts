import { createClient } from '@sanity/client'
import type { SanityClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const draftToken = process.env.SANITY_DRAFT_TOKEN
const apiVersion = '2024-12-14'

if (!projectId || !dataset) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET environment variables'
  )
}

let _draftClient: SanityClient | null = null

/**
 * Get or create Sanity client for draft/preview mode
 * Uses read token for accessing draft documents
 * Called only on server-side when draft mode is enabled
 * Lazily initialized to avoid requiring token during build
 */
export function getDraftClient(): SanityClient {
  if (!draftToken) {
    throw new Error(
      'Missing SANITY_DRAFT_TOKEN environment variable. Required for draft preview mode.'
    )
  }

  if (!_draftClient) {
    _draftClient = createClient({
      projectId,
      dataset,
      apiVersion,
      token: draftToken,
      useCdn: false,
      perspective: 'previewDrafts',
    })
  }

  return _draftClient
}
