'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import UserList from '@/components/UserList'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('users')
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    pendingVerifications: 0
  })

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else {
        // Get user attributes to check role
        user.getUserAttributes((err, attributes) => {
          if (err) {
            console.error('Error getting user attributes:', err)
            router.push('/profile')
            return
          }
          
          const roleAttribute = attributes?.find(attr => attr.Name === 'custom:role')
          if (!roleAttribute || roleAttribute.Value !== 'admin') {
            router.push('/profile')
          }
        })
      }
    }
  }, [user, loading, router])

  // Fetch admin stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      }
    }

    if (user && user.user_metadata?.role === 'admin') {
      fetchStats()
    }
  }, [user])

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Back to Profile
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-white/60 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-white/60 text-sm">New Users Today</p>
            <p className="text-3xl font-bold text-white mt-2">{stats.newUsersToday}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-white/60 text-sm">Active Users</p>
            <p className="text-3xl font-bold text-white mt-2">{stats.activeUsers}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-white/60 text-sm">Pending Verifications</p>
            <p className="text-3xl font-bold text-white mt-2">{stats.pendingVerifications}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/20'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/20'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/20'
              }`}
            >
              Logs
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          {activeTab === 'users' && (
            <UserList />
          )}
          
          {activeTab === 'settings' && (
            <div className="text-white">
              <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
              <p className="text-white/60">Settings panel is under development.</p>
            </div>
          )}
          
          {activeTab === 'logs' && (
            <div className="text-white">
              <h2 className="text-xl font-semibold mb-4">System Logs</h2>
              <p className="text-white/60">Logs panel is under development.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 