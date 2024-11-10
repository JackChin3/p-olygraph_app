import ConnectSupabaseSteps from '@/components/ConnectSupabaseSteps'
import SignUpUserSteps from '@/components/SignUpUserSteps'
import Header from '@/components/Header'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import ThemeToggle from '@/components/ThemeToggle'
import React, { useState } from 'react'
import { FileUploadButton } from '../components/FileUploadButton'
import { VideoRecordButton } from '../components/VideoRecordButton'
import { VideoUploadAndRecorder } from '@/components/VideoUploadAndRecorder'
import AuthButton from '@/components/AuthButton'
// import VideoPlayback from '@/components/VideoPlayback'

export default async function Index() {
  const cookieStore = cookies()

  const canInitSupabaseClient = () => {
    try {
      createServerClient(cookieStore)
      return true
    } catch (e) {
      return false
    }
  }

  const isSupabaseConnected = canInitSupabaseClient()

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      {/* Minimalistic Header */}
      <header className="flex w-full justify-center border-b border-b-foreground/10 py-4">
        <h1 className="text-2xl font-light tracking-wide">polygraph</h1>
      </header>

      <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
        <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>

      {/* Centered Video Upload and Recorder Section */}
      <div className="flex h-full w-full flex-grow items-center justify-center">
        <div className="container mx-auto flex items-center justify-center p-4">
          <VideoUploadAndRecorder />
        </div>
      </div>

      {/* <VideoPlayback /> */}

      <footer className="w-full justify-center border-t border-t-foreground/10 p-8 text-center text-xs">
        <p className="mb-6">
          Powered by{' '}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
        <ThemeToggle />
      </footer>
    </div>
  )
}
