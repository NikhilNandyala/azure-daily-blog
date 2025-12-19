'use client'

import dynamic from 'next/dynamic'

const StudioComponent = dynamic(() => import('./studio-wrapper'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>Loading Sanity Studio...</div>
  ),
})

export default function StudioPage() {
  return <StudioComponent />
}
