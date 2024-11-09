// 'use client'
// import { useState, useRef } from 'react'
// import { VideoRecorder } from './VideoRecorder'
// import { FileUploadButton } from './FileUploadButton'

// export const VideoUploadAndRecorder = () => {
//   const [videoURL, setVideoURL] = useState<string | null>(null)
//   const [isRecording, setIsRecording] = useState(false)
//   const videoRef = useRef<HTMLVideoElement | null>(null)

//   return (
//     <div>
//       <h1 className="mb-4 text-2xl font-bold">Video Upload and Recorder</h1>
//       <div className="mb-4 flex space-x-4">
//         <FileUploadButton setVideoURL={setVideoURL} />
//         <VideoRecorder
//           setVideoURL={setVideoURL}
//           videoRef={videoRef}
//           isRecording={isRecording}
//           setIsRecording={setIsRecording}
//         />
//       </div>

//       {/* Unified Video Display Area */}
//       <div className="mt-4 flex h-[480px] w-[640px] items-center justify-center rounded border border-gray-400 bg-gray-200">
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           controls={!isRecording}
//           src={!isRecording ? videoURL || undefined : undefined}
//           className="h-full w-full object-contain"
//         >
//           <p className="text-gray-500">Your video will appear here</p>
//         </video>
//       </div>
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

  const handleSubmit = () => {
    router.push('/reportcard')
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Video Upload and Recorder</h1>
      <div className="mb-4 flex space-x-4">
        <FileUploadButton setVideoURL={setVideoURL} />
        <VideoRecorder
          setVideoURL={setVideoURL}
          videoRef={videoRef}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      </div>

      {/* Unified Video Display Area */}
      <div className="mt-4 flex h-[480px] w-[640px] items-center justify-center rounded border border-gray-400 bg-gray-200">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          controls={!isRecording}
          src={!isRecording ? videoURL || undefined : undefined}
          className="h-full w-full object-contain"
        >
          <p className="text-gray-500">Your video will appear here</p>
        </video>
      </div>

      {/* Submit button only shows when there's a video URL and not recording */}
      {videoURL && !isRecording && (
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
