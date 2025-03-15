'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Search query:', searchQuery)
  }

  const handleLogout = async () => {
    await signOut()
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  // Get user metadata and profile image
  const userData = user?.user_metadata || {}
  const userImage = userData.avatar_url || '/default-avatar.png'
  const userName = userData.full_name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || user?.email

  const UserIcon = () => (
    <svg 
      className="w-full h-full text-white" 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        fillRule="evenodd" 
        d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" 
        clipRule="evenodd" 
      />
    </svg>
  )

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 pt-3 pb-1 ${
      isScrolled ? 'bg-black/95 backdrop-blur-sm shadow-md' : 'bg-black'
    }`}>
      <div className="max-w-[1470px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 w-20 md:w-24">
            <Link href="/" className="text-xl md:text-2xl font-bold text-white tracking-wider hover:text-amber-400 transition-colors">
              PAIVOT
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex justify-center max-w-xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 md:px-6 py-0.5 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-base md:text-lg text-white placeholder-white/50"
              />
            </form>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1 rounded-md text-white hover:bg-white/10 flex items-center h-full"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center justify-end space-x-3 lg:space-x-4">
            <Link 
              href="/"
              className="text-white hover:text-amber-400 px-3 py-1 text-base md:text-lg font-medium transition-colors whitespace-nowrap"
            >
              Home
            </Link>
            <Link 
              href="/about"
              className="text-white hover:text-amber-400 px-3 py-1 text-base md:text-lg font-medium transition-colors whitespace-nowrap"
            >
              About
            </Link>
            <Link 
              href="/contact"
              className="text-white hover:text-amber-400 px-3 py-1 text-base md:text-lg font-medium transition-colors whitespace-nowrap"
            >
              Contact
            </Link>
            {user ? (
              <div className="relative ml-3" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden border-2 border-amber-400 bg-white/10">
                    {userImage ? (
                      <Image
                        src={userImage}
                        alt="Profile"
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg py-1 z-50">
                    <div className="px-3 py-1.5 border-b border-white/10">
                      <p className="text-sm text-white font-medium">{userName}</p>
                      <p className="text-xs text-white/60">{user.email}</p>
                    </div>
                    <button
                      className="block w-full text-left px-3 py-1.5 text-sm text-white hover:bg-white/10 transition-colors"
                      onClick={() => {
                        console.log('Dashboard clicked - dropdown');
                        console.log('User state:', user);
                        setIsDropdownOpen(false);
                        router.push('/profile');
                      }}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-1.5 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login"
                className="bg-amber-400 text-white hover:bg-amber-500 px-3 py-1 rounded-full text-base font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2 border-t border-white/10">
            <div className="flex flex-col space-y-1">
              <Link 
                href="/"
                className="text-white hover:text-amber-400 px-2 py-1 text-sm font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about"
                className="text-white hover:text-amber-400 px-2 py-1 text-sm font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact"
                className="text-white hover:text-amber-400 px-2 py-1 text-sm font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {user ? (
                <>
                  <button
                    className="text-white hover:text-amber-400 px-2 py-1 text-sm font-medium transition-colors text-left w-full"
                    onClick={() => {
                      console.log('Dashboard clicked - mobile');
                      console.log('User state:', user);
                      setIsMobileMenuOpen(false);
                      router.push('/profile');
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-left text-white hover:text-amber-400 px-2 py-1 text-sm font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/login"
                  className="text-white hover:text-amber-400 px-2 py-1 text-sm font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 