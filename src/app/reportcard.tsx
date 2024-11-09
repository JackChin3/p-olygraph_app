// // // app/report-card/page.tsx
// // export default function ReportCard() {
// //     return (
// //       <div className="flex w-full flex-1 flex-col items-center gap-8 p-8">
// //         <h1 className="text-2xl font-semibold">Video Analysis Report</h1>
// //         <div className="w-full max-w-2xl rounded-lg border p-6">
// //           <p>Video analysis results will appear here...</p>
// //         </div>
// //       </div>
// //     )
// //   }

// // app/report-card/page.tsx
// 'use client'
// import { useSearchParams } from 'next/navigation'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/CardComponents'

// export default function ReportCard() {
//   return (
//     <div className="flex w-full flex-1 flex-col">
//       <header className="flex w-full justify-center border-b border-b-foreground/10 py-4">
//         <h1 className="text-2xl font-light tracking-wide">Analysis Report</h1>
//       </header>

//       <div className="container mx-auto flex flex-1 gap-8 p-8">
//         {/* Left Column - Video Playback */}
//         <div className="flex w-1/2 flex-col gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Video Playback</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
//                 <video
//                   className="h-full w-full object-contain"
//                   controls
//                   playsInline
//                 >
//                   <p>Your browser does not support the video tag.</p>
//                 </video>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Column - Performance Metrics */}
//         <div className="flex w-1/2 flex-col gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Your Video Performance</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {/* Placeholder for future ML scores */}
//                 <div className="rounded-lg border border-gray-200 p-4">
//                   <h3 className="mb-2 text-lg font-medium">Accuracy Scores</h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Truthfulness Rating</span>
//                       <span className="font-medium">Pending Analysis</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Confidence Score</span>
//                       <span className="font-medium">Pending Analysis</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Consistency Level</span>
//                       <span className="font-medium">Pending Analysis</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Additional metrics section */}
//                 <div className="rounded-lg border border-gray-200 p-4">
//                   <h3 className="mb-2 text-lg font-medium">Additional Metrics</h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Video Duration</span>
//                       <span className="font-medium">Calculating...</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Analysis Status</span>
//                       <span className="font-medium text-blue-600">Processing</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

// app/reportcard/page.tsx
'use client'
import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/CardComponents'

export default function ReportCard() {
  const searchParams = useSearchParams()
  const videoURL = searchParams.get('videoURL') // Retrieve video URL from query parameter
  console.log('Retrieved videoURL in ReportCard:', videoURL) // Debugging log

  return (
    <div className="flex w-full flex-1 flex-col">
      <header className="flex w-full justify-center border-b border-b-foreground/10 py-4">
        <h1 className="text-2xl font-light tracking-wide">Analysis Report</h1>
      </header>

      <div className="container mx-auto flex flex-1 gap-8 p-8">
        {/* Left Column - Video Playback */}
        <div className="flex w-1/2 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Playback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                {videoURL ? (
                  <video
                    className="h-full w-full object-contain"
                    controls
                    playsInline
                    src={videoURL} // Set video source to the submitted video URL
                  >
                    <p>Your browser does not support the video tag.</p>
                  </video>
                ) : (
                  <p className="text-center text-gray-500">
                    No video to display.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Performance Metrics */}
        <div className="flex w-1/2 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Video Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 text-lg font-medium">
                  Put Video Performance Results Here
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
