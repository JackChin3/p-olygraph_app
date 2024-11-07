import React from 'react'

const VideoDisplay = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <div className="flex h-[240px] w-full items-center justify-center rounded border border-gray-400 bg-gray-200">
      <video src={videoUrl} controls className="h-full w-full object-contain">
        <p className="text-gray-500">Your video will appear here</p>
      </video>
    </div>
  )
}

export default VideoDisplay
