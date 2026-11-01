import { notFound } from 'next/navigation'
import { EventDetail } from '@/components/EventDetail'
import { findEvent } from '@/lib/mock'

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const event = findEvent((await params).id)
  if (!event) notFound()
  return <EventDetail event={event} />
}
