import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../api'

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/posts/${id}`)
        setPost(res.data)
      } catch (err) {
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      Loading...
    </div>
  )

  if (!post) return null

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="fixed top-0 w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to Portfolio
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-72 object-cover rounded-2xl mb-8"
          />
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags && post.tags.split(',').map(tag => (
            <span key={tag} className="bg-blue-500/10 text-blue-400 text-sm px-3 py-1 rounded-full">
              {tag.trim()}
            </span>
          ))}
        </div>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <p className="text-gray-400 text-sm mb-8">
          {new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>

        <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap mb-10">
          {post.description}
        </p>

        <div className="flex gap-4">
          {post.github_url && (
            <a
              href={post.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition"
            >
              GitHub →
            </a>
          )}
          {post.demo_url && (
            <a
              href={post.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
            >
              Live Demo →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}