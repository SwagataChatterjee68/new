'use client'

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import './manage-photo.css'
import Topbar from '@/components/topbar/Topbar'
import { FaPhotoFilm,FaPaperPlane } from 'react-icons/fa6'
import { MdDelete } from "react-icons/md";

export default function ManagePhotos() {
  const [photos, setPhotos] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [title, setTitle] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)
  const fileInputRef = useRef(null)

  const API_BASE = 'https://nortway.mrshakil.com/api/gallery/photo/'

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Fetch existing photos
  useEffect(() => {
    if (!isHydrated) return

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized! Please login first.')
      return
    }

    fetch(API_BASE, { headers: { Authorization: `Token ${token}` } })
      .then(res => res.json())
      .then(data => {
        // Handle different API response shapes
        const photoArray = Array.isArray(data)
          ? data
          : data.results || data.photos || []

        setPhotos(
          photoArray.map(p => ({
            ...p,
            photo: p.photo || '/placeholder.jpg',
            title: p.title || 'Untitled',
          }))
        )
      })
      .catch(err => {
        console.error('Error fetching photos:', err)
        setPhotos([])
      })
  }, [isHydrated])

  // Update previews for newly selected files
  useEffect(() => {
    const previewUrls = selectedFiles.map(file => URL.createObjectURL(file))
    setPreviews(previewUrls)
    return () => previewUrls.forEach(url => URL.revokeObjectURL(url))
  }, [selectedFiles])

  const handleFileChange = e => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
  }

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      toast.error('Please select photos first!')
      return
    }

    if (!title.trim()) {
      toast.error('Please enter a photo title!')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized! Please login first.')
      return
    }

    try {
      const uploadedPhotos = []

      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append('photo', file)
        formData.append('title', title)

        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { Authorization: `Token ${token}` },
          body: formData,
        })

        if (!res.ok) {
          const errData = await res.json()
          toast.error(errData.detail || 'Failed to upload photo')
          continue
        }

        const savedPhoto = await res.json()
        uploadedPhotos.push({
          ...savedPhoto,
          photo: savedPhoto.photo || '/placeholder.jpg',
          title: savedPhoto.title || title,
        })
      }

      setPhotos(prev => [...prev, ...uploadedPhotos])
      setSelectedFiles([])
      setPreviews([])
      setTitle('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      toast.success('Photo(s) uploaded successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Error uploading photo(s)')
    }
  }

  const handleDelete = async id => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized! Please login first.')
      return
    }

    try {
      const res = await fetch(`${API_BASE}${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      })

      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.id !== id))
        toast.success('Photo deleted!')
      } else {
        const errData = await res.json()
        toast.error(errData.detail || 'Failed to delete photo')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error deleting photo')
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar textTopbar="Manage Photos" topBarIcon={FaPhotoFilm} />
      <div className="container">
        <h1 className="page-title">Manage Photos</h1>

        {/* Upload Section */}
        <div className="input-wrapper">
          <label className="form-label">
            Photo Title
            <input
              type="text"
              placeholder="Enter photo title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="input"
            />
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="input"
          />
          <button onClick={handleUpload} className="submit-btn">
          <FaPaperPlane className='inline-block'/> Upload
          </button>
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="photos-grid">
            {previews.map((url, idx) => (
              <div key={idx} className="photo-item">
                <img
                  src={url}
                  alt={selectedFiles[idx]?.name || 'Preview'}
                  className="photo-img"
                />
                <p className="photo-name">
                  {title || selectedFiles[idx]?.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Photos */}
        {photos.length > 0 && (
          <div className="photos-grid">
            {photos.map(photo => (
              <div key={photo.id} className="photo-item">
                <img
                  src={
                    photo.photo?.startsWith('http')
                      ? photo.photo
                      : `https://nortway.mrshakil.com${photo.photo}`
                  }
                  alt={photo.title}
                  className="photo-img"
                />
                <p className="photo-name">{photo.title}</p>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="photo-delete"
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