'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <div>
      {/* Sidebar toggle button */}
      <div
        onClick={toggleSidebar}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded bg-blue-500 text-white"
      >
        {/* Hamburger Icon */}
        <div className="space-y-1">
          <div className="h-1 w-6 bg-white"></div>
          <div className="h-1 w-6 bg-white"></div>
          <div className="h-1 w-6 bg-white"></div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 transform bg-gray-800 text-white shadow-lg ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } z-40 transition-transform duration-300`}
      >
        {/* Added pt-20 to create space below the hamburger icon */}
        <div className="p-4 pt-20">
          <ul className="space-y-6">
            {' '}
            {/* Increased space between buttons */}
            {/* Home Button */}
            <li>
              <button
                onClick={() => {
                  toggleSidebar()
                  router.push('/')
                }}
                className="z-50 w-full rounded bg-blue-500 p-3 text-left hover:bg-blue-600"
              >
                Home
              </button>
            </li>
            {/* My Videos Button */}
            <li>
              <button
                onClick={() => {
                  toggleSidebar()
                  router.push('/thumbnail')
                }}
                className="z-50 w-full rounded bg-blue-500 p-3 text-left hover:bg-blue-600"
              >
                My Videos
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  toggleSidebar()
                  router.push('/explore')
                }}
                className="z-50 w-full rounded bg-blue-500 p-3 text-left hover:bg-blue-600"
              >
                Explore Videos
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed left-0 top-0 z-30 h-full w-full bg-black bg-opacity-50"
        ></div>
      )}
    </div>
  )
}
