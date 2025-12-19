import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = '2024-12-14'

if (!projectId || !dataset) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET environment variables'
  )
}

/**
 * Sanity client for server-side data fetching
 * Uses public token only (safe for public queries)
 * No secrets or auth tokens exposed to browser
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for faster reads
  perspective: 'published', // Only fetch published documents
})
