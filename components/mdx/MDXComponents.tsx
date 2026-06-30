import { ReactNode } from 'react'
import { MDXCodeBlock } from '@/components/MDXCodeBlock'

type Props = { children?: ReactNode; className?: string; href?: string; src?: string; alt?: string; [key: string]: unknown }

export const mdxComponents = {
  h1: ({ children }: Props) => (
    <h1 style={{ color: '#ffeaa0', fontWeight: 800, fontSize: '1.875rem', lineHeight: 1.3, margin: '2rem 0 1rem' }}>
      {children}
    </h1>
  ),
  h2: ({ children }: Props) => (
    <h2 style={{ color: '#ffeaa0', fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.3, margin: '2.5rem 0 1rem', paddingBottom: '.5rem', borderBottom: '1px solid rgba(200,134,10,0.2)' }}>
      {children}
    </h2>
  ),
  h3: ({ children }: Props) => (
    <h3 style={{ color: '#d4a843', fontWeight: 600, fontSize: '1.2rem', margin: '2rem 0 .75rem' }}>
      {children}
    </h3>
  ),
  p: ({ children }: Props) => (
    <p style={{ color: '#b8a882', lineHeight: 1.85, marginBottom: '1.25rem', fontSize: '1.0625rem' }}>
      {children}
    </p>
  ),
  a: ({ children, href }: Props) => (
    <a
      href={href as string}
      style={{ color: '#f0a500', textDecoration: 'underline', textDecorationColor: 'rgba(240,165,0,0.4)' }}
      target={typeof href === 'string' && href.startsWith('http') ? '_blank' : undefined}
      rel={typeof href === 'string' && href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  code: ({ children, className }: Props) => {
    if (className) {
      return <code className={className as string}>{children}</code>
    }
    return (
      <code style={{ background: 'rgba(200,134,10,0.1)', border: '0.5px solid rgba(200,134,10,0.3)', color: '#ffd166', borderRadius: 4, padding: '2px 6px', fontSize: '0.875em', fontFamily: 'monospace', wordBreak: 'break-word', whiteSpace: 'break-spaces' }}>
        {children}
      </code>
    )
  },
  pre: ({ children }: Props) => <MDXCodeBlock>{children}</MDXCodeBlock>,
  blockquote: ({ children }: Props) => (
    <blockquote style={{ borderLeft: '3px solid #c8860a', paddingLeft: '1.25rem', margin: '1.75rem 0', color: '#8a7a5a', fontStyle: 'italic', fontSize: '1.0625rem', lineHeight: 1.7 }}>
      {children}
    </blockquote>
  ),
  ul: ({ children }: Props) => (
    <ul style={{ color: '#b8a882', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: 1.8 }}>
      {children}
    </ul>
  ),
  ol: ({ children }: Props) => (
    <ol style={{ color: '#b8a882', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: 1.8 }}>
      {children}
    </ol>
  ),
  li: ({ children }: Props) => (
    <li style={{ marginBottom: '.4rem', fontSize: '1.0625rem', lineHeight: 1.8 }}>{children}</li>
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: '1px solid rgba(200,134,10,0.2)', margin: '2rem 0' }} />
  ),
  strong: ({ children }: Props) => (
    <strong style={{ color: '#ffeaa0', fontWeight: 600 }}>{children}</strong>
  ),
  table: ({ children }: Props) => (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'auto', marginBottom: '1.5rem', borderRadius: '10px', border: '0.5px solid rgba(200,134,10,0.2)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', tableLayout: 'auto' }}>
        {children}
      </table>
    </div>
  ),
  th: ({ children }: Props) => (
    <th style={{ color: '#ffeaa0', fontWeight: 600, padding: '8px 12px', borderBottom: '1px solid rgba(200,134,10,0.3)', textAlign: 'left', background: 'rgba(200,134,10,0.06)' }}>
      {children}
    </th>
  ),
  td: ({ children }: Props) => (
    <td style={{ color: '#b8a882', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      {children}
    </td>
  ),
  img: ({ src, alt }: Props) => (
    <img
      src={src as string}
      alt={(alt as string) ?? ''}
      style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', margin: '1.5rem 0', border: '1px solid rgba(200,134,10,0.15)', display: 'block' }}
    />
  ),
}
