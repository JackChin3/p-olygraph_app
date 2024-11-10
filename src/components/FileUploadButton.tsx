'use client'
import { useRef } from 'react'
import { Button } from './ui/button'

export const FileUploadButton = ({
  setVideoURL,
}: {
  setVideoURL: (url: string) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create local URL for immediate preview
    const localUrl = URL.createObjectURL(file)
    setVideoURL(localUrl) // Set for preview only

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        ref={inputRef}
        style={{ display: 'none' }}
      />
      <Button
        onClick={() => inputRef.current?.click()}
        variant="outline"
        className="btn-upload"
      >
        Upload Video
      </Button>
    </div>
  )
}
