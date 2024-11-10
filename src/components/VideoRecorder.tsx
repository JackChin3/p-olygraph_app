'use client'
import { useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { createBrowserClient } from '@/utils/supabase'

export const VideoRecorder = ({
  setVideoURL,
  videoRef,
  isRecording,
  setIsRecording,
}: {
  setVideoURL: (url: string) => void
  videoRef: React.RefObject<HTMLVideoElement>
  isRecording: boolean
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const recordedChunks = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      mediaRecorder.current = new MediaRecorder(stream)
      recordedChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data)
        }
      }

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/mp4' })
        const localUrl = URL.createObjectURL(blob)

        // Set local URL immediately for preview
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
            .upload(filename, blob, {
              contentType: 'video/mp4',
              cacheControl: '3600',
            })

          if (error) throw error

          const {
            data: { publicUrl },
          } = supabase.storage.from('videos').getPublicUrl(filename)

          const { error: dataError } = await supabase
            .from('video_info')
            .insert([
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
      }

      mediaRecorder.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop()
      setIsRecording(false)

      if (videoRef.current) {
        videoRef.current.srcObject = null
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }

  return (
    <Button
      onClick={isRecording ? stopRecording : startRecording}
      variant={isRecording ? 'destructive' : 'default'}
      className="btn-record"
    >
      {isRecording ? 'Stop Recording' : 'Record Video'}
    </Button>
  )
}
