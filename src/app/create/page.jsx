'use client'
import { useState } from 'react'
import { FaBlog, FaPaperPlane } from 'react-icons/fa'
import { Editor } from '@tinymce/tinymce-react'
import { toast } from 'sonner'
import '../globals.css'
import PermissionBox from '@/components/modal/Permission'
import './create.css'
import Topbar from '@/components/topbar/Topbar'

export default function CreateBlog() {
  const [formData, setFormData] = useState({
    title: '',
    writer: '',
    short_summary: '',
    content: '',
    pdf_file: null, // file object
    thumbnail: null // file object
  })

  const [showPermission, setShowPermission] = useState(false)

  // for text inputs
  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // for file inputs
  const handleFileChange = e => {
    const { name, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files[0] // store the file object
    }))
  }

  const handleEditorChange = content => {
    setFormData(prev => ({ ...prev, content }))
  }

  const confirmCreate = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized! Please login first.')
      setShowPermission(false)
      return
    }

    try {
      // use FormData for file + text mix
      const blogFormData = new FormData()
      blogFormData.append('title', formData.title)
      blogFormData.append('writer', formData.writer)
      blogFormData.append('short_summary', formData.short_summary)
      blogFormData.append('content', formData.content)
      if (formData.pdf_file) blogFormData.append('pdf_file', formData.pdf_file)
      if (formData.thumbnail)
        blogFormData.append('thumbnail', formData.thumbnail)

      const res = await fetch('https://nortway.mrshakil.com/api/blogs/blog/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}` // ❌ don’t set Content-Type, browser will do it
        },
        body: blogFormData
      })

      if (res.ok) {
        toast.success('Blog created successfully!')
        setFormData({
          title: '',
          writer: '',
          short_summary: '',
          content: '',
          pdf_file: null,
          thumbnail: null
        })
      } else {
        const errorData = await res.json()
        console.log('Error response:', errorData)
        toast.error(errorData.detail || 'Failed to create blog')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error connecting to server')
    } finally {
      setShowPermission(false)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    setShowPermission(true)
  }

  return (
    <div >
      <Topbar textTopbar='Create New Blog' topBarIcon={FaBlog} />
      <main className='container'>
        <div className=''>
          <h1 className='form-title'>Create New Blog</h1>
          <p className='form-subtitle'>
            Fill in the details below to publish your blog.
          </p>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title & Writer */}
            <div className='form-row'>
              <div className='form-group'>
                <label className='form-label'>Blog Title</label>
                <input
                  type='text'
                  name='title'
                  className='form-input'
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label className='form-label'>Writer Name</label>
                <input
                  type='text'
                  name='writer'
                  className='form-input'
                  value={formData.writer}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Short Summary */}
            <div className='form-group'>
              <label className='form-label'>Short Summary</label>
              <textarea
                name='short_summary'
                className='form-textarea'
                value={formData.short_summary}
                onChange={handleChange}
                required
              />
            </div>

            {/* Thumbnail Upload */}
            <div className='form-group'>
              <label className='form-label'>Thumbnail (Image)</label>
              <input
                type='file'
                name='thumbnail'
                accept='image/*'
                className='form-input'
                onChange={handleFileChange}
              />
            </div>

            {/* PDF Upload */}
            <div className='form-group'>
              <label className='form-label'>PDF File</label>
              <input
                type='file'
                name='pdf_file'
                accept='application/pdf'
                className='form-input'
                onChange={handleFileChange}
              />
            </div>

            {/* Editor */}
            <div className='form-group'>
              <label className='form-label'>Start Writing</label>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={formData.content}
                required
                onEditorChange={handleEditorChange}
                init={{
                  menubar: false,
                  branding: false,
                  plugins: [
                    "anchor",
                    "autolink",
                    "charmap",
                    "codesample",
                    "emoticons",
                    "link",
                    "lists",
                    "media",
                    "searchreplace",
                    "table",
                    "visualblocks",
                    "wordcount",
                    "checklist",
                    "mediaembed",
                    "casechange",
                    "formatpainter",
                    "pageembed",
                    "a11ychecker",
                    "tinymcespellchecker",
                    "permanentpen",
                    "powerpaste",
                    "advtable",
                    "advcode",
                    "advtemplate",
                    "mentions",
                    "tableofcontents",
                    "footnotes",
                    "mergetags",
                    "autocorrect",
                    "typography",
                    "inlinecss",
                    "markdown",
                    "importword",
                    "exportword",
                    "exportpdf",
                  ],
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | " +
                    "bold italic underline strikethrough | link media table mergetags | " +
                    "align lineheight | checklist numlist bullist indent outdent | " +
                    "emoticons charmap | removeformat",
                }}
              />
            </div>
            <button type='submit' className='submit-btn'>
              <FaPaperPlane /> Submit Blog
            </button>
          </form>
        </div>
      </main>
      <PermissionBox
        isOpen={showPermission}
        onConfirm={confirmCreate}
        onCancel={() => setShowPermission(false)}
        action='create'
      />
    </div>
  )
}
