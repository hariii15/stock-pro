import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div> // Or your loading component
  }

  // If no user and not loading, redirect to login
  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    // Your protected app content
  )
}

export default AppContent 