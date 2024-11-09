'use client'
import { useRouter } from 'next/navigation'

interface SubmitVideoButtonProps {
  isVideoPresent: boolean
}

export function SubmitVideoButton({ isVideoPresent }: SubmitVideoButtonProps) {
  const router = useRouter()

  const handleSubmit = () => {
    router.push('/report-card')
  }

  return (
    <button
      onClick={handleSubmit}
      disabled={!isVideoPresent}
      className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Submit Video
    </button>
  )
}
