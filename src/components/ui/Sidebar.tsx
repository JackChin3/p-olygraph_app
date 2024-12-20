// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'

// export default function Sidebar() {
//   const [isOpen, setIsOpen] = useState(false)
//   const router = useRouter()

//   const toggleSidebar = () => setIsOpen(!isOpen)

//   return (
//     <div>
//       {/* Sidebar toggle button */}
//       <div
//         onClick={toggleSidebar}
//         className="fixed left-4 top-4 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded bg-white text-black shadow-md"
//       >
//         {/* Hamburger Icon */}
//         <div className="space-y-1">
//           <div className="h-1 w-6 bg-black"></div>
//           <div className="h-1 w-6 bg-black"></div>
//           <div className="h-1 w-6 bg-black"></div>
//         </div>
//       </div>

//       {/* Sidebar */}
//       <div
//         className={`fixed left-0 top-0 h-full w-64 transform bg-black text-white shadow-lg ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         } z-40 transition-transform duration-300`}
//       >
//         {/* Added pt-20 to create space below the hamburger icon */}
//         <div className="p-4 pt-20">
//           <ul className="space-y-6">
//             {' '}
//             {/* Increased space between buttons */}
//             {/* Home Button */}
//             <li>
//               <button
//                 onClick={() => {
//                   toggleSidebar()
//                   router.push('/')
//                 }}
//                 className="z-50 w-full rounded bg-white p-3 text-left text-black hover:bg-gray-200"
//               >
//                 Home
//               </button>
//             </li>
//             {/* My Videos Button */}
//             <li>
//               <button
//                 onClick={() => {
//                   toggleSidebar()
//                   router.push('/thumbnail')
//                 }}
//                 className="z-50 w-full rounded bg-white p-3 text-left text-black hover:bg-gray-200"
//               >
//                 My Videos
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => {
//                   toggleSidebar()
//                   router.push('/explore')
//                 }}
//                 className="z-50 w-full rounded bg-white p-3 text-left text-black hover:bg-gray-200"
//               >
//                 Explore Videos
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Overlay */}
//       {isOpen && (
//         <div
//           onClick={toggleSidebar}
//           className="fixed left-0 top-0 z-30 h-full w-full bg-black bg-opacity-50"
//         ></div>
//       )}
//     </div>
//   )
// }

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
        className="fixed left-4 top-4 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded bg-white text-black shadow-md"
      >
        {/* Hamburger Icon */}
        <div className="space-y-1">
          <div className="h-1 w-6 bg-black"></div>
          <div className="h-1 w-6 bg-black"></div>
          <div className="h-1 w-6 bg-black"></div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 transform bg-black text-white shadow-lg ${
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
                className="z-50 w-full rounded bg-white p-3 text-left text-black hover:bg-gray-200"
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
                className="z-50 w-full rounded bg-white p-3 text-left text-black hover:bg-gray-200"
              >
                My Videos
              </button>
            </li>
            {/* Explore Videos Button */}
            <li>
              <button
                onClick={() => {
                  toggleSidebar()
                  router.push('/explore')
                }}
                className="z-50 w-full rounded bg-white p-3 text-left text-black hover:bg-gray-200"
              >
                Explore Videos
              </button>
            </li>
            {/* About Us Button */}
            <li>
              <button
                onClick={() => {
                  toggleSidebar()
                  router.push('/')
                }}
                className="z-50 w-full rounded bg-white p-3 text-left text-black hover:bg-gray-200"
              >
                About Us
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
