'use client'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { FaKey } from "react-icons/fa6";
import { AiOutlineLogout } from "react-icons/ai";
import { useAuth } from "@/context/AuthContext";
import './topbar.css'

export default function Topbar({ textTopbar = "Dashboard", topBarIcon: TopBarIcon }) {
  const router = useRouter()
  const { token, logout } = useAuth()

  const handleLogout = async () => {
    if (!token) {
      toast.error('You are not logged in')
      router.push('/login')
      return
    }

    try {
      const res = await fetch('https://nortway.mrshakil.com/api/auth/logout/', {
        method: 'GET',
        headers: { Authorization: `Token ${token}` },
      })

      if (res.ok) {
        logout() // clear token from context + localStorage
        toast.success('Logged out successfully!')
        router.push('/login')
        router.refresh() // force UI update
      } else {
        let errData
        try {
          errData = await res.json()
        } catch {
          errData = { detail: 'Server returned an error' }
        }

        if (res.status === 401 || res.status === 403) {
          toast.error('Invalid or expired token. Please login again.')
          logout()
          router.push('/login')
          router.refresh()
        } else {
          toast.error(errData.detail || 'Failed to logout')
        }
      }
    } catch (err) {
      console.error('Logout error:', err)
      toast.error('Error connecting to server')
    }
  }

  return (
    <header className="p-4 bg-amber-50 z-40 text-gray-900">
      <div className="flex justify-between items-center">
        {/* Left side: Icon + Title */}
        <div className="flex items-center space-x-2">
          {TopBarIcon && <TopBarIcon className="w-6 h-6 text-[#FF9100]" />}
          <h3 className="font-semibold">{textTopbar}</h3>
        </div>

        {/* Right side: Actions */}
        <nav className="flex space-x-4">
          <Link href="/changepassword" className="btn-primary">
            <FaKey /> Change Password
          </Link>
          <button onClick={handleLogout} className="btn-danger">
            <AiOutlineLogout /> Logout
          </button>
        </nav>
      </div>
    </header>
  )
}
