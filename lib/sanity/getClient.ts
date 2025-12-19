import { draftMode } from 'next/headers'
import { client, sanityConfigured } from './client'
import { getDraftClient, draftConfigured } from './draftClient'

export async function getSanityClient() {
  if (!sanityConfigured) return null

  const draft = await draftMode()

  if (draft.isEnabled) {
    if (draftConfigured) {
      const draftClient = getDraftClient()
      if (draftClient) return draftClient
    }
  }

  return client
}
