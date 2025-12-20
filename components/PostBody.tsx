'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import Image from 'next/image'
import Link from '@/components/Link'
import { MermaidDiagram } from '@/components/MermaidDiagram'
import imageUrlBuilder from '@sanity/image-url'

type SanityImageSource = string | { _ref: string; _type: string } | { asset: { _ref: string } }

// Initialize Sanity image URL builder
const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
})

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

interface PostBodyProps {
  content: string
}

/**
 * PostBody - Renders Markdown/MDX content with syntax highlighting, Mermaid diagrams, and proper styling
 *
 * Features:
 * - GitHub-flavored Markdown (tables, task lists, strikethrough)
 * - Syntax highlighting for code blocks
 * - Mermaid diagram rendering
 * - Sanity image URL support
 * - Dark theme optimized
 * - Next.js Image optimization
 */
export function PostBody({ content }: PostBodyProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="prose prose-lg dark:prose-invert max-w-none">Loading...</div>
  }

  return (
    <article className="prose prose-lg dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-bold prose-h1:text-4xl prose-h1:text-white prose-h2:text-3xl prose-h2:text-white prose-h3:text-2xl prose-h3:text-white prose-h4:text-xl prose-h4:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-pink-400 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-800/50 prose-blockquote:text-gray-300 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-lg prose-table:border-collapse prose-th:bg-gray-800 prose-th:text-white prose-th:border prose-th:border-gray-700 prose-td:border prose-td:border-gray-700 prose-td:text-gray-300 max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom heading components with anchors
          h1: ({ children, ...props }) => (
            <h1 className="mt-12 mb-6 text-4xl font-extrabold text-white" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="mt-10 mb-4 text-3xl font-bold text-white" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="mt-8 mb-3 text-2xl font-bold text-white" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="mt-6 mb-3 text-xl font-bold text-white" {...props}>
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children, ...props }) => (
            <p className="mb-6 text-lg leading-relaxed text-gray-300" {...props}>
              {children}
            </p>
          ),

          // Links - use Next.js Link component
          a: ({ href, children, ...props }) => {
            const isExternal = href?.startsWith('http')
            const isAnchor = href?.startsWith('#')

            if (isExternal) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                  {...props}
                >
                  {children}
                </a>
              )
            }

            return (
              <Link href={href || '#'} className="text-blue-400 hover:underline">
                {children}
              </Link>
            )
          },

          // Images - handle both regular and Sanity images
          img: ({ src, alt, ...props }) => {
            if (!src) return null

            // Check if it's a Sanity image reference (starts with 'image-')
            const isSanityImage = src.startsWith('image-')

            if (isSanityImage) {
              const imageUrl = urlFor(src).width(1200).quality(80).url()
              return (
                <figure className="my-8">
                  <div className="relative h-96 w-full overflow-hidden rounded-lg">
                    <Image
                      src={imageUrl}
                      alt={alt || 'Blog post image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                    />
                  </div>
                  {alt && (
                    <figcaption className="mt-3 text-center text-sm text-gray-400 italic">
                      {alt}
                    </figcaption>
                  )}
                </figure>
              )
            }

            // Regular image URL
            return (
              <figure className="my-8">
                <div className="relative h-96 w-full overflow-hidden rounded-lg">
                  <Image
                    src={src}
                    alt={alt || 'Blog post image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                  />
                </div>
                {alt && (
                  <figcaption className="mt-3 text-center text-sm text-gray-400 italic">
                    {alt}
                  </figcaption>
                )}
              </figure>
            )
          },

          // Code blocks - detect Mermaid
          code: ({
            className,
            children,
            ...props
          }: {
            className?: string
            children?: React.ReactNode
            node?: unknown
          }) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            const code = String(children).replace(/\n$/, '')

            // Check if this is inline code (no className means inline)
            if (!className) {
              return (
                <code
                  className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-sm text-pink-400"
                  {...props}
                >
                  {children}
                </code>
              )
            }

            // Mermaid diagrams
            if (language === 'mermaid') {
              return <MermaidDiagram chart={code} />
            }

            // Regular code blocks with syntax highlighting
            return (
              <div className="relative my-6">
                {language && (
                  <div className="absolute top-2 right-2 rounded bg-gray-800 px-2 py-1 font-mono text-xs text-gray-400">
                    {language}
                  </div>
                )}
                <pre className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            )
          },

          // Blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-6 border-l-4 border-blue-500 bg-gray-800/50 py-4 pl-6 text-gray-300 italic"
              {...props}
            >
              {children}
            </blockquote>
          ),

          // Lists
          ul: ({ children, ...props }) => (
            <ul className="mb-6 ml-6 list-disc space-y-2 text-lg text-gray-300" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="mb-6 ml-6 list-decimal space-y-2 text-lg text-gray-300" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="pl-2 text-gray-300" {...props}>
              {children}
            </li>
          ),

          // Tables
          table: ({ children, ...props }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-700 text-left" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-gray-800" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th className="border border-gray-700 px-4 py-2 font-bold text-white" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-gray-700 px-4 py-2 text-gray-300" {...props}>
              {children}
            </td>
          ),

          // Horizontal rule
          hr: (props) => <hr className="my-8 border-gray-700" {...props} />,

          // Strong and emphasis
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-white" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic" {...props}>
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
