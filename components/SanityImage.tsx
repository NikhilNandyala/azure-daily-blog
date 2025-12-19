import Image from 'next/image'
import { urlFor, urlForBlur, getImageDimensions } from '@/lib/sanity/imageUrl'
import { SanityImage as SanityImageType } from '@/lib/sanity/types'

interface SanityImageProps {
  image: SanityImageType | null | undefined
  alt: string
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  className?: string
  objectFit?: 'cover' | 'contain' | 'fill'
  onLoad?: () => void
}

/**
 * SanityImage Component
 * Optimized Next.js Image component for Sanity images
 * Features:
 * - Automatic blur placeholder while loading
 * - Responsive sizing
 * - Next/Image optimization (WebP, AVIF, etc.)
 * - Fallback for missing images
 * - Proper alt text for accessibility
 */
export function SanityImage({
  image,
  alt,
  width = 800,
  height = 600,
  sizes,
  priority = false,
  className = '',
  objectFit = 'cover',
  onLoad,
}: SanityImageProps) {
  if (!image?.asset?.url) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 dark:bg-gray-800 ${className}`}
        style={{ aspectRatio: `${width}/${height}` }}
        role="img"
        aria-label={alt}
      >
        <span className="text-sm text-gray-500 dark:text-gray-400">Image unavailable</span>
      </div>
    )
  }

  const imageUrl = urlFor(image)
  const blurUrl = urlForBlur(image)
  const dimensions = getImageDimensions(image)

  // Calculate aspect ratio
  const aspectRatio = dimensions?.aspectRatio || width / height
  const calculatedHeight = Math.round(width / aspectRatio)

  // Default responsive sizes
  const defaultSizes =
    '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, (max-width: 1280px) 50vw, 800px'

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={calculatedHeight}
      sizes={sizes || defaultSizes}
      priority={priority}
      placeholder={blurUrl ? 'blur' : 'empty'}
      blurDataURL={blurUrl}
      className={className}
      style={{
        objectFit,
        width: '100%',
        height: 'auto',
      }}
      onLoadingComplete={onLoad}
      quality={85}
    />
  )
}

/**
 * SanityImage Wrapper - For use in blog posts and content
 * Smaller component for flexible sizing
 */
export function SanityImageResponsive({
  image,
  alt,
  className = '',
}: {
  image: SanityImageType | null | undefined
  alt: string
  className?: string
}) {
  if (!image?.asset?.url) return null

  const imageUrl = urlFor(image)
  const blurUrl = urlForBlur(image)

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={1000}
      height={600}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
      placeholder={blurUrl ? 'blur' : 'empty'}
      blurDataURL={blurUrl}
      className={className}
      style={{
        width: '100%',
        height: 'auto',
      }}
      quality={85}
    />
  )
}

/**
 * Cover Image for Posts
 * Square aspect ratio for hero/cover images
 */
export function SanityCoverImage({
  image,
  alt,
  priority = false,
}: {
  image: SanityImageType | null | undefined
  alt: string
  priority?: boolean
}) {
  if (!image?.asset?.url) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800">
        <span className="text-gray-500 dark:text-gray-400">Image unavailable</span>
      </div>
    )
  }

  const imageUrl = urlFor(image)
  const blurUrl = urlForBlur(image)

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={1200}
      height={630}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
      priority={priority}
      placeholder={blurUrl ? 'blur' : 'empty'}
      blurDataURL={blurUrl}
      className="h-auto w-full rounded-lg object-cover"
      quality={85}
    />
  )
}

/**
 * Avatar Image for Authors
 * Small, square image for user avatars
 */
export function SanityAvatar({
  image,
  alt,
  size = 48,
  className = '',
}: {
  image: SanityImageType | null | undefined
  alt: string
  size?: number
  className?: string
}) {
  if (!image?.asset?.url) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        role="img"
        aria-label={alt}
      >
        <span className="text-xs text-gray-600 dark:text-gray-400">No image</span>
      </div>
    )
  }

  const imageUrl = urlFor(image)
  const blurUrl = urlForBlur(image)

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      placeholder={blurUrl ? 'blur' : 'empty'}
      blurDataURL={blurUrl}
      quality={85}
    />
  )
}
