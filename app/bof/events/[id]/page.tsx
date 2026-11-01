import { notFound } from 'next/navigation'
import { StreamControl } from '@/components/StreamControl'
import { findEvent } from '@/lib/mock'

export default async function BofEventPage({ params }: { params: Promise<{ id: string }> }) {
  const event = findEvent((await params).id)
  if (!event) notFound()
  return <StreamControl event={event} />
}
