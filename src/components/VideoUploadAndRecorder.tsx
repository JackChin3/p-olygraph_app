'use client'

import React, { useState, useRef } from 'react'
import { VideoRecordButton } from './VideoRecordButton'
import { FileUploadButton } from './FileUploadButton'
import { createBrowserClient } from '@/utils/supabase'
// Import Switch component from your UI library or create a custom one
// Requires you to run this install: npm install react-switch
import ReactSwitch from 'react-switch'
import { useRouter } from 'next/navigation'

export function VideoUploadAndRecorder() {
  const [videoURL, setVideoURL] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [truthValue, setTruthValue] = useState<'true' | 'lie' | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const supabase = createBrowserClient()
  const router = useRouter()

  const handleVideoSource = (url: string) => {
    setVideoURL(url)
    if (videoRef.current) {
      if (videoRef.current.src !== url) {
        videoRef.current.src = url
        videoRef.current.load()
      }
    }
  }
  const handleNavigate = () => {
    router.push(`/thumbnail`)
  }

  const handleSubmit = async () => {
    if (!videoURL || !truthValue) return

    try {
      const response = await fetch(videoURL)
      const blob = await response.blob()

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('User not found')

      const filename = `${user.id}_${Date.now()}.mp4`
      const { error } = await supabase.storage
        .from('videos')
        .upload(filename, blob, {
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
          truth_value: truthValue === 'true',
          user: user.id,
          public_url: publicUrl,
        },
      ])

      if (dataError) console.error('Error inserting video info:', dataError)

      router.push(`/reportcard?filename=${encodeURIComponent(filename)}`)

      setVideoURL(publicUrl) // Update URL to public URL after successful upload
    } catch (error) {
      console.error('Error uploading video:', error)
    }
  }

  const handleToggle = () => {
    setTruthValue((prev) => (prev === 'true' ? 'lie' : 'true'))
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        Upload or Record a Video to Get Started!
      </h1>
      <div className="mb-4 flex space-x-4">
        <FileUploadButton setVideoURL={handleVideoSource} />
        <VideoRecordButton
          setVideoURL={handleVideoSource}
          videoRef={videoRef}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      </div>

      <div className="mt-4 flex h-[480px] w-[640px] items-center justify-center rounded border border-gray-400 bg-gray-200">
        <video
          ref={videoRef}
          autoPlay={isRecording}
          playsInline
          muted={isRecording}
          controls={!isRecording}
          className="h-full w-full object-contain"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {videoURL && (
        <>
          <div className="mt-4 flex items-center justify-center space-x-4 align-middle">
            <ReactSwitch
              checked={truthValue === 'true'}
              onChange={handleToggle}
              className="toggle-switch rounded border border-gray-400 bg-gray-200 align-middle"
              checkedIcon={
                <p className="ml-2 align-middle text-sm font-bold text-black">
                  Truth
                </p>
              }
              uncheckedIcon={
                <p className="align-middle text-sm font-bold text-white">Lie</p>
              }
              onColor="#FFFFFF"
              offColor="#000000"
              width={80}
            />
          </div>

          {videoURL && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleSubmit}
                className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Video
              </button>
            </div>
          )}
        </>
      )}
      <button
        onClick={handleNavigate}
        className="rounded-md bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        View All Videos
      </button>
    </div>
  )
}
