'use client'
import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@/utils/supabase'
import VideoDisplay from './VideoDisplay'

const supabase = createBrowserClient()

const VideoPlayback: React.FC = () => {
  const [videos, setVideos] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getUserAndFetchVideos = async () => {
      // Retrieve the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error('Error fetching user:', userError.message)
        return
      }

      if (user) {
        setUserId(user.id)
        console.log(user.id)

        try {
          // Fetch all files from the 'videos' bucket
          const { data, error } = await supabase.storage.from('videos').list()

          if (error) {
            console.error('Error fetching videos:', error.message)
            return
          }

          if (data.length === 0) {
            console.log('No videos found in the bucket')
            return
          }

          console.log('Fetched videos:', data)

          // Filter videos by user ID in the filename
          const userVideos = data.filter((file) => file.name.includes(user.id))

          if (userVideos.length === 0) {
            console.log('No videos found for the user')
            return
          }

          console.log('User videos:', userVideos)

          // Generate public URLs for each file
          const videoUrls = userVideos.map((file) => {
            const { publicUrl } = supabase.storage
              .from('videos')
              .getPublicUrl(file.name).data
            console.log('Generated public URL:', publicUrl)
            return publicUrl
          })

          setVideos(videoUrls)
        } catch (error) {
          console.error('Error fetching videos:', error)
        }
      } else {
        console.error('User not authenticated')
      }
    }

    getUserAndFetchVideos()
  }, [])

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Your Videos</h1>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((url, index) => (
          <div key={index} className="p-2">
            <VideoDisplay videoUrl={url} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default VideoPlayback
