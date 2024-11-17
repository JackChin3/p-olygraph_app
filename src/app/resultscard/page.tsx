'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/utils/supabase'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/CardComponents'

export default function ResultCard() {
  const searchParams = useSearchParams()
  const title = searchParams.get('title')
  const classification = searchParams.get('classification') // "true" or "lie"
  const [videoURL, setVideoURL] = useState<string | null>(null)
  const [truthValue, setTruthValue] = useState<'true' | 'lie' | null>(null)
  const [message, setMessage] = useState<string>('')
  const [numLie, setNumLie] = useState<number | null>(null)
  const [numTrue, setNumTrue] = useState<number | null>(null)

  const supabase = createBrowserClient()

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!title) return

      // Fetch the video URL and truth_value from the database
      const { data, error } = await supabase
        .from('video_info')
        .select('public_url, truth_value, num_true, num_lie')
        .eq('title', title)
        .single()

      if (error) {
        console.error('Error fetching video data:', error)
        return
      }

      setVideoURL(data?.public_url || null)
      setTruthValue(data?.truth_value || null)
      setNumLie(data?.num_lie || null)
      setNumTrue(data?.num_true || null)

      // Update the num_true or num_lie based on classification
      if (classification && data) {
        if (classification === 'true') {
          const { data, error } = await supabase
            .from('video_info')
            .update({
              num_true: (numTrue || 0) + 1, // Increment the column
            })
            .eq('title', title)

          if (error) {
            console.error(`Error updating:`, error)
          }
        } else if (classification === 'lie') {
          const { data, error } = await supabase
            .from('video_info')
            .update({
              num_lie: (numLie || 0) + 1, // Increment the column
            })
            .eq('title', title)
        }
      }
    }

    fetchVideoData()
  }, [title, classification, supabase, numLie, numTrue])

  useEffect(() => {
    if (classification && truthValue) {
      if (classification === 'true' && truthValue === 'true') {
        setMessage('You correctly classified the video as True!')
      } else if (classification === 'true' && truthValue === 'lie') {
        setMessage('You were deceived!')
      } else if (classification === 'lie' && truthValue === 'true') {
        setMessage('You incorrectly classified the video as a Lie!')
      } else if (classification === 'lie' && truthValue === 'lie') {
        setMessage('You successfully detected deception in the video!')
      }
    }
  }, [classification, truthValue])

  return (
    <div className="flex w-full flex-1 flex-col">
      <header className="flex w-full justify-center border-b border-b-foreground/10 py-4">
        <h1 className="text-2xl font-light tracking-wide">Analysis Report</h1>
      </header>

      <div className="container mx-auto flex flex-1 gap-8 p-8">
        {/* Left Column - Video Playback */}
        <div className="flex w-1/2 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{message}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                {videoURL ? (
                  <video
                    className="h-full w-full object-contain"
                    controls
                    playsInline
                    src={videoURL} // Set video source to the submitted video URL
                  >
                    <p>Your browser does not support the video tag.</p>
                  </video>
                ) : (
                  <p className="text-center text-gray-500">
                    No video to display.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Performance Metrics */}
        <div className="flex w-1/2 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 text-lg font-medium">
                  Put Video Performance Results Here
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
