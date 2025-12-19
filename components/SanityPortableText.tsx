import { PortableText as PortableTextComponent, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import Link from '@/components/Link'
import { PortableTextContent } from '@/lib/sanity/types'

/**
 * Custom serializers for PortableText (Sanity rich text)
 * Handles rendering of blocks, marks, and list items with Next.js components
 */
const portableTextComponents: PortableTextComponents = {
  block: {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-body mt-8 mb-4 text-3xl font-bold md:text-4xl">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-body mt-6 mb-3 text-2xl font-bold md:text-3xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-body mt-5 mb-2 text-xl font-bold md:text-2xl">{children}</h3>
    ),
    h4: ({ children }) => <h4 className="text-body mt-4 mb-2 text-lg font-bold">{children}</h4>,
    // Normal paragraphs
    normal: ({ children }) => <p className="text-body mb-4 leading-relaxed">{children}</p>,
    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-accent text-muted my-4 border-l-4 bg-gray-100 py-2 pl-4 italic dark:bg-gray-900">
        {children}
      </blockquote>
    ),
  },

  // Text marks
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="text-accent rounded bg-gray-100 px-2 py-1 font-mono text-sm dark:bg-gray-800">
        {children}
      </code>
    ),
    underline: ({ children }) => <u className="underline">{children}</u>,
    'strike-through': ({ children }) => <s className="line-through">{children}</s>,
    link: ({ value, children }) => {
      const target = value?.href?.startsWith('http') ? '_blank' : undefined
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined

      return (
        <Link
          href={value?.href || '#'}
          target={target}
          rel={rel}
          className="text-accent hover:underline"
        >
          {children}
        </Link>
      )
    },
  },

  // Lists
  list: {
    bullet: ({ children }) => (
      <ul className="text-body mb-4 ml-2 list-inside list-disc space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="text-body mb-4 ml-2 list-inside list-decimal space-y-2">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="text-body">{children}</li>,
    number: ({ children }) => <li className="text-body">{children}</li>,
  },

  // Images
  types: {
    image: ({ value }) => {
      if (!value?.asset?.url) return null

      return (
        <figure className="my-6">
          <div className="relative h-96 w-full">
            <Image
              src={value.asset.url}
              alt={value.alt || 'Post image'}
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 100vw"
            />
          </div>
          {value.caption && (
            <figcaption className="text-muted mt-2 text-center text-sm">{value.caption}</figcaption>
          )}
        </figure>
      )
    },
  },
}

interface PortableTextProps {
  value: PortableTextContent[]
}

/**
 * Wrapper component for rendering Sanity PortableText (rich text)
 * Use this in your post detail pages
 */
export function SanityPortableText({ value }: PortableTextProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <PortableTextComponent value={value} components={portableTextComponents} />
    </div>
  )
}
