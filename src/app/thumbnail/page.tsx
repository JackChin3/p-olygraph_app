// app/thumbnail/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '../../utils/supabase' // Import the shared client

const supabase = createBrowserClient() // Use the shared browser client instance

export default function ThumbnailsPage() {
  const [videoUrls, setVideoUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true) // State to track loading

  useEffect(() => {
    const fetchUserAndVideos = async () => {
      // First, check if there's a session available
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        console.error('No active session found')
        setIsLoading(false)
        return
      }

      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        console.error('User not found:', userError)
        setIsLoading(false)
        return
      }

      const user = userData.user
      console.log('User:', user)

      // Fetch the user's videos from Supabase storage
      const { data, error } = await supabase.storage.from('videos').list()
      if (error) {
        console.error('Error fetching videos:', error)
      } else {
        const userVideos = data.filter((file) => file.name.includes(user.id))
        const urls = await Promise.all(
          userVideos.map(async (file) => {
            const { data: publicUrlData } = supabase.storage
              .from('videos')
              .getPublicUrl(file.name)
            return publicUrlData?.publicUrl || ''
          }),
        )
        setVideoUrls(urls.filter((url) => url)) // Filter out any empty URLs
      }
      setIsLoading(false)
    }

    // Add a listener for auth state changes to handle delayed session loading
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUserAndVideos() // Retry fetching when auth state changes
    })

    // Call fetch function immediately on component mount
    fetchUserAndVideos()

    // Clean up auth listener when component unmounts
    // return () => {
    //   authListener?.unsubscribe()
    // }
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-4 text-2xl font-bold">Your Videos</h1>
      {isLoading ? (
        <p>Loading...</p> // Show loading state
      ) : (
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
      )}
    </div>
  )
}
