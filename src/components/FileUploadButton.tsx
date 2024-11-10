'use client'
import { useRef } from 'react'
import { Button } from './ui/button'
import { createBrowserClient } from '@/utils/supabase'

export const FileUploadButton = ({
  setVideoURL,
}: {
  setVideoURL: (url: string) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createBrowserClient()

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create local URL for immediate preview
    const localUrl = URL.createObjectURL(file)
    setVideoURL(localUrl)

    try {
      // Upload to Supabase
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('User not found')

      const filename = `${user.id}_${Date.now()}.mp4`
      const { error } = await supabase.storage
        .from('videos')
        .upload(filename, file, {
          contentType: 'video/mp4',
          cacheControl: '3600',
        })

      if (error) throw error

      const {
        data: { publicUrl },
      } = supabase.storage.from('videos').getPublicUrl(filename)

      const { error: dataError } = await supabase.from('video_info').insert([
        {
          title: filename,
          truth_value: false,
          user: user.id,
          public_url: publicUrl,
        },
      ])

      if (dataError) console.error('Error inserting video info:', dataError)

      // Only update URL if upload succeeded
      setVideoURL(publicUrl)
    } catch (error) {
      console.error('Error uploading to Supabase:', error)
      // Keep using local URL if upload failed
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        ref={inputRef}
        style={{ display: 'none' }}
      />
      <Button
        onClick={() => inputRef.current?.click()}
        variant="outline"
        className="btn-upload"
      >
        Upload Video
      </Button>
    </div>
  )
}
