'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isScrolled ? 'bg-black/95 backdrop-blur-sm shadow-md' : 'bg-black'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 md:h-20 py-2 md:py-4">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 w-24 md:w-32">
            <Link href="/" className="text-xl md:text-2xl font-bold text-white tracking-wider hover:text-amber-400 transition-colors">
              PAIVOT
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex justify-center max-w-md">
            <form onSubmit={handleSearch} className="w-full max-w-sm relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm text-white placeholder-white/50"
              />
            </form>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center justify-end w-32 ml-auto space-x-4 md:space-x-6">
            <Link 
              href="/"
              className="text-white hover:text-amber-400 px-2 md:px-3 py-1.5 md:py-2 text-lg md:text-xl font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/about"
              className="text-white hover:text-amber-400 px-2 md:px-3 py-1.5 md:py-2 text-lg md:text-xl font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact"
              className="text-white hover:text-amber-400 px-2 md:px-3 py-1.5 md:py-2 text-lg md:text-xl font-medium transition-colors"
            >
              Contact
            </Link>
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-amber-400 bg-white/10">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm text-white font-medium">{session.user?.name}</p>
                      <p className="text-xs text-white/60">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login"
                className="bg-amber-400 text-white hover:bg-amber-500 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-xl font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 