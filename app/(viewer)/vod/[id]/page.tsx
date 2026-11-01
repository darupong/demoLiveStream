import { notFound } from 'next/navigation'
import { VodPage } from '@/components/VodPage'
import { archivedEvent } from '@/lib/fighters'
import { findEvent } from '@/lib/mock'

export default async function VodRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = findEvent(id) ?? archivedEvent(id)
  if (!event) notFound()
  return <VodPage event={event} />
}
