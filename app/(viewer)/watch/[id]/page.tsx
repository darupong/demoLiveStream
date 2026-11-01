import { notFound } from 'next/navigation'
import { WatchPage } from '@/components/WatchPage'
import { findVideo } from '@/lib/library'

export default async function WatchRoute({ params }: { params: Promise<{ id: string }> }) {
  const video = findVideo((await params).id)
  if (!video) notFound()
  return <WatchPage key={video.id} video={video} />
}
