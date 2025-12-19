import { SanityClient } from '@sanity/client'
import { client } from './client'
import { SiteSettings } from './types'

/**
 * Get site settings
 * Supports both published and draft perspectives via optional client parameter
 */
export async function getSiteSettings(siteClient?: SanityClient): Promise<SiteSettings | null> {
  const activeClient = siteClient || client
  if (!activeClient) return null

  const query = `
    *[_type == "siteSettings"][0] {
      siteTitle,
      siteDescription,
      defaultSeoTitle,
      defaultSeoDescription,
      ogImage {
        asset -> { url },
        hotspot
      }
    }
  `

  try {
    const settings = await activeClient.fetch<SiteSettings>(query)
    return settings || null
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}
