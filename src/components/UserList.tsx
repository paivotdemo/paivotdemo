'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function UserList() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        
        // In a real implementation, you would create an admin API endpoint
        // that uses Supabase's server-side admin functions to fetch users
        // For now, we'll use a mock implementation
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        setUsers(data || [])
      } catch (err: any) {
        console.error('Error fetching users:', err)
        setError(err.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [])

  if (loading) {
    return <div className="text-white text-center py-8">Loading users...</div>
  }

  if (error) {
    return <div className="text-red-400 text-center py-8">{error}</div>
  }

  if (users.length === 0) {
    return <div className="text-white text-center py-8">No users found</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-white">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Role</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/5">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-amber-400/20 flex items-center justify-center mr-3">
                    <span className="text-amber-400">
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    {user.full_name || 'Unnamed User'}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-white/60">
                {user.email}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {user.role || 'user'}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-white/60">
                {user.status || 'Active'}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-white/60">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 