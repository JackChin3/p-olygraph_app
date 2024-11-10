'use client'
import { useRef, useEffect } from 'react'
import { Button } from './ui/button'

export const VideoRecordButton = ({
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

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/mp4' })
        const localUrl = URL.createObjectURL(blob)
        setVideoURL(localUrl) // Set for preview only
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
