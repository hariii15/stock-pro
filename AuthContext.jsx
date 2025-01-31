import { jwtDecode } from 'jwt-decode'
import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => {
    // Check localStorage for existing token on initial load
    const savedToken = localStorage.getItem('token')
    return savedToken || null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If there's a token, decode it and set the user
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
        localStorage.setItem('token', token)
      } catch (error) {
        console.error('Token decode error:', error)
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [token])

  const login = (newToken) => {
    setToken(newToken)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthContext 