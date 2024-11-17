'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '../../utils/supabase' // Import the shared client
import ThumbnailVideoDisplay from '@/components/ThumbnailVideoDisplay'

const supabase = createBrowserClient() // Use the shared browser client instance

export default function ThumbnailsPage() {
  const [videos, setVideos] = useState<{ title: string; publicUrl: string }[]>(
    [],
  )
  const [isLoading, setIsLoading] = useState(true) // State to track loading

  useEffect(() => {
    const fetchUserAndVideos = async () => {
      // Fetch session
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        console.error('No active session found')
        setIsLoading(false)
        return
      }

      // Fetch user
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        console.error('User not found:', userError)
        setIsLoading(false)
        return
      }

      const user = userData.user

      // Fetch user's videos
      const { data, error } = await supabase.storage.from('videos').list()
      if (error) {
        console.error('Error fetching videos:', error)
      } else {
        const userVideos = data.filter((file) => file.name.includes(user.id))
        const videoData = await Promise.all(
          userVideos.map(async (file) => {
            const { data: publicUrlData } = supabase.storage
              .from('videos')
              .getPublicUrl(file.name)
            return {
              title: file.name,
              publicUrl: publicUrlData?.publicUrl || '',
            }
          }),
        )
        setVideos(videoData.filter((video) => video.publicUrl)) // Filter out invalid videos
      }
      setIsLoading(false)
    }

    fetchUserAndVideos()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-4 text-2xl font-bold">Your Videos</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {videos.map((video, index) => (
            <div key={index} className="p-2">
              <ThumbnailVideoDisplay
                videoUrl={video.publicUrl}
                filename={video.title}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
