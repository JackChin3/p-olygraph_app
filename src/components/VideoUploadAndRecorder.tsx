// 'use client'
// import { useState, useRef } from 'react'
// import { VideoRecorder } from './VideoRecorder'
// import { FileUploadButton } from './FileUploadButton'
// import { useRouter } from 'next/navigation'

// export const VideoUploadAndRecorder = () => {
//   const [videoURL, setVideoURL] = useState<string | null>(null)
//   const [isRecording, setIsRecording] = useState(false)
//   const videoRef = useRef<HTMLVideoElement | null>(null)
//   const router = useRouter()

//   // Handle video source changes
//   const handleVideoSource = (url: string) => {
//     setVideoURL(url)
//     console.log("Set videoURL:", url)  // Debugging log
//     if (videoRef.current) {
//       if (videoRef.current.src !== url) {
//         videoRef.current.src = url
//         videoRef.current.load()
//       }
//     }
//   }

//   const handleSubmit = () => {
//     console.log("Submitting video with URL:", videoURL)  // Debugging log
//     if (videoURL) {
//       router.push(`/reportcard?videoURL=${encodeURIComponent(videoURL)}`)
//     }
//   }

//   return (
//     <div>
//       <h1 className="mb-4 text-2xl font-bold">Video Upload and Recorder</h1>
//       <div className="mb-4 flex space-x-4">
//         <FileUploadButton setVideoURL={handleVideoSource} />
//         <VideoRecorder
//           setVideoURL={handleVideoSource}
//           videoRef={videoRef}
//           isRecording={isRecording}
//           setIsRecording={setIsRecording}
//         />
//       </div>

//       <div className="mt-4 flex h-[480px] w-[640px] items-center justify-center rounded border border-gray-400 bg-gray-200">
//         <video
//           ref={videoRef}
//           autoPlay={isRecording}
//           playsInline
//           muted={isRecording}
//           controls={!isRecording}
//           className="h-full w-full object-contain"
//         >
//           Your browser does not support the video tag.
//         </video>
//       </div>

//       {/* Submit button only shows when there's a video */}
//       {videoURL && (
//         <div className="mt-4 flex justify-center">
//           <button
//             onClick={handleSubmit}
//             className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             Submit Video
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// // app/components/VideoUploadAndRecorder.tsx
// 'use client'
// import { useState, useRef } from 'react'
// import { VideoRecorder } from './VideoRecorder'
// import { FileUploadButton } from './FileUploadButton'
// import { useRouter } from 'next/navigation'

// export const VideoUploadAndRecorder = () => {
//   const [videoURL, setVideoURL] = useState<string | null>(null)
//   const [isRecording, setIsRecording] = useState(false)
//   const videoRef = useRef<HTMLVideoElement | null>(null)
//   const router = useRouter()

//   const handleVideoSource = (url: string) => {
//     setVideoURL(url)
//     if (videoRef.current) {
//       if (videoRef.current.src !== url) {
//         videoRef.current.src = url
//         videoRef.current.load()
//       }
//     }
//   }

//   const handleSubmit = () => {
//     if (videoURL) {
//       router.push(`/reportcard?videoURL=${encodeURIComponent(videoURL)}`)
//     }
//   }

//   const goToThumbnailPage = () => {
//     router.push('/thumbnail')  // Navigate to the thumbnails page
//   }

//   return (
//     <div>
//       <h1 className="mb-4 text-2xl font-bold">Video Upload and Recorder</h1>
//       <div className="mb-4 flex space-x-4">
//         <FileUploadButton setVideoURL={handleVideoSource} />
//         <VideoRecorder
//           setVideoURL={handleVideoSource}
//           videoRef={videoRef}
//           isRecording={isRecording}
//           setIsRecording={setIsRecording}
//         />
//       </div>

//       <div className="mt-4 flex h-[480px] w-[640px] items-center justify-center rounded border border-gray-400 bg-gray-200">
//         <video
//           ref={videoRef}
//           autoPlay={isRecording}
//           playsInline
//           muted={isRecording}
//           controls={!isRecording}
//           className="h-full w-full object-contain"
//         >
//           Your browser does not support the video tag.
//         </video>
//       </div>

//       {videoURL && (
//         <div className="mt-4 flex justify-center">
//           <button
//             onClick={handleSubmit}
//             className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             Submit Video
//           </button>
//         </div>
//       )}

//       <div className="mt-4 flex justify-center">
//         <button
//           onClick={goToThumbnailPage}
//           className="rounded-md bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//         >
//           Go to Thumbnail Page
//         </button>
//       </div>
//     </div>
//   )
// }

'use client'

import React, { useState, useRef } from 'react'
import { VideoRecorder } from './VideoRecorder'
import { FileUploadButton } from './FileUploadButton'

export function VideoUploadAndRecorder() {
  const [videoURL, setVideoURL] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const handleVideoSource = (url: string) => {
    setVideoURL(url)
    if (videoRef.current) {
      if (videoRef.current.src !== url) {
        videoRef.current.src = url
        videoRef.current.load()
      }
    }
  }

  const handleSubmit = () => {
    if (videoURL) {
      window.location.href = `/reportcard?videoURL=${encodeURIComponent(videoURL)}`
    }
  }

  const handleNavigate = () => {
    window.location.href = '/thumbnails'
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Video Upload and Recorder</h1>
      <div className="mb-4 flex space-x-4">
        <FileUploadButton setVideoURL={handleVideoSource} />
        <VideoRecorder
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

      <div className="mt-4 flex justify-center space-x-4">
        {videoURL && (
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Video
          </button>
        )}
        <button
          onClick={handleNavigate}
          className="rounded-md bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          View All Videos
        </button>
      </div>
    </div>
  )
}
