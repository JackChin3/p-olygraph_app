'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Sidebar toggle button */}
      <div
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded cursor-pointer"
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
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 z-40`}
      >
        {/* Added pt-20 to create space below the hamburger icon */}
        <div className="p-4 pt-20">
          <ul className="space-y-6"> {/* Increased space between buttons */}
            {/* Home Button */}
            <li>
              <button
                onClick={() => {
                  toggleSidebar();
                  router.push('/');
                }}
                className="w-full text-left p-3 rounded bg-blue-500 hover:bg-blue-600 z-50"
              >
                Home
              </button>
            </li>

            {/* My Videos Button */}
            <li>
              <button
                onClick={() => {
                  toggleSidebar();
                  router.push('/thumbnail');
                }}
                className="w-full text-left p-3 rounded bg-blue-500 hover:bg-blue-600 z-50"
              >
                My Videos
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-30"
        ></div>
      )}
    </div>
  );
}