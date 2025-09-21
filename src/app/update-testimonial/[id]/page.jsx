'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import './update-testimonial.css' // reuse the same styles
import { FaVideo } from 'react-icons/fa'
import Topbar from '@/components/topbar/Topbar'

export default function UpdateTestimonial() {
  const { id } = useParams()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    region: '',
    video_url: '',
    star: '',
    comments: ''
  })
  const [video, setVideo] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const videoInputRef = useRef(null)
  const imageInputRef = useRef(null)

  // Fetch testimonial by ID
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized! Please login first.')
      return
    }

    fetch(`https://nortway.mrshakil.com/api/testimonial/${id}/`, {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name || '',
          designation: data.designation || '',
          region: data.region || '',
          video_url: data.video_url || '',
          star: data.star || '',
          comments: data.comments || ''
        })
        if (data.profile_image) setProfileImage({ url: data.profile_image })
        if (data.video_url) setVideo({ url: data.video_url })
      })
      .catch(err => console.error(err))
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setProfileImage({
      name: file.name,
      file,
      url: URL.createObjectURL(file)
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized! Please login first.')
      return
    }

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('designation', formData.designation)
      data.append('region', formData.region)
      data.append('video_url', formData.video_url)
      data.append('star', formData.star)
      data.append('comments', formData.comments)

      if (profileImage?.file) data.append('profile_image', profileImage.file)

      const res = await fetch(
        `https://nortway.mrshakil.com/api/testimonial/${id}/`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Token ${token}`
          },
          body: data
        }
      )

      if (res.ok) {
        toast.success('Testimonial updated successfully!')
        router.push('/manage-testimonial')
      } else {
        const errData = await res.json()
        toast.error(errData.detail || 'Failed to update testimonial')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error connecting to server')
    }
  }

  return (
    <section>
      <Topbar textTopbar='Manage Videos' topBarIcon={FaVideo} />

      <div className='page-container'>

        <h1 className='page-title'>Update Testimonial</h1>

        <form onSubmit={handleSubmit} className='form-wrapper'>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Name'
            className='form-input'
          />

          <input
            type='text'
            name='designation'
            value={formData.designation}
            onChange={handleChange}
            placeholder='Designation'
            className='form-input'
          />

          <input
            type='text'
            name='region'
            value={formData.region}
            onChange={handleChange}
            placeholder='Region'
            className='form-input'
          />

          <input
            type='text'
            name='video_url'
            value={formData.video_url}
            onChange={handleChange}
            placeholder='Video URL (optional)'
            className='form-input'
          />

          <input
            type='number'
            name='star'
            value={formData.star}
            min={1}
            max={5}
            onChange={handleChange}
            className='form-input'
          />

          <textarea
            name='comments'
            value={formData.comments}
            onChange={handleChange}
            placeholder='Comments'
            className='form-input'
          />

          <div className='form-group'>
            <label>Profile Image</label>
            <input
              type='file'
              accept='image/*'
              ref={imageInputRef}
              onChange={handleImageChange}
              className='form-input'
            />
            {profileImage && (
              <img
                src={profileImage.url}
                alt='Profile'
                className='photo-preview'
              />
            )}
          </div>

          <button type='submit' className='submit-btn'>
            Update
          </button>
        </form>
      </div>
    </section>
  )
}
