'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import './manage-testimonial.css'
import Topbar from '@/components/topbar/Topbar'
import { TiMessages } from 'react-icons/ti'

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([])

  // Fetch all testimonials
  useEffect(() => {
    fetch('https://nortway.mrshakil.com/api/testimonial/')
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error(err))
  }, [])

  // Delete testimonial
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

                {/* Card body */}
                <div className='card-body'>
                  <div className='card-header'>
                    <img
                      src={t.profile_image}
                      alt={t.name}
                      className='card-profile'
                    />
                    <div>
                      <h2 className='card-title'>{t.name}</h2>
                      <p className='card-designation'>{t.designation}</p>
                      {t.region && <p className='card-region'>{t.region}</p>}
                      {t.star && <p className='card-star'>⭐ {t.star}</p>}
                    </div>
                  </div>

                  {t.comments && <p className='card-comments'>{t.comments}</p>}

                  <div className='card-actions'>
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
              </div>
            ))}
          </div>

        )}
      </div>
    </section>
  )
}
