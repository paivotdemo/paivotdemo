'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Profile() {
  const router = useRouter()
  const { user, signOut, loading } = useAuth()
  const [profileImage, setProfileImage] = useState('/default-avatar.png')
  const [bannerImage, setBannerImage] = useState('/default-banner.jpg')

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // If still loading or no user, show loading state
  if (loading || !user) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </main>
    )
  }

  const projects = [
    { id: 1, name: "Career Path Analysis", progress: 75, status: "In Progress" },
    { id: 2, name: "Skills Assessment", progress: 100, status: "Completed" },
    { id: 3, name: "Interview Preparation", progress: 30, status: "In Progress" },
  ]

  const stats = [
    { label: "Completed Projects", value: "12" },
    { label: "Skills Acquired", value: "24" },
    { label: "Hours Invested", value: "156" },
    { label: "Achievements", value: "8" },
  ]

  // Get user metadata
  const userData = user.user_metadata || {}
  const fullName = userData.full_name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || user.email
  const userRole = userData.role || 'user'

  return (
    <main className="min-h-screen bg-black">
      {/* Banner */}
      <div className="relative h-80 w-full">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-amber-500/30 to-amber-700/30" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex items-end px-8 pb-8">
          <div className="flex items-end space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-black bg-black">
                <Image
                  src={user.user_metadata?.avatar_url || profileImage}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-amber-400 p-2 rounded-full hover:bg-amber-500 transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            {/* Profile Info */}
            <div className="mb-2">
              <h1 className="text-4xl font-bold text-white">{fullName}</h1>
              <p className="text-white/60">{user.email}</p>
              <div className="flex items-center mt-2 space-x-3">
                {userRole === 'admin' && (
                  <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm inline-block">
                    Admin
                  </span>
                )}
                {userRole === 'admin' && (
                  <button
                    onClick={() => router.push('/admin')}
                    className="text-amber-400 hover:text-amber-300 text-sm"
                  >
                    Admin Dashboard →
                  </button>
                )}
                <button
                  onClick={signOut}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <p className="text-white/60 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Current Projects</h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white/5 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium text-white">{project.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    project.status === "Completed" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-amber-400 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-white/60 text-sm mt-2">{project.progress}% Complete</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 