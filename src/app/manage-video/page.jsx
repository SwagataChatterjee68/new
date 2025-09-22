'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import './manage-video.css'
import Topbar from '@/components/topbar/Topbar'
import { FaVideo,FaPaperPlane } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

export default function ManageVideos () {
  const [videos, setVideos] = useState([])
  const [title, setTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Fetch videos
  useEffect(() => {
    if (!isHydrated) return
    
    fetch('https://nortway.mrshakil.com/api/gallery/video/')
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error('Error fetching videos:', err))
  }, [isHydrated])

  const handleUpload = async () => {
    if (!title || !videoUrl) {
      toast.error('Please provide both title and video URL!')
      return
    }

    try {
      const res = await fetch(
        'https://nortway.mrshakil.com/api/gallery/video/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, videoUrl })
        }
      )

      if (!res.ok) throw new Error('Upload failed')

      const savedVideo = await res.json()
      setVideos(prev => [...prev, savedVideo])

      // reset form
      setTitle('')
      setVideoUrl('')
      toast.success('Video uploaded successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Error uploading video')
    }
  }

  const handleDelete = async id => {
    try {
      await fetch(`https://nortway.mrshakil.com/api/gallery/video/${id}/`, {
        method: 'DELETE'
      })
      setVideos(videos.filter(v => v.id !== id))
      toast.success('Video deleted!')
    } catch (err) {
      console.error(err)
      toast.error('Error deleting video')
    }
  }
  console.log(videos)
  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Topbar textTopbar='Manage Videos' topBarIcon={FaVideo} />
      <div className='container'>
        <h1 className='page-title'>Manage Videos</h1>

        {/* Form */}
        <div className='form-wrapper'>
          <label className='form-label'>
            Video Title
            <input
              type='text'
              placeholder='Enter video title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              className='input'
            />
          </label>

          <label className='form-label'>
            Video URL
            <input
              type='text'
              placeholder='https://example.com/video.mp4'
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              className='input'
            />
          </label>

          <button onClick={handleUpload} className='submit-btn'>
            <FaPaperPlane /> Upload
          </button>
        </div>
        {/* List */}
        {videos.length > 0 && (
          <div className='videos-grid'>
            {videos.map(video => (
              <div key={video.id} className='video-item'>
                <video
                  src={video.videoUrl}
                  controls
                  className='video-preview'
                />
                <p className='video-name'>{video.title}</p>
                <button
                  onClick={() => handleDelete(video.id)}
                  className='video-delete'
                >
                 <MdDelete className='text-4xl p-1' />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
