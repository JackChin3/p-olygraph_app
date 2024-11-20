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

export default function ReportCard() {
  const searchParams = useSearchParams()
  const title = searchParams.get('title')
  const [videoURL, setVideoURL] = useState<string | null>(null)
  const [truthValue, setTruthValue] = useState<'true' | 'lie' | null>(null)
  const [message, setMessage] = useState<string>('')
  const [numLie, setNumLie] = useState<number>(0)
  const [numTrue, setNumTrue] = useState<number>(0)
  const [modelResult, setModelResult] = useState<string | null>(null)

  const supabase = createBrowserClient()

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!title) return

      // Fetch the video URL and truth_value from the database
      const { data, error } = await supabase
        .from('video_info')
        .select('public_url, truth_value, num_true, num_lie, model_results')
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
      setModelResult(data?.model_results || null)
    }

    fetchVideoData()
  }, [title, supabase, numLie, numTrue])

  useEffect(() => {
    if (modelResult && truthValue) {
      if (modelResult === truthValue) {
        setMessage('You did not fool the AI!')
        // UPDATE THE USER's NUMBERS HERE
      } else {
        setMessage('You fooled the AI!')
      }
    }
  }, [truthValue, modelResult])

  const totalVotes = numTrue + numLie
  const truePercentage = totalVotes ? (numTrue / totalVotes) * 100 : 0
  const liePercentage = totalVotes ? (numLie / totalVotes) * 100 : 0
  const deceivedPercentage =
    truthValue === 'true' ? liePercentage : truePercentage

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
              <CardTitle>Video Playback</CardTitle>
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
              <CardTitle>{message}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 text-lg font-medium">
                  You submitted a <strong>{truthValue}</strong> video, and the
                  AI classified it as a <strong>{modelResult}</strong>
                </h3>
                {totalVotes > 0 && (
                  <>
                    <p className="mb-2 text-center font-medium">
                      User Classifications:
                    </p>
                    <div className="relative h-4 w-full rounded-lg border border-gray-200 bg-gray-300">
                      <div
                        className="absolute flex h-full items-center justify-center bg-white"
                        style={{ width: `${truePercentage}%` }}
                      >
                        <span className="text-xs text-black">{`True (${numTrue})`}</span>
                      </div>
                      <div
                        className="absolute flex h-full items-center justify-center bg-black"
                        style={{
                          width: `${liePercentage}%`,
                          left: `${truePercentage}%`,
                        }}
                      >
                        <span className="text-xs text-white">{`Lie (${numLie})`}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-center">
                      You deceived{' '}
                      <strong>{deceivedPercentage.toFixed(2)}%</strong> of users
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
