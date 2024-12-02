'use client'

import { useRouter } from 'next/navigation'

export default function AboutUsPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="max-w-2xl text-center">
        {/* Updated Header */}
        <h1 className="mb-4 text-4xl font-bold text-white">
          Welcome to Polygraph
        </h1>

        {/* Updated Description */}
        <p className="mb-8 text-lg text-gray-300">
          Polygraph is a cutting-edge platform leveraging AI technology to
          distinguish truth from deception. Our system analyzes videos to detect
          authenticity and uncover hidden patterns. Are you ready to challenge
          AI?
        </p>

        {/* Updated Button */}
        <button
          onClick={() => router.push('/record-video')}
          className="rounded-md bg-white px-6 py-3 text-lg text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Let&apos;s Get Started
        </button>
      </div>
    </div>
  )
}
