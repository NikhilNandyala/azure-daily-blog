'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import Image from 'next/image'
import Link from '@/components/Link'
import { MermaidDiagram } from '@/components/MermaidDiagram'
import { CopyButton } from '@/components/CopyButton'
import imageUrlBuilder from '@sanity/image-url'

type SanityImageSource = string | { _ref: string; _type: string } | { asset: { _ref: string } }

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

export function PostBody({ content }: PostBodyProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="prose prose-lg dark:prose-invert max-w-none">Loading...</div>
  }

  return (
    <article className="prose prose-lg dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-bold prose-h1:text-4xl prose-h1:text-[#ffeaa0] prose-h2:text-3xl prose-h2:text-[#ffeaa0] prose-h3:text-2xl prose-h3:text-[#ffeaa0] prose-h4:text-xl prose-h4:text-[#ffeaa0] prose-p:text-[#b8a882] prose-p:leading-relaxed prose-a:text-[#f0a500] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#ffeaa0] prose-code:text-[#ffd166] prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-[#c8860a] prose-blockquote:bg-gray-800/50 prose-blockquote:text-[#b8a882] prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-lg prose-table:border-collapse prose-th:bg-gray-800 prose-th:text-[#ffeaa0] prose-th:border prose-th:border-gray-700 prose-td:border prose-td:border-gray-700 prose-td:text-[#b8a882] max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw, rehypeSlug]}
        components={{
          h1: ({ children, id }) => (
            <h1 id={id} className="mt-12 mb-6 text-4xl font-extrabold text-[#ffeaa0]">
              {children}
            </h1>
          ),
          h2: ({ children, id }) => (
            <h2 id={id} className="mt-10 mb-4 text-3xl font-bold text-[#ffeaa0]">
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3 id={id} className="mt-8 mb-3 text-2xl font-bold text-[#ffeaa0]">
              {children}
            </h3>
          ),
          h4: ({ children, id }) => (
            <h4 id={id} className="mt-6 mb-3 text-xl font-bold text-[#ffeaa0]">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="mb-6 text-lg leading-relaxed text-[#b8a882]">{children}</p>
          ),

          a: ({ href, children }) => {
            const isExternal = href?.startsWith('http')
            if (isExternal) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f0a500] hover:underline"
                >
                  {children}
                </a>
              )
            }
            return (
              <Link href={href || '#'} className="text-[#f0a500] hover:underline">
                {children}
              </Link>
            )
          },

          img: ({ src, alt }) => {
            if (!src) return null
            const isSanityImage = src.startsWith('image-')
            const imageUrl = isSanityImage ? urlFor(src).width(1200).quality(80).url() : src
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
          },

          code: ({
            className,
            children,
          }: {
            className?: string
            children?: React.ReactNode
            node?: unknown
          }) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            const code = String(children).replace(/\n$/, '')

            if (!className) {
              return (
                <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-sm text-pink-400">
                  {children}
                </code>
              )
            }

            if (language === 'mermaid') {
              return <MermaidDiagram chart={code} />
            }

            return (
              <div className="relative my-6">
                <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                  {language && (
                    <span className="rounded bg-gray-800 px-2 py-1 font-mono text-xs text-gray-400">
                      {language}
                    </span>
                  )}
                  <CopyButton text={code} />
                </div>
                <pre className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-900 p-4 pt-10">
                  <code className={className}>{children}</code>
                </pre>
              </div>
            )
          },

          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-blue-500 bg-gray-800/50 py-4 pl-6 text-gray-300 italic">
              {children}
            </blockquote>
          ),

          ul: ({ children }) => (
            <ul className="mb-6 ml-6 list-disc space-y-2 text-lg text-gray-300">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 ml-6 list-decimal space-y-2 text-lg text-gray-300">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-2 text-gray-300">{children}</li>,

          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-700 text-left">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-800">{children}</thead>,
          th: ({ children }) => (
            <th className="border border-gray-700 px-4 py-2 font-bold text-white">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-700 px-4 py-2 text-gray-300">{children}</td>
          ),

          hr: () => <hr className="my-8 border-gray-700" />,

          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
