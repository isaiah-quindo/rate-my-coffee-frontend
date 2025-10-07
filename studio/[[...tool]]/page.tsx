// app/studio/[[...tool]]/page.tsx
'use client'

import dynamic from 'next/dynamic'
import config from '../../sanity.config' // adjust import path if needed

// lazy-load NextStudio so it only runs client-side
const NextStudio = dynamic(() => import('next-sanity/studio').then((m) => m.NextStudio), {
  ssr: false,
})

export default function StudioPage() {
  return <NextStudio config={config} />
}
