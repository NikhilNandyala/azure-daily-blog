import { PortableText as PortableTextComponent } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import { PortableTextContent } from '@/lib/sanity/types'

interface PortableTextProps {
  value: PortableTextContent[]
}

export function SanityPortableText({ value }: PortableTextProps) {
  return (
    <article className="prose prose-lg prose-invert mx-auto max-w-none">
      <PortableTextComponent value={value} components={portableTextComponents} />
    </article>
  )
}
