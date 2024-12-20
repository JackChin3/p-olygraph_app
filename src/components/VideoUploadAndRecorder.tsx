'use client'

import React, { useState, useRef } from 'react'
import { VideoRecordButton } from './VideoRecordButton'
import { FileUploadButton } from './FileUploadButton'
import { createBrowserClient } from '@/utils/supabase'
import ReactSwitch from 'react-switch'
import { useRouter } from 'next/navigation'

const LoadingBar = ({ progress }: { progress: number }) => {
  return (
    <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
      <div
        className="h-2.5 rounded-full bg-blue-600 transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )
}

export function VideoUploadAndRecorder() {
  const [videoURL, setVideoURL] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [truthValue, setTruthValue] = useState<'true' | 'lie'>('true')
  const [publicValue, setPublicValue] = useState<'Public' | 'Private'>(
    'Private',
  )
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState('')
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const supabase = createBrowserClient()
  const router = useRouter()

  // Added handleVideoSource method
  const handleVideoSource = (url: string) => {
    setVideoURL(url)
    if (videoRef.current) {
      if (videoRef.current.src !== url) {
        videoRef.current.src = url
        videoRef.current.load()
      }
    }
  }

  // Added handleToggle method for truth value
  const handleToggle = () => {
    setTruthValue((prev) => (prev === 'true' ? 'lie' : 'true'))
  }

  // Added handlePublicToggle method
  const handlePublicToggle = () => {
    setPublicValue((prev) => (prev === 'Public' ? 'Private' : 'Public'))
  }

  const handleSubmit = async () => {
    if (!videoURL || !truthValue) {
      alert(
        'Please select a video and set the truth/lie toggle before submitting.',
      )
      return
    }

    // Reset and start loading state
    setIsLoading(true)
    setLoadingProgress(0)
    setLoadingMessage('Preparing upload...')

    try {
      // Simulate more detailed loading stages
      const updateProgress = (progress: number, message: string) => {
        setLoadingProgress(progress)
        setLoadingMessage(message)
      }

      updateProgress(10, 'Verifying user...')
      // 1. Check User
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('User not found')
      }

      updateProgress(20, 'Preparing video...')
      // 2. Fetch Video
      const response = await fetch(videoURL)
      const blob = await response.blob()

      updateProgress(30, 'Generating filename...')
      // 3. Prepare FormData
      const filename = `${user.id}_${Date.now()}.mp4`
      const formData = new FormData()
      formData.append('file', blob, 'video.mp4')
      formData.append('video_id', filename)

      // 4. ML Processing - Now occupies a larger portion of the progress bar
      updateProgress(40, 'Starting ML analysis...')
      const startMLTime = Date.now()

      const apiResponse = await fetch(
        'http://127.0.0.1:5000/api/process-video',
        {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        },
      )

      // Simulate progressive loading during ML processing
      const mlProgressInterval = setInterval(() => {
        const elapsedTime = (Date.now() - startMLTime) / 1000 // seconds
        // Gradually increase progress from 40 to 70 over time
        const mlProgress = Math.min(70, 40 + elapsedTime * 5)
        updateProgress(
          mlProgress,
          `Analyzing video: ${Math.round(elapsedTime)} seconds`,
        )
      }, 500)

      const mlData = await apiResponse.json()

      // Clear the interval once ML processing is complete
      clearInterval(mlProgressInterval)

      if (!mlData.success || !mlData['ml results']) {
        throw new Error('Invalid ML processing results')
      }

      updateProgress(70, 'Uploading to storage...')
      // 5. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filename, blob, {
          contentType: 'video/mp4',
          cacheControl: '3600',
        })

      if (uploadError) {
        throw uploadError
      }

      updateProgress(80, 'Generating public URL...')
      // 6. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('videos').getPublicUrl(filename)

      updateProgress(90, 'Saving video information...')
      // 7. Prepare Database Entry
      const videoInfo = {
        title: filename,
        truth_value: truthValue,
        user: user.id,
        public_url: publicUrl,
        public: publicValue === 'Public',
        model_results: mlData['ml results'],
      }

      // 8. Insert into Database
      const { error: dataError } = await supabase
        .from('video_info')
        .insert([videoInfo])

      if (dataError) {
        // Cleanup uploaded file if database insert fails
        await supabase.storage.from('videos').remove([filename])
        throw new Error(`Failed to save video info: ${dataError.message}`)
      }

      updateProgress(100, 'Redirecting...')
      // 9. Navigation
      router.push(`/reportcard?title=${encodeURIComponent(filename)}`)
    } catch (error) {
      console.error('Error in submission process:', error)
      alert(`Error processing video`)
    } finally {
      // Ensure loading state is reset
      setIsLoading(false)
      setLoadingProgress(0)
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-center text-2xl font-bold">
        Upload or Record a Video to Get Started!
      </h1>
      <div className="mb-4 flex items-center justify-center space-x-4">
        <FileUploadButton setVideoURL={handleVideoSource} />
        <VideoRecordButton
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

      {videoURL && (
        <>
          <div className="mt-4 flex items-center justify-center space-x-4 align-middle">
            <ReactSwitch
              checked={truthValue === 'true'}
              onChange={handleToggle}
              className="toggle-switch rounded border border-gray-400 bg-gray-200 align-middle"
              checkedIcon={
                <p className="align-left ml-2 text-sm font-bold text-black">
                  Truth
                </p>
              }
              uncheckedIcon={
                <p className="align-right text-sm font-bold text-white">Lie</p>
              }
              onColor="#FFFFFF"
              offColor="#000000"
              width={85}
              height={25}
            />
          </div>

          <div className="mt-4 flex items-center justify-center space-x-4 align-middle">
            <ReactSwitch
              checked={publicValue === 'Public'}
              onChange={handlePublicToggle}
              className="toggle-switch rounded border border-gray-400 bg-gray-200 align-middle"
              checkedIcon={
                <div className="flex h-full items-center pl-1">
                  <span className="text-sm font-bold text-black">Public</span>
                </div>
              }
              uncheckedIcon={
                <div className="flex h-full items-center justify-end pr-1">
                  <span className="text-sm font-bold text-white">Private</span>
                </div>
              }
              onColor="#FFFFFF"
              offColor="#000000"
              width={85}
              height={25}
            />
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Submit Video'}
            </button>
          </div>

          {/* Loading Bar */}
          {isLoading && (
            <div className="mt-4 w-full px-4">
              <LoadingBar progress={loadingProgress} />
              <p className="mt-2 text-center text-sm text-gray-600">
                {loadingMessage} ({loadingProgress}%)
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// 'use client'

// import React, { useState, useRef } from 'react'
// import { VideoRecordButton } from './VideoRecordButton'
// import { FileUploadButton } from './FileUploadButton'
// import { createBrowserClient } from '@/utils/supabase'
// // Import Switch component from your UI library or create a custom one
// // Requires you to run this install: npm install react-switch
// import ReactSwitch from 'react-switch'
// import { useRouter } from 'next/navigation'

// export function VideoUploadAndRecorder() {
//   const [videoURL, setVideoURL] = useState<string | null>(null)
//   const [isRecording, setIsRecording] = useState(false)
//   const [truthValue, setTruthValue] = useState<'true' | 'lie'>('true') // Default to 'true'
//   const [publicValue, setPublicValue] = useState<'Public' | 'Private'>(
//     'Private',
//   )
//   const videoRef = useRef<HTMLVideoElement | null>(null)
//   const supabase = createBrowserClient()
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

//   const handleNavigate = () => {
//     router.push(`/thumbnail`)
//   }
//   const handleSubmit = async () => {
//     console.log('Starting submission with:', { videoURL, truthValue })

//     if (!videoURL || !truthValue) {
//       console.error('Video URL or truth value is missing.')
//       alert(
//         'Please select a video and set the truth/lie toggle before submitting.',
//       )
//       return
//     }

//     try {
//       // 1. Check User
//       console.log('Getting user...')
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser()
//       if (userError || !user) {
//         console.error('User error:', userError)
//         throw new Error('User not found')
//       }
//       console.log('User found:', user.id)

//       const filename = `${user.id}_${Date.now()}.mp4`
//       console.log('Generated filename:', filename)

//       // 2. Fetch Video
//       console.log('Fetching video from URL:', videoURL)
//       const response = await fetch(videoURL)
//       console.log('Video fetch response status:', response.status)
//       const blob = await response.blob()
//       console.log('Video blob size:', blob.size, 'type:', blob.type)

//       // 3. Prepare FormData
//       const formData = new FormData()
//       formData.append('file', blob, 'video.mp4')
//       formData.append('video_id', filename)
//       console.log('FormData prepared with video_id:', filename)

//       // 4. ML Processing
//       console.log('Sending to ML API...')
//       const apiResponse = await fetch(
//         'http://127.0.0.1:5000/api/process-video',
//         {
//           method: 'POST',
//           body: formData,
//           headers: {
//             Accept: 'application/json',
//           },
//         },
//       )
//       console.log('ML API response status:', apiResponse.status)

//       const mlData = await apiResponse.json()
//       console.log('ML API response data:', mlData)

//       if (!mlData.success || !mlData['ml results']) {
//         console.error('ML processing failed:', mlData)
//         throw new Error('Invalid ML processing results')
//       }

//       // 5. Upload to Supabase Storage
//       console.log('Uploading to Supabase storage...')
//       const { error: uploadError } = await supabase.storage
//         .from('videos')
//         .upload(filename, blob, {
//           contentType: 'video/mp4',
//           cacheControl: '3600',
//         })

//       if (uploadError) {
//         console.error('Upload error:', uploadError)
//         throw uploadError
//       }
//       console.log('Upload successful')

//       // 6. Get Public URL
//       const {
//         data: { publicUrl },
//       } = supabase.storage.from('videos').getPublicUrl(filename)
//       console.log('Generated public URL:', publicUrl)

//       // 7. Prepare Database Entry
//       const videoInfo = {
//         title: filename,
//         truth_value: truthValue,
//         user: user.id,
//         public_url: publicUrl,
//         public: publicValue === 'Public',
//         model_results: mlData['ml results'],
//       }
//       console.log('Preparing to insert video info:', videoInfo)

//       // 8. Insert into Database
//       const { error: dataError } = await supabase
//         .from('video_info')
//         .insert([videoInfo])

//       if (dataError) {
//         console.error('Database insertion error:', dataError)
//         // Cleanup uploaded file if database insert fails
//         await supabase.storage.from('videos').remove([filename])
//         throw new Error(`Failed to save video info: ${dataError.message}`)
//       }
//       console.log('Database insertion successful')

//       // 9. Navigation
//       console.log('Navigating to reportcard...')
//       router.push(`/reportcard?title=${encodeURIComponent(filename)}`)
//     } catch (error) {
//       console.error('Error in submission process:', error)
//       alert(`Error processing video`)
//     }
//   }

//   const handleToggle = () => {
//     setTruthValue((prev) => (prev === 'true' ? 'lie' : 'true'))
//   }

//   const handlePublicToggle = () => {
//     setPublicValue((prev) => (prev === 'Public' ? 'Private' : 'Public'))
//   }

//   return (
//     <div>
//       <h1 className="mb-4 text-center text-2xl font-bold">
//         Upload or Record a Video to Get Started!
//       </h1>
//       <div className="mb-4 flex items-center justify-center space-x-4">
//         <FileUploadButton setVideoURL={handleVideoSource} />
//         <VideoRecordButton
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
//         <>
//           <div className="mt-4 flex items-center justify-center space-x-4 align-middle">
//             <ReactSwitch
//               checked={truthValue === 'true'}
//               onChange={handleToggle}
//               className="toggle-switch rounded border border-gray-400 bg-gray-200 align-middle"
//               checkedIcon={
//                 <p className="align-left ml-2 text-sm font-bold text-black">
//                   Truth
//                 </p>
//               }
//               uncheckedIcon={
//                 <p className="align-right text-sm font-bold text-white">Lie</p>
//               }
//               onColor="#FFFFFF"
//               offColor="#000000"
//               width={85}
//               height={25}
//             />
//           </div>

//           <div className="mt-4 flex items-center justify-center space-x-4 align-middle">
//             <ReactSwitch
//               checked={publicValue === 'Public'}
//               onChange={handlePublicToggle}
//               className="toggle-switch rounded border border-gray-400 bg-gray-200 align-middle"
//               checkedIcon={
//                 <div className="flex h-full items-center pl-1">
//                   <span className="text-sm font-bold text-black">Public</span>
//                 </div>
//               }
//               uncheckedIcon={
//                 <div className="flex h-full items-center justify-end pr-1">
//                   <span className="text-sm font-bold text-white">Private</span>
//                 </div>
//               }
//               onColor="#FFFFFF"
//               offColor="#000000"
//               width={85}
//               height={25}
//             />
//           </div>

//           <div className="mt-4 flex justify-center">
//             <button
//               onClick={handleSubmit}
//               className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               Submit Video
//             </button>
//           </div>
//         </>
//       )}
//       {/* <button
//         onClick={handleNavigate}
//         className="rounded-md bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//       >
//         View All Videos
//       </button> */}
//     </div>
//   )
// }
