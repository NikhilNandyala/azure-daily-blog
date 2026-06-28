'use client'

import dynamic from 'next/dynamic'

const Background3D = dynamic(() => import('./Background3D'), { ssr: false })

export default function Background3DClient() {
  return <Background3D />
}
