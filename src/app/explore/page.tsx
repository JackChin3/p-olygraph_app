'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '../../utils/supabase' // Import the shared client
import ExploreVideoDisplay from '@/components/ExploreVideoDisplay'

const supabase = createBrowserClient() // Use the shared browser client instance

const Explore = ({}: {}) => {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)

        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData.session) {
          console.error('No active session found')
          return
        }

        // Fetch user
        const { data: userData, error: userError } =
          await supabase.auth.getUser()
        if (userError || !userData.user) {
          console.error('User not found:', userError)
          return
        }

        const user = userData.user

        const { data, error } = await supabase
          .from('video_info')
          .select()
          .eq('public', true) // Ensure the video is public
          .not('title', 'ilike', user.id) // Exclude videos with the user's ID in the title

        if (error) {
          console.error('Error fetching videos: ', error)
        } else {
          setVideos(data)
        }
      } catch (error) {
        console.error('Unexpected error: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Explore Videos</h1>
      <div className="grid flex-col items-center justify-center gap-4">
        {videos.map((video, index) => {
          console.log(video.public_url) // Debug statement
          return (
            <div key={index} className="p-2">
              <ExploreVideoDisplay
                videoUrl={video.public_url}
                filename={video.title}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Explore
