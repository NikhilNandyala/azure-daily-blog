import { createClient } from '@sanity/client'
import type { SanityClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = '2024-12-14'

export const sanityConfigured = Boolean(projectId && dataset)

/**
 * Returns a public Sanity client when configuration is present, otherwise null.
 * This prevents build-time crashes if env vars are missing in CI.
 */
export function getPublicClient(): SanityClient | null {
  if (!sanityConfigured) return null

  return createClient({
    projectId: projectId!,
    dataset: dataset!,
    apiVersion,
    useCdn: true,
    perspective: 'published',
  })
}

// Backwards-compatible export used throughout the codebase
export const client = getPublicClient()
