import { draftMode } from 'next/headers'
import { client } from './client'
import { getDraftClient } from './draftClient'

/**
 * Get Sanity client based on draft mode
 * Returns draft client if draft mode is enabled, otherwise returns public client
 */
export async function getSanityClient() {
  const draft = await draftMode()

  if (draft.isEnabled) {
    return getDraftClient()
  }

  return client
}
