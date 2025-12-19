'use client'

import { Studio } from 'sanity'
import config from '../../sanity.config'

const sanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET
)

export default function StudioWrapper() {
  if (!sanityConfigured) {
    return (
      <div style={{ padding: '40px', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h1>Sanity Studio Not Configured</h1>
        <p>
          To use Sanity Studio, please set the following environment variables in your deployment:
        </p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>
            <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>
          </li>
          <li>
            <code>NEXT_PUBLIC_SANITY_DATASET</code>
          </li>
        </ul>
        <p>
          Get these values from <a href="https://www.sanity.io/manage">sanity.io/manage</a>
        </p>
      </div>
    )
  }

  return <Studio config={config} />
}
