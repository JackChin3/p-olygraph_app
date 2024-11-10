// app/thumbnail/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export default function ThumbnailsPage() {
  const [videoUrls, setVideoUrls] = useState<string[]>([])

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase.storage.from('videos').list()
      if (error) {
        console.error('Error fetching videos:', error)
      } else {
        const urls = await Promise.all(
          data.map(async (file) => {
            const { data: publicUrlData } = supabase.storage
              .from('videos')
              .getPublicUrl(file.name)
            return publicUrlData?.publicUrl || ''
          }),
        )
        setVideoUrls(urls.filter((url) => url)) // Filter out any empty URLs
      }
    }

    fetchVideos()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-4 text-2xl font-bold">Your Videos</h1>
      <div className="grid grid-cols-3 gap-4">
        {videoUrls.map((url, index) => (
          <div
            key={index}
            className="aspect-video w-full overflow-hidden rounded bg-gray-200"
          >
            <video
              className="h-full w-full object-contain"
              controls
              src={url}
              playsInline
            />
          </div>
        ))}
      </div>
    </div>
  )
}
