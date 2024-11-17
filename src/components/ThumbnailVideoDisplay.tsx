import React from 'react'
import { useRouter } from 'next/navigation'

const ThumbnailVideoDisplay = ({
  videoUrl,
  filename,
}: {
  videoUrl: string
  filename: string
}) => {
  const router = useRouter()

  // Navigate to the report card page with the filename
  const handleNavigate = () => {
    router.push(`/reportcard?title=${encodeURIComponent(filename)}`)
  }

  return (
    <div className="my-3 flex h-[240px] w-full flex-col items-center justify-center rounded">
      <div className="flex h-[240px] w-full items-center justify-center rounded border border-gray-400 bg-gray-200">
        <video src={videoUrl} controls className="h-full w-full object-contain">
          <p className="text-gray-500">Your video will appear here</p>
        </video>
      </div>
      <button
        onClick={handleNavigate}
        className="h-20 w-40 rounded-md bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        View Analysis
      </button>
    </div>
  )
}

export default ThumbnailVideoDisplay
