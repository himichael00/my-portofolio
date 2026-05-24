import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('https://my-portofolio.up.railway.app/posts/')
        setPosts(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-bold text-lg">Michael Rio Aditya</span>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#projects" className="hover:text-white transition">Projects</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <p className="text-blue-400 font-medium mb-2">Hello There 👋</p>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              I'm Michael Rio Aditya
            </h1>
            <p className="text-xl text-gray-400 mb-6">Software Developer</p>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Welcome to my website. Here you can get to know more about me and my projects.
            </p>
            <div className="flex gap-4">
              <a
                href="#projects"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="border border-gray-700 hover:border-gray-500 px-6 py-3 rounded-lg font-semibold transition"
              >
                Contact Me
              </a>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-6xl">
              👨‍💻
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">About Me</h2>
          <div className="w-12 h-1 bg-blue-600 mb-8"></div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-400 leading-relaxed mb-4">
                I recently graduated with a Bachelor's degree in Information Technology and completed my internship program.
                I am currently working at a corporate company as an IT Specialist in Software Development.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Working in the IT field requires me to keep up with technological advancements.
                I am still in the learning process, expanding my knowledge, and understanding the importance of learning from experience.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Name', value: 'Michael Rio Aditya' },
                { label: 'Role', value: 'IT Specialist / Software Developer' },
                { label: 'Location', value: 'Indonesia' },
                { label: 'Status', value: 'Open to opportunities' },
              ].map(item => (
                <div key={item.label} className="flex gap-4">
                  <span className="text-blue-400 font-medium w-24 shrink-0">{item.label}</span>
                  <span className="text-gray-400">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Latest Projects</h2>
          <div className="w-12 h-1 bg-blue-600 mb-8"></div>

          {loading ? (
            <p className="text-gray-400">Loading projects...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500">No projects yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {posts.map(post => (
                <div key={post.id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition group">
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    {post.tags && (
                      <div className="flex gap-2 flex-wrap mb-4">
                        {post.tags.split(',').map(tag => (
                          <span key={tag} className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-full">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {post.github_url && (
                        <a
                          href={post.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-white transition"
                        >
                          GitHub →
                        </a>
                      )}
                      {post.demo_url && (
                        <a
                          href={post.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 transition"
                        >
                          Live Demo →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-gray-900/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
          <div className="w-12 h-1 bg-blue-600 mb-8 mx-auto"></div>
          <p className="text-gray-400 mb-8">Feel free to reach out through any of these platforms</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { label: 'GitHub', url: 'https://github.com/himichael00' },
              { label: 'LinkedIn', url: 'https://www.linkedin.com/in/michael-rio-768926195' },
              { label: 'Instagram', url: 'https://www.instagram.com/michaellrio/' },
              { label: 'Telegram', url: 'https://t.me/michaellrio' },
            ].map(link => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-700 hover:border-blue-500 hover:text-blue-400 px-6 py-3 rounded-lg transition"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600 text-sm border-t border-gray-800">
        Made with ❤️ by Michael Rio Aditya
      </footer>

    </div>
  )
}
