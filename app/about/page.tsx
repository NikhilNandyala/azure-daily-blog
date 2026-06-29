import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | AzureFixes',
  description:
    'AzureFixes is a daily technical blog covering real Azure problems encountered in production — with real fixes written by engineers in the field.',
}

const skills = [
  { category: 'Cloud Platform', items: ['Azure Networking', 'ExpressRoute', 'Azure Firewall', 'Virtual WAN', 'Private Endpoints'] },
  { category: 'Infrastructure as Code', items: ['Bicep', 'Terraform', 'ARM Templates', 'Azure Policy', 'GitHub Actions'] },
  { category: 'AI Engineering', items: ['LLM Apps', 'RAG Systems', 'AI Observability', 'Azure OpenAI', 'LangChain'] },
  { category: 'DevOps & Platform', items: ['Azure DevOps', 'AKS', 'Azure Monitor', 'Log Analytics', 'Cost Optimization'] },
]

const stats = [
  { num: '50+', label: 'Posts published' },
  { num: '12k+', label: 'Monthly readers' },
  { num: '3+', label: 'Years in Azure' },
  { num: '100%', label: 'From production' },
]

const timeline = [
  { year: '2025', event: 'Launched AzureFixes', desc: 'Started documenting real Azure problems and fixes from daily engineering work.' },
  { year: '2025', event: 'AI Engineering content', desc: 'Expanded into LLM observability, RAG systems, and AI engineering on Azure.' },
  { year: '2026', event: 'Growing the community', desc: 'Building a resource for Azure engineers who want real solutions, not just documentation.' },
]

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 24px' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,31,56,0.97), rgba(10,22,40,0.98))',
        border: '1px solid rgba(200,134,10,0.3)',
        borderRadius: '16px',
        padding: '40px 44px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, #c8860a, #f0a500, #ffd166, transparent)',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '28px', flexWrap: 'wrap' }}>

          <div style={{
            width: '80px', height: '80px', flexShrink: 0,
            background: 'linear-gradient(135deg, #0078d4, #00bcf2)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: 800, color: '#fff',
            boxShadow: '0 0 32px rgba(0,120,212,0.3)',
          }}>N</div>

          <div style={{ flex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(200,134,10,0.1)',
              border: '0.5px solid rgba(200,134,10,0.3)',
              borderRadius: '20px', padding: '3px 12px',
              fontSize: '11px', color: '#f0a500', marginBottom: '12px',
            }}>
              <span style={{ width: '6px', height: '6px', background: '#f0a500',
                borderRadius: '50%', display: 'inline-block' }} />
              Azure Cloud &amp; AI Engineer
            </div>
            <h1 style={{
              fontSize: '28px', fontWeight: 800, color: '#ffeaa0',
              marginBottom: '6px', lineHeight: 1.2,
            }}>
              Hey, I&apos;m NVN 👋
            </h1>
            <p style={{ fontSize: '14px', color: '#b8a882', lineHeight: 1.7, marginBottom: '16px' }}>
              I&apos;m an Azure cloud engineer who spends most days deep in
              networking configs, IaC pipelines, and increasingly — building
              AI systems on Azure. AzureFixes is where I document everything
              I figure out the hard way, so you don&apos;t have to.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/blog" style={{
                background: 'linear-gradient(135deg, #c8860a, #f0a500)',
                border: 'none', borderRadius: '8px', padding: '9px 20px',
                fontSize: '13px', fontWeight: 600, color: '#fff',
                textDecoration: 'none', display: 'inline-block',
              }}>
                Read the blog →
              </Link>
              <Link href="/contact" style={{
                background: 'transparent',
                border: '1px solid rgba(200,134,10,0.35)',
                borderRadius: '8px', padding: '9px 20px',
                fontSize: '13px', color: '#f0a500',
                textDecoration: 'none', display: 'inline-block',
              }}>
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px', marginBottom: '32px',
      }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: 'linear-gradient(135deg, rgba(15,31,56,0.97), rgba(10,22,40,0.98))',
            border: '1px solid rgba(200,134,10,0.2)',
            borderRadius: '12px', padding: '20px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#f0a500', marginBottom: '4px' }}>
              {s.num}
            </div>
            <div style={{ fontSize: '11px', color: '#8a7a5a', letterSpacing: '0.05em' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,31,56,0.97), rgba(10,22,40,0.98))',
        border: '1px solid rgba(200,134,10,0.25)',
        borderRadius: '14px', padding: '28px 32px', marginBottom: '24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px',
          background: 'linear-gradient(180deg, #c8860a, #f0a500)',
        }} />
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffeaa0', marginBottom: '12px' }}>
          Why AzureFixes?
        </h2>
        <p style={{ fontSize: '13px', color: '#b8a882', lineHeight: 1.8, marginBottom: '12px' }}>
          Azure documentation tells you what things do. AzureFixes tells
          you what breaks — and how to fix it. Every post here comes from
          a real incident, a real architecture decision, or a real mistake
          I made in production.
        </p>
        <p style={{ fontSize: '13px', color: '#b8a882', lineHeight: 1.8 }}>
          The goal is simple: if you&apos;re an Azure engineer hitting a wall,
          you should be able to find the answer here — fast, specific, and
          without wading through 40 pages of official docs.
        </p>
      </div>

      {/* What I write about */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,31,56,0.97), rgba(10,22,40,0.98))',
        border: '1px solid rgba(200,134,10,0.25)',
        borderRadius: '14px', padding: '28px 32px', marginBottom: '24px',
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffeaa0', marginBottom: '20px' }}>
          What I write about
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {skills.map((skill) => (
            <div key={skill.category} style={{
              background: 'rgba(5,13,26,0.5)',
              border: '0.5px solid rgba(200,134,10,0.15)',
              borderRadius: '10px', padding: '16px',
            }}>
              <div style={{
                fontSize: '11px', fontWeight: 600, color: '#f0a500',
                letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px',
              }}>
                {skill.category}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {skill.items.map((item) => (
                  <span key={item} style={{
                    fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                    background: 'rgba(200,134,10,0.08)',
                    border: '0.5px solid rgba(200,134,10,0.25)',
                    color: '#b8a882',
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,31,56,0.97), rgba(10,22,40,0.98))',
        border: '1px solid rgba(200,134,10,0.25)',
        borderRadius: '14px', padding: '28px 32px', marginBottom: '24px',
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffeaa0', marginBottom: '24px' }}>
          The story so far
        </h2>
        <div style={{ position: 'relative', paddingLeft: '24px' }}>
          <div style={{
            position: 'absolute', left: '6px', top: '6px', bottom: '6px', width: '1.5px',
            background: 'linear-gradient(180deg, #f0a500, rgba(200,134,10,0.1))',
          }} />
          {timeline.map((item, i) => (
            <div key={i} style={{
              position: 'relative', marginBottom: i < timeline.length - 1 ? '24px' : 0,
            }}>
              <div style={{
                position: 'absolute', left: '-21px', top: '3px',
                width: '10px', height: '10px',
                background: '#f0a500', borderRadius: '50%',
                border: '2px solid rgba(10,22,40,0.98)',
                boxShadow: '0 0 8px rgba(240,165,0,0.4)',
              }} />
              <div style={{
                fontSize: '10px', color: '#6a5a3a', fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px',
              }}>
                {item.year}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffeaa0', marginBottom: '4px' }}>
                {item.event}
              </div>
              <div style={{ fontSize: '12px', color: '#8a7a5a', lineHeight: 1.6 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(200,134,10,0.08), rgba(240,165,0,0.04))',
        border: '1px solid rgba(200,134,10,0.3)',
        borderRadius: '14px', padding: '28px 32px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, #f0a500, transparent)',
        }} />
        <div style={{ fontSize: '20px', marginBottom: '8px' }}>☕</div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffeaa0', marginBottom: '8px' }}>
          Have an Azure problem I haven&apos;t covered?
        </h2>
        <p style={{ fontSize: '13px', color: '#8a7a5a', marginBottom: '20px', lineHeight: 1.6 }}>
          Send it over. If I&apos;ve hit it, I&apos;ll write it up.
          If I haven&apos;t, I&apos;ll figure it out.
        </p>
        <Link href="/contact" style={{
          background: 'linear-gradient(135deg, #c8860a, #f0a500)',
          borderRadius: '8px', padding: '10px 24px',
          fontSize: '13px', fontWeight: 600, color: '#fff',
          textDecoration: 'none', display: 'inline-block',
        }}>
          Send me a problem →
        </Link>
      </div>

    </div>
  )
}
