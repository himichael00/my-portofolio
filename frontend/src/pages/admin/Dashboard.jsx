import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

export default function Dashboard() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/posts/')
      setPosts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    try {
      await axios.delete(`http://127.0.0.1:8000/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchPosts()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Portfolio Admin</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition text-sm"
          >
            View Site
          </button>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Posts</h2>
          <button
            onClick={() => navigate('/admin/posts/create')}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold transition"
          >
            + New Post
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No posts yet</p>
            <p className="text-sm mt-1">Create your first post to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-gray-900 rounded-xl p-5 flex justify-between items-start border border-gray-800">
                <div>
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{post.description}</p>
                  {post.tags && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {post.tags.split(',').map(tag => (
                        <span key={tag} className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-full">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-2 rounded-lg text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}