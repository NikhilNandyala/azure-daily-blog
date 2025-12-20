import { PortableText as PortableTextComponent, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import Link from '@/components/Link'
import { CodeBlock } from '@/components/CodeBlock'
import { PortableTextContent } from '@/lib/sanity/types'

/**
 * Custom serializers for PortableText (Sanity rich text)
 * Handles rendering of blocks, marks, and list items with Next.js components
 */
const portableTextComponents: PortableTextComponents = {
  block: {
    // Headings with proper spacing and styling
    h1: ({ children }) => (
      <h1 className="text-body mt-12 mb-6 scroll-mt-20 text-4xl leading-tight font-extrabold md:text-5xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-body mt-10 mb-4 scroll-mt-20 text-3xl leading-snug font-bold md:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-body mt-8 mb-3 scroll-mt-20 text-2xl leading-snug font-bold md:text-3xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-body mt-6 mb-3 scroll-mt-20 text-xl leading-snug font-bold md:text-2xl">
        {children}
      </h4>
    ),
    // Normal paragraphs with optimal line height
    normal: ({ children }) => <p className="text-body mb-6 text-lg leading-relaxed">{children}</p>,
    // Blockquotes with accent border
    blockquote: ({ children }) => (
      <blockquote className="border-accent text-muted my-6 border-l-4 bg-gray-100 py-4 pl-6 italic dark:bg-gray-800">
        {children}
      </blockquote>
    ),
  },

  // Text marks
  marks: {
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-gray-800 px-2 py-1 font-mono text-sm text-pink-400">
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
          className="text-accent decoration-accent/30 hover:decoration-accent font-medium underline underline-offset-2 transition-colors"
        >
          {children}
        </Link>
      )
    },
  },

  // Lists with better spacing
  list: {
    bullet: ({ children }) => (
      <ul className="text-body mb-6 ml-6 list-disc space-y-2 text-lg leading-relaxed">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-body mb-6 ml-6 list-decimal space-y-2 text-lg leading-relaxed">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="text-body pl-2">{children}</li>,
    number: ({ children }) => <li className="text-body pl-2">{children}</li>,
  },

  // Images and Code blocks
  types: {
    image: ({ value }) => {
      if (!value?.asset?.url) return null

      return (
        <figure className="my-8">
          <div className="relative h-96 w-full overflow-hidden rounded-lg">
            <Image
              src={value.asset.url}
              alt={value.alt || 'Post image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
            />
          </div>
          {value.caption && (
            <figcaption className="text-muted mt-3 text-center text-sm italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    code: ({ value }) => {
      return <CodeBlock value={value} />
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
    <article className="prose prose-lg prose-invert mx-auto max-w-none">
      <PortableTextComponent value={value} components={portableTextComponents} />
    </article>
  )
}
