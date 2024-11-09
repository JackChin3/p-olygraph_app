// // 'use client'
// // import { useState, useRef, useEffect } from 'react'
// // import { VideoRecorder } from './VideoRecorder'
// // import { FileUploadButton } from './FileUploadButton'

// // export const VideoUploadAndRecorder = () => {
// //   const [videoURL, setVideoURL] = useState<string | null>(null)
// //   const [isRecording, setIsRecording] = useState(false)
// //   const videoRef = useRef<HTMLVideoElement | null>(null)

// //   // Handle video source changes
// //   const handleVideoSource = (url: string) => {
// //     // Store the URL in state
// //     setVideoURL(url)

// //     // Directly set the video source
// //     if (videoRef.current) {
// //       if (videoRef.current.src !== url) {
// //         videoRef.current.src = url
// //         videoRef.current.load()
// //       }
// //     }
// //   }

// //   return (
// //     <div>
// //       <h1 className="mb-4 text-2xl font-bold">Video Upload and Recorder</h1>
// //       <div className="mb-4 flex space-x-4">
// //         <FileUploadButton setVideoURL={handleVideoSource} />
// //         <VideoRecorder
// //           setVideoURL={handleVideoSource}
// //           videoRef={videoRef}
// //           isRecording={isRecording}
// //           setIsRecording={setIsRecording}
// //         />
// //       </div>

// //       <div className="mt-4 flex h-[480px] w-[640px] items-center justify-center rounded border border-gray-400 bg-gray-200">
// //         <video
// //           ref={videoRef}
// //           autoPlay={isRecording}
// //           playsInline
// //           muted={isRecording}
// //           controls={!isRecording}
// //           className="h-full w-full object-contain"
// //         >
// //           Your browser does not support the video tag.
// //         </video>
// //       </div>
// //     </div>
// //   )
// // }

// 'use client'
// import { useState, useRef, useEffect } from 'react'
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
//     // Store the URL in state
//     setVideoURL(url)

//     // Directly set the video source
//     if (videoRef.current) {
//       if (videoRef.current.src !== url) {
//         videoRef.current.src = url
//         videoRef.current.load()
//       }
//     }
//   }

//   const handleSubmit = () => {
//     router.push('/report-card')
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

'use client'
import { useState, useRef } from 'react'
import { VideoRecorder } from './VideoRecorder'
import { FileUploadButton } from './FileUploadButton'
import { useRouter } from 'next/navigation'

export const VideoUploadAndRecorder = () => {
  const [videoURL, setVideoURL] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const router = useRouter()

  // Handle video source changes
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
      router.push(`/reportcard?videoURL=${encodeURIComponent(videoURL)}`)
    }
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

      {/* Submit button only shows when there's a video */}
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
    </div>
  )
}
