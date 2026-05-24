import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

export default function EditPost() {
  const { id } = useParams()
  const [form, setForm] = useState({
    title: '',
    description: '',
    github_url: '',
    demo_url: '',
    image_url: '',
    tags: ''
  })
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/posts/${id}`)
        const { title, description, github_url, demo_url, image_url, tags } = res.data
        setForm({
          title,
          description,
          github_url: github_url || '',
          demo_url: demo_url || '',
          image_url: image_url || '',
          tags: tags || ''
        })
        if (image_url) setImagePreview(image_url)
      } catch (err) {
        setError('Failed to load post')
      } finally {
        setFetching(false)
      }
    }
    fetchPost()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImagePreview(URL.createObjectURL(file))
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post('http://127.0.0.1:8000/posts/upload-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setForm(prev => ({ ...prev, image_url: res.data.image_url }))
    } catch (err) {
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.put(`http://127.0.0.1:8000/posts/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate('/admin')
    } catch (err) {
      setError('Failed to update post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      Loading...
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Edit Post</h1>
        <button
          onClick={() => navigate('/admin')}
          className="text-gray-400 hover:text-white transition text-sm"
        >
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">GitHub URL</label>
            <input
              type="url"
              name="github_url"
              value={form.github_url}
              onChange={handleChange}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Demo URL</label>
            <input
              type="url"
              name="demo_url"
              value={form.demo_url}
              onChange={handleChange}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Project Image</label>
            <div
              className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer"
              onClick={() => document.getElementById('imageInput').click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-48 object-cover rounded-lg" />
              ) : (
                <div>
                  <p className="text-gray-500 text-sm">Click to upload image</p>
                  <p className="text-gray-600 text-xs mt-1">PNG, JPG, WEBP supported</p>
                </div>
              )}
              {uploading && <p className="text-blue-400 text-sm mt-2">Uploading...</p>}
            </div>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Tags</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="React, Python, FastAPI (comma separated)"
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}