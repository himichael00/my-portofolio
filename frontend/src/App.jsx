import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'
import CreatePost from './pages/admin/CreatePost'
import EditPost from './pages/admin/EditPost'
import PostDetail from './pages/PostDetail'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/posts/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/admin/posts/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}