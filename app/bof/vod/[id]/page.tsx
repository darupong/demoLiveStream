import { notFound } from 'next/navigation'
import { VodReview } from '@/components/VodReview'
import { findEvent, vodQueue } from '@/lib/mock'

export default async function BofVodReview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = findEvent(id)
  const item = vodQueue.find((v) => v.eventId === id)
  if (!event || !item) notFound()
  return <VodReview event={event} item={item} />
}
