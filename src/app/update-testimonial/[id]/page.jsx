"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { FaRegEdit } from "react-icons/fa"
import { FaPaperPlane } from "react-icons/fa"
import Topbar from "@/components/topbar/Topbar"

export default function UpdateTestimonial() {
  const { id } = useParams()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    region: "",
    video_url: "",
    star: 5,
    comments: ""
  })
  const [profileImage, setProfileImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const imageInputRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Unauthorized! Please login first.")
      return
    }

    fetch(`https://nortway.mrshakil.com/api/testimonial/${id}/`, {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name || "",
          designation: data.designation || "",
          region: data.region || "",
          video_url: data.video_url || "",
          star: data.star || 5,
          comments: data.comments || ""
        })
        if (data.profile_image) {
          setProfileImage({ url: data.profile_image })
        }
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
    setIsLoading(true)

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Unauthorized! Please login first.")
      setIsLoading(false)
      return
    }

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("designation", formData.designation)
      data.append("region", formData.region)
      data.append("video_url", formData.video_url)
      data.append("star", formData.star)
      data.append("comments", formData.comments)

      if (profileImage?.file) {
        data.append("profile_image", profileImage.file)
      }

      const res = await fetch(
        `https://nortway.mrshakil.com/api/testimonial/${id}/`,
        {
          method: "PUT",
          headers: { Authorization: `Token ${token}` },
          body: data
        }
      )

      if (res.ok) {
        toast.success("Testimonial updated successfully!")
        router.push("/manage-testimonial")
      } else {
        const errData = await res.json()
        toast.error(errData.detail || "Failed to update testimonial")
      }
    } catch (err) {
      console.error(err)
      toast.error("Error connecting to server")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section>
      <Topbar textTopbar="Update Testimonial" topBarIcon={FaRegEdit} />

      <div className="container">
        <h1 className="page-title">Update Testimonial</h1>

        <form onSubmit={handleSubmit} className="form-wrapper">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="designation">Designation</label>
              <input
                id="designation"
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="region">Region</label>
              <input
                id="region"
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="video_url">Video URL (optional)</label>
              <input
                id="video_url"
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="star">Star Rating (1–5)</label>
              <input
                id="star"
                type="number"
                name="star"
                value={formData.star}
                min={1}
                max={5}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Profile Image</label>
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={handleImageChange}
                className="form-input"
              />
              {profileImage && (
                <div className="image-preview-container">
                  <img
                    src={profileImage.url}
                    alt="Profile"
                    className="photo-preview"
                  />
                  {profileImage.name && (
                    <p className="text-sm text-gray-600 mt-1">
                      {profileImage.name}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="form-group col-span-3">
            <label htmlFor="comments">Comments</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              className="form-input"
              rows={4}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            <FaPaperPlane className='inline-block' /> {isLoading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </section>
  )
}
