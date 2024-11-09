// app/reportcard/page.tsx
'use client'
import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/CardComponents'

export default function ReportCard() {
  const searchParams = useSearchParams()
  const videoURL = searchParams.get('videoURL') // Retrieve video URL from query parameter

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
              <CardTitle>Your Video Performance</CardTitle>
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
