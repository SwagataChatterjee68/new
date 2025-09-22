'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import './manage-testimonial.css'
import Topbar from '@/components/topbar/Topbar'
import { TiMessages } from 'react-icons/ti'

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    fetch('https://nortway.mrshakil.com/api/testimonial/')
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error(err))
  }, [])

  const handleDelete = async id => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized! Please login first.')
      return
    }

    try {
      const res = await fetch(
        `https://nortway.mrshakil.com/api/testimonial/${id}/`,
        {
          method: 'DELETE',
          headers: { Authorization: `Token ${token}` }
        }
      )
      if (res.ok) {
        setTestimonials(prev => prev.filter(t => t.id !== id))
        toast.success('Testimonial deleted!')
      } else {
        const errData = await res.json()
        toast.error(errData.detail || 'Failed to delete testimonial')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error deleting testimonial')
    }
  }

  return (
    <section>
      <Topbar topBarIcon={TiMessages} textTopbar='Manage Testimonials' />
      <div className='container'>
        <h1 className='page-title'>Manage Testimonials</h1>

        {testimonials.length === 0 ? (
          <p className='empty-text'>No testimonials found.</p>
        ) : (
          <div className='card-grid'>
            {testimonials.map(t => (
              <div key={t.id} className='testimonial-card'>
                {/* Video at the top */}
                {t.video_url && (
                  <video controls className='card-video'>
                    <source src={t.video_url} type='video/mp4' />
                    Your browser does not support the video tag.
                  </video>
                )}

                {/* Name, designation, star */}
                <div className='card-header'>
                  <img
                    src={t.profile_image}
                    alt={t.name}
                    className='card-profile'
                  />
                  <div className='card-info'>
                    <h2 className='card-title'>{t.name}</h2>
                    <p className='card-designation'>{t.designation}</p>
                  </div>
                  {t.star && <p className='card-star'>⭐ {t.star}</p>}
                </div>

                {/* Update & Delete buttons */}
                <div className='card-actions justify-between'>
                  <Link href={`/update-testimonial/${t.id}`}>
                    <button className='update-btn'>Update</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className='delete-btn'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
