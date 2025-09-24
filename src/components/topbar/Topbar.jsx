'use client'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { FaKey,FaBars } from "react-icons/fa6";
import { AiOutlineLogout } from "react-icons/ai";
import { useAuth } from "@/context/AuthContext";
import DashboardNavbar from '../navbar/Navbar';
import { useState } from "react";
import './topbar.css'

export default function Topbar({ textTopbar = "Dashboard", topBarIcon: TopBarIcon }) {
  const router = useRouter()
  const { token, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        logout()
        toast.success('Logged out successfully!')
        router.push('/login')
        router.refresh()
      } else {
        let errData
        try { errData = await res.json() } catch { errData = { detail: 'Server returned an error' } }
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
    <>
      <header className="p-4 bg-amber-50 z-40 text-gray-900 shadow-sm flex justify-between items-center">
        {/* Left side: Icon + Title */}
        <div className="flex items-center space-x-2">
          {TopBarIcon && <TopBarIcon className="w-6 h-6 text-[#FF9100]" />}
          <h3 className="font-semibold truncate">{textTopbar}</h3>
        </div>

        {/* Desktop actions */}
        <nav className="hidden sm:flex items-center space-x-4">
          <Link href="/changepassword" className="btn-primary">
            <FaKey className="flex-shrink-0" />
            <span>Change Password</span>
          </Link>
          <button onClick={handleLogout} className="btn-danger">
            <AiOutlineLogout className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg bg-white shadow"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <AiOutlineLogout /> : <FaBars />}
        </button>
      </header>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <DashboardNavbar
          open={mobileMenuOpen}
          setOpen={setMobileMenuOpen}
          handleLogout={handleLogout}
        />
      )}
    </>
  )
}
