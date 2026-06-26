import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Azure Daily Blog'
  const author = searchParams.get('author') || ''

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0B1220',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Accent gradient strip at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(to right, #38BDF8, #3B82F6)',
          }}
        />

        {/* Site name */}
        <div
          style={{
            color: '#38BDF8',
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: '16px',
            marginBottom: '40px',
          }}
        >
          Azure Daily Blog
        </div>

        {/* Post title */}
        <div
          style={{
            color: '#F1F5F9',
            fontSize: title.length > 60 ? '38px' : '52px',
            fontWeight: 800,
            lineHeight: 1.2,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {title}
        </div>

        {/* Author + bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '24px',
            marginTop: '24px',
          }}
        >
          {author ? (
            <div style={{ color: '#94A3B8', fontSize: '18px' }}>By {author}</div>
          ) : (
            <div />
          )}
          <div
            style={{
              color: '#475569',
              fontSize: '14px',
              letterSpacing: '0.05em',
            }}
          >
            azuredailyblog.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
