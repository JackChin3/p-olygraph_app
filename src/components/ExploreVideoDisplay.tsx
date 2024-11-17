import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactSwitch from 'react-switch'

const ExploreVideoDisplay = ({
  videoUrl,
  filename,
}: {
  videoUrl: string
  filename: string
}) => {
  const router = useRouter()

  // Navigate to the report card page with the filename
  const handleNavigate = () => {
    router.push(
      `/resultscard?title=${encodeURIComponent(filename)}&classification=${encodeURIComponent(truthValue)}`,
    )
  }

  const [truthValue, setTruthValue] = useState<'true' | 'lie'>('true') // Default to 'true'

  const handleToggle = () => {
    setTruthValue((prev) => (prev === 'true' ? 'lie' : 'true'))
  }

  return (
    <div
      className="my-3 flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#f0f0f0', // Grey background for the box
        borderRadius: '8px', // Rounded corners
        padding: '20px', // Padding for the box
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow for a lifted effect
        width: '700px', // Set a fixed width for consistency
        marginBottom: '20px', // Space between video containers
      }}
    >
      {/* Video Player */}
      <div
        className="flex w-full items-center justify-center rounded"
        style={{
          backgroundColor: '#ffffff',
          padding: '10px',
          marginBottom: '10px',
        }}
      >
        <video
          src={videoUrl}
          controls
          className="w-full object-contain"
          style={{ maxHeight: '500px' }}
        >
          <p className="text-gray-500">Your video will appear here</p>
        </video>
      </div>

      {/* Switch below the video */}
      <div className="flex items-center space-x-4">
        <div className="mt-4 flex items-center justify-center space-x-4 align-middle">
          <ReactSwitch
            checked={truthValue === 'true'}
            onChange={handleToggle}
            className="toggle-switch rounded border border-gray-400 bg-gray-200 align-middle"
            checkedIcon={
              <p className="ml-2 align-middle text-sm font-bold text-black">
                Truth
              </p>
            }
            uncheckedIcon={
              <p className="align-middle text-sm font-bold text-white">Lie</p>
            }
            onColor="#FFFFFF"
            offColor="#000000"
            width={80}
          />
        </div>
      </div>
      <button
        onClick={handleNavigate}
        className="h-15 w-60 rounded-md bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Submit Classification and View Results
      </button>
    </div>
  )
}

export default ExploreVideoDisplay
