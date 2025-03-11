'use client'

import { useEffect, useState } from 'react'
import { useAuthSession } from '@/lib/auth'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  createdAt: string
}

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuthSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkEmail, setCheckEmail] = useState('')
  const [checkResult, setCheckResult] = useState<any>(null)
  const [checking, setChecking] = useState(false)
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)

  useEffect(() => {
    // Only allow access if the user is authenticated and has admin role
    if (!isLoading && isAuthenticated) {
      if (user?.role !== 'admin') {
        router.push('/profile')
      } else {
        fetchUsers()
      }
    } else if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch users')
      }
      
      const data = await response.json()
      setUsers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkAdminStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkEmail.trim()) return
    
    try {
      setChecking(true)
      setCheckResult(null)
      
      const response = await fetch('/api/admin/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: checkEmail.trim() }),
      })
      
      const data = await response.json()
      setCheckResult(data)
    } catch (err) {
      setCheckResult({ error: 'Failed to check status' })
      console.error('Error checking status:', err)
    } finally {
      setChecking(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    if (actionInProgress) return;
    
    try {
      setActionInProgress(userId);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update user role to ${newRole}`);
      }
      
      // Update the local state to reflect the change
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      // Show success message
      alert(`User role updated to ${newRole} successfully`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating user role:', err);
    } finally {
      setActionInProgress(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (actionInProgress) return;
    
    // Confirm before deleting
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      setActionInProgress(userId);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
      
      // Remove the user from the local state
      setUsers(users.filter(u => u.id !== userId));
      
      // Show success message
      alert('User deleted successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting user:', err);
    } finally {
      setActionInProgress(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null // This will never render because the useEffect will redirect
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700"
            >
              Back to Profile
            </button>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Check Admin Status</h2>
            <form onSubmit={checkAdminStatus} className="flex items-end space-x-4 mb-6">
              <div className="flex-1">
                <label htmlFor="checkEmail" className="block text-sm font-medium text-white mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="checkEmail"
                  value={checkEmail}
                  onChange={(e) => setCheckEmail(e.target.value)}
                  placeholder="Enter email to check"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/40"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={checking}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
              >
                {checking ? 'Checking...' : 'Check Status'}
              </button>
            </form>
            
            {checkResult && (
              <div className="bg-white/10 rounded-md p-4 mb-6 border border-white/20">
                {checkResult.error ? (
                  <p className="text-red-400">{checkResult.error}</p>
                ) : !checkResult.exists ? (
                  <p className="text-white">User with email <span className="text-amber-400">{checkEmail}</span> does not exist.</p>
                ) : (
                  <div>
                    <p className="text-white">
                      User <span className="text-amber-400">{checkEmail}</span> exists with role: 
                      <span className={checkResult.isAdmin ? "text-purple-400 ml-2" : "text-green-400 ml-2"}>
                        {checkResult.role}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">User Management</h2>
            
            {loading ? (
              <p className="text-white">Loading users...</p>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered On
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {user.image ? (
                                <img
                                  className="h-8 w-8 rounded-full mr-3"
                                  src={user.image}
                                  alt={user.name || ''}
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                                  <span className="text-gray-500">
                                    {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                                  </span>
                                </div>
                              )}
                              <div className="text-sm font-medium text-gray-900">
                                {user.name || 'Unnamed User'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {user.role === 'admin' ? (
                                <button
                                  onClick={() => updateUserRole(user.id, 'user')}
                                  disabled={actionInProgress === user.id}
                                  className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                >
                                  {actionInProgress === user.id ? 'Processing...' : 'Remove Admin'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateUserRole(user.id, 'admin')}
                                  disabled={actionInProgress === user.id}
                                  className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                                >
                                  {actionInProgress === user.id ? 'Processing...' : 'Make Admin'}
                                </button>
                              )}
                              <button
                                onClick={() => deleteUser(user.id)}
                                disabled={actionInProgress === user.id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50 ml-4"
                              >
                                {actionInProgress === user.id ? 'Processing...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 