'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Check if video is playing
    const video = videoRef.current
    if (video) {
      video.play().catch(error => {
        console.error("Video playback error:", error)
      })
    }
  }, [])

  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onError={(e) => console.error("Video error:", e)}
          >
            <source src="/videos/0227.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Content Container */}
        <div className="relative z-20 w-full max-w-[1470px] mx-auto px-4">
          {/* PAIVOT Text */}
          <div className="flex flex-col items-center -mt-[10vh]">
            <h1 className="text-[6rem] md:text-[8rem] lg:text-[10rem] font-bold text-white/60 select-none">
              PAIVOT
            </h1>
            <Link 
              href="/login" 
              className="mt-2.5 md:mt-3.5 px-4 md:px-6 py-2 md:py-2.5 text-base md:text-lg lg:text-xl font-medium text-white bg-amber-400/50 hover:bg-amber-500/50 rounded-full backdrop-blur-sm transition-all duration-300 border border-white/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-[1470px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="bg-blue-50 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Career Assessment</h3>
              <p className="text-sm md:text-base text-gray-600">
                Take our AI-powered assessment to discover careers that match your skills and personality.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Personalized Guidance</h3>
              <p className="text-sm md:text-base text-gray-600">
                Get tailored recommendations and insights based on your unique profile.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Professional Network</h3>
              <p className="text-sm md:text-base text-gray-600">
                Connect with mentors and peers in your desired industry.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
