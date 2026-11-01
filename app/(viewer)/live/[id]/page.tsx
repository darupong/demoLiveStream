import { notFound } from 'next/navigation'
import { LivePage } from '@/components/LivePage'
import { findEvent } from '@/lib/mock'

export default async function LiveRoute({ params }: { params: Promise<{ id: string }> }) {
  const event = findEvent((await params).id)
  if (!event) notFound()
  return <LivePage event={event} />
}
