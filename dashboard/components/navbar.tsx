'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white border-b border-[#E0E0E0] shadow-sm">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-gradient-to-br from-[#EF7722] to-[#FAA533] rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <div className="font-bold text-gray-900 text-xl leading-none">
                MedReminder
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Smart Medication System</div>
            </div>
          </Link>

          {/* Nav Links & User Menu */}
          <div className="flex items-center gap-2">
            <NavLink href="/" label="Dashboard" />
            <NavLink href="/alarms" label="Alarms" />
            <NavLink href="/stats" label="Statistics" />
            <NavLink href="/settings" label="Settings" />

            {/* User Profile Dropdown */}
            {session?.user && (
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#FAFAFA] transition-all border-2 border-[#EBEBEB]"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-8 w-8 rounded-full border-2 border-[#0BA6DF]"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#0BA6DF] to-[#0995C9] flex items-center justify-center text-white font-bold">
                      {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-bold text-gray-900 leading-none">
                      {session.user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                  </div>
                  <svg
                    className={`h-4 w-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-[#EBEBEB] rounded-lg shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b-2 border-[#EBEBEB]">
                      <p className="text-sm font-bold text-gray-900">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-[#EF7722] hover:bg-[#FFF5ED] rounded-lg transition-all"
    >
      {label}
    </Link>
  )
}
