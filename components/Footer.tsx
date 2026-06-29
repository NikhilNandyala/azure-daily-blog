'use client'

import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 10,
        borderTop: '0.5px solid rgba(200,134,10,0.2)',
        background: 'linear-gradient(135deg, rgba(10,22,40,0.97), rgba(5,13,26,0.99))',
        marginTop: '80px',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #c8860a, #f0a500, transparent)',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 36px 28px' }}>
        {/* 3-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr',
            gap: '40px',
            marginBottom: '36px',
            paddingBottom: '32px',
            borderBottom: '0.5px solid rgba(200,134,10,0.12)',
          }}
        >
          {/* Col 1 — Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(135deg, #0078d4, #00bcf2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '16px',
                  color: '#fff',
                  boxShadow: '0 0 16px rgba(0,120,212,0.3)',
                  flexShrink: 0,
                }}
              >
                A
              </div>
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#ffeaa0',
                    letterSpacing: '.04em',
                  }}
                >
                  AZUREFIXES
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: '#6a5a3a',
                    letterSpacing: '.08em',
                  }}
                >
                  DEBUG FASTER. DEPLOY SMARTER.
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: '12px',
                color: '#8a7a5a',
                lineHeight: 1.7,
                maxWidth: '280px',
                marginBottom: '20px',
              }}
            >
              Daily deep-dives on Azure networking, IaC, cloud architecture, and AI engineering.
              Real problems from production, with real fixes.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
              <SocialIcon kind="github" href={siteMetadata.github} size={5} />
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
              <SocialIcon kind="x" href={siteMetadata.x} size={5} />
              <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={5} />
              <SocialIcon kind="youtube" href={siteMetadata.youtube} size={5} />
            </div>
          </div>

          {/* Col 2 — Explore */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#ffeaa0',
                letterSpacing: '.08em',
                textTransform: 'uppercase' as const,
                marginBottom: '14px',
              }}
            >
              Explore
            </div>
            {[
              { label: 'Blog', href: '/blog' },
              { label: 'Projects', href: '/projects' },
              { label: 'Tags', href: '/tags' },
              { label: 'RSS Feed', href: '/feed.xml' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'block',
                  fontSize: '13px',
                  color: '#8a7a5a',
                  marginBottom: '10px',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f0a500')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#8a7a5a')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Col 3 — Company */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#ffeaa0',
                letterSpacing: '.08em',
                textTransform: 'uppercase' as const,
                marginBottom: '14px',
              }}
            >
              Company
            </div>
            {[
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'block',
                  fontSize: '13px',
                  color: '#8a7a5a',
                  marginBottom: '10px',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f0a500')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#8a7a5a')}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', color: '#6a5a3a', fontStyle: 'italic' }}>
            &ldquo;Debug Faster.{' '}
            <span style={{ color: '#f0a500' }}>Deploy Smarter.&rdquo;</span>
          </span>
        </div>

        {/* Bottom bar */}
        <div style={{
          textAlign: 'center',
          paddingTop: '16px',
          borderTop: '0.5px solid rgba(200,134,10,0.1)',
        }}>
          <div style={{ fontSize: '12px', color: '#6a5a3a', letterSpacing: '0.02em' }}>
            © {new Date().getFullYear()} AzureFixes · Built by NVN
          </div>
        </div>
      </div>
    </footer>
  )
}
