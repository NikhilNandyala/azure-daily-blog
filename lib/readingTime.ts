import { PortableTextContent } from './sanity/types'

function extractTextFromBlocks(blocks: PortableTextContent[]): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b) => b?._type === 'block')
    .map((b) =>
      (b.children || [])
        .filter((c: { _type: string }) => c._type === 'span')
        .map((c: { text?: string }) => c.text || '')
        .join('')
    )
    .join(' ')
}

function extractTextFromMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>#|]/g, ' ')
}

export function readingTime(content: PortableTextContent[] | string): number {
  const text =
    typeof content === 'string'
      ? extractTextFromMarkdown(content)
      : extractTextFromBlocks(content)

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}
