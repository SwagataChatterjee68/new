'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import './change-password.css'
import { useRouter } from 'next/navigation'
export default function ChangePassword() {
  const router=useRouter()
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const { oldPassword, newPassword, confirmPassword } = formData

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all fields')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('You must be logged in to change your password')
      return
    }

    try {
      const res = await fetch('https://nortway.mrshakil.com/api/auth/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword
        })
      })

      if (res.ok) {
        toast.success('Password changed successfully!')
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
        router.push("/")
        
      } else {
        const errData = await res.json()
        toast.error(errData.detail || 'Failed to change password')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error connecting to server')
    }
  }

  return (
    <div className='page-container'>
      <div className='card'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Change Password</h1>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='oldPassword' className='form-label'>Old Password</label>
            <input
              type='password'
              id='oldPassword'
              name='oldPassword'
              value={formData.oldPassword}
              onChange={handleChange}
              className='form-input'
              placeholder='Enter old password'
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='newPassword' className='form-label'>New Password</label>
            <input
              type='password'
              id='newPassword'
              name='newPassword'
              value={formData.newPassword}
              onChange={handleChange}
              className='form-input'
              placeholder='Enter new password'
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='confirmPassword' className='form-label'>Confirm Password</label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className='form-input'
              placeholder='Confirm new password'
              required
            />
          </div>

          <button type='submit' className='btn'>
            Change Password
          </button>
        </form>
      </div>
    </div>
  )
}
