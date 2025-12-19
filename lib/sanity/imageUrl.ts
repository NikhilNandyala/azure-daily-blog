import imageUrlBuilder, { type ImageUrlBuilder } from '@sanity/image-url'
import { getPublicClient, sanityConfigured } from './client'
import { SanityImage } from './types'

/**
 * Sanity Image URL Builder
 * Generates optimized image URLs for Sanity image assets
 * Supports responsive sizing, quality optimization, and transformations
 */
let builder: ImageUrlBuilder | null = null

function getBuilder(): ImageUrlBuilder | null {
  if (!sanityConfigured) return null
  if (builder) return builder

  const sanityClient = getPublicClient()
  if (!sanityClient) return null

  builder = imageUrlBuilder(sanityClient)
  return builder
}

/**
 * Generate URL for a Sanity image asset
 * Supports auto-sizing, quality optimization, and formatting
 */
export function urlFor(source: SanityImage | SanityImage['asset']): string {
  if (!source) return ''

  const activeBuilder = getBuilder()
  if (!activeBuilder) return ''

  try {
    // Handle both image objects and asset references
    const imageSource = 'asset' in source ? source : { asset: source }

    return activeBuilder.image(imageSource).auto('format').fit('max').url()
  } catch (error) {
    console.warn('Error generating Sanity image URL:', error)
    return ''
  }
}

/**
 * Generate responsive image URL with specified width
 */
export function urlForWidth(source: SanityImage | SanityImage['asset'], width: number): string {
  if (!source) return ''

  const activeBuilder = getBuilder()
  if (!activeBuilder) return ''

  try {
    const imageSource = 'asset' in source ? source : { asset: source }

    return activeBuilder.image(imageSource).width(width).auto('format').fit('max').url()
  } catch (error) {
    console.warn('Error generating Sanity image URL with width:', error)
    return ''
  }
}

/**
 * Generate high-quality image URL for social sharing (OG/Twitter)
 */
export function urlForSocial(
  source: SanityImage | SanityImage['asset'],
  width: number = 1200,
  height: number = 630
): string {
  if (!source) return ''

  const activeBuilder = getBuilder()
  if (!activeBuilder) return ''

  try {
    const imageSource = 'asset' in source ? source : { asset: source }

    return activeBuilder
      .image(imageSource)
      .width(width)
      .height(height)
      .crop('center')
      .fit('fill')
      .auto('format')
      .url()
  } catch (error) {
    console.warn('Error generating Sanity social image URL:', error)
    return ''
  }
}

/**
 * Generate blur placeholder image (tiny, optimized)
 * Use as placeholder until full image loads
 */
export function urlForBlur(source: SanityImage | SanityImage['asset']): string {
  if (!source) return ''

  const activeBuilder = getBuilder()
  if (!activeBuilder) return ''

  try {
    const imageSource = 'asset' in source ? source : { asset: source }

    return activeBuilder
      .image(imageSource)
      .width(10)
      .height(10)
      .quality(20)
      .auto('format')
      .blur(3)
      .url()
  } catch (error) {
    console.warn('Error generating Sanity blur placeholder URL:', error)
    return ''
  }
}

/**
 * Get dimensions of a Sanity image
 */
export function getImageDimensions(source: SanityImage): {
  width: number
  height: number
  aspectRatio: number
} | null {
  try {
    if (!source?.asset?._id) return null

    // Extract dimensions from asset ID (Sanity format: {assetId}-{width}x{height})
    const matches = source.asset._id.match(/-(\d+)x(\d+)-/)
    if (matches && matches[1] && matches[2]) {
      const width = parseInt(matches[1], 10)
      const height = parseInt(matches[2], 10)
      return {
        width,
        height,
        aspectRatio: width / height,
      }
    }

    return null
  } catch (error) {
    console.warn('Error extracting image dimensions:', error)
    return null
  }
}
