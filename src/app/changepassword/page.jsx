'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import './change-password.css'

export default function ChangePassword () {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: ''
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.oldPassword || !formData.newPassword) {
      toast.error('Please fill all fields')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('You must be logged in to change your password')
      return
    }

    try {
      const res = await fetch(
        'https://nortway.mrshakil.com/api/auth/change-password/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`
          },
          body: JSON.stringify({
            old_password: formData.oldPassword,
            new_password: formData.newPassword
          })
        }
      )

      if (res.ok) {
        toast.success('Password changed successfully!')
        setFormData({ oldPassword: '', newPassword: '' })
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
            <label htmlFor='oldPassword' className='form-label'>
              Old Password
            </label>
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
            <label htmlFor='newPassword' className='form-label'>
              New Password
            </label>
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

          <button type='submit' className='button-primary'>
            Change Password
          </button>
        </form>
      </div>
    </div>
  )
}
