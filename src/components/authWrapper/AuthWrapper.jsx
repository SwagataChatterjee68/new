'use client'
import { useEffect, useState } from 'react'
import DashboardNavbar from '../navbar/Navbar' // renamed import
import LoginPage from '@/app/login/page'
import './authwrapper.css'
import { AuthProvider, useAuth } from '@/context/AuthContext'

// Inner component
function AuthContent ({ children }) {
  const { token, isHydrated } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  // Prevent hydration mismatch by showing loading until hydrated
  if (!isHydrated || loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    )
  }

  return token ? (
    <div className='min-h-screen bg-gray-50 overflow-x-hidden'>
      <div className='flex min-h-screen'>
        {/* Sidebar */}
        <aside className='hidden lg:block lg:w-64 xl:w-72 bg-amber-50 border-r border-gray-200 flex-shrink-0'>
          <DashboardNavbar />
        </aside>
        
        {/* Main Content */}
        <main className='flex-1 min-w-0 bg-white'>
          <div className='h-full overflow-y-auto'>
            {children}
          </div>
        </main>
      </div>
    </div>
  ) : (
    <LoginPage />
  )
}

export default function AuthWrapper ({ children }) {
  return (
    <AuthProvider>
      <AuthContent>{children}</AuthContent>
    </AuthProvider>
  )
}
