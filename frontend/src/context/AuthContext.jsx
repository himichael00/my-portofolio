import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        setIsVerifying(false)
        return
      }
      try {
        await axios.get('https://my-portofolio.up.railway.app/auth/verify', {
          headers: { Authorization: `Bearer ${storedToken}` }
        })
        setToken(storedToken)
      } catch (err) {
        localStorage.removeItem('token')
        setToken(null)
      } finally {
        setIsVerifying(false)
      }
    }
    verifyToken()
  }, [])

  const login = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Verifying session...</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}