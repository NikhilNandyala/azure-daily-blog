import { Metadata } from 'next'
import Link from '@/components/Link'
import { ContactLinks } from './ContactLinks'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with AzureFixes — questions, feedback, or collaboration.',
}

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 24px' }}>
      <nav aria-label="Breadcrumb" style={{ marginBottom: '32px' }}>
        <ol
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: 'var(--muted)',
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          <li>
            <Link href="/" style={{ color: 'var(--muted)' }}>
              Home
            </Link>
          </li>
          <li aria-hidden="true" style={{ color: 'rgba(200,134,10,0.4)' }}>
            /
          </li>
          <li style={{ color: 'var(--text)' }} aria-current="page">
            Contact
          </li>
        </ol>
      </nav>

      <h1
        style={{
          color: '#ffeaa0',
          fontSize: '2rem',
          fontWeight: 800,
          marginBottom: '8px',
          lineHeight: 1.2,
        }}
      >
        Get in touch
      </h1>
      <p
        style={{
          color: '#b8a882',
          fontSize: '14px',
          lineHeight: 1.7,
          marginBottom: '40px',
        }}
      >
        Have a question, found an error, or want to collaborate? Reach out via any of the channels
        below.
      </p>

      <ContactLinks />
    </div>
  )
}
