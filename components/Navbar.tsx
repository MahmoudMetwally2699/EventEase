'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg backdrop-blur-md bg-opacity-80 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
            >
              Home
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>
                <Link
                  href="/events/create"
                  className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
                >
                  Create Event
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/signin"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button - Fixed version */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/events/create"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Event
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
