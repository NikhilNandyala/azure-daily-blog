'use client'

import { useMDXComponent } from 'next-contentlayer2/hooks'
import { mdxComponents } from '@/components/mdx/MDXComponents'

interface MDXRendererProps {
  code: string
}

export function MDXRenderer({ code }: MDXRendererProps) {
  const MDXContent = useMDXComponent(code)
  return <MDXContent components={mdxComponents} />
}
