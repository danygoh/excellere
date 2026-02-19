'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('excellere_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    // Demo: just set a mock user
    const mockUser = {
      id: 'demo-user',
      email,
      name: 'Demo User',
      role: 'Head of Strategy',
      sector: 'FinTech'
    }
    setUser(mockUser)
    localStorage.setItem('excellere_user', JSON.stringify(mockUser))
    return mockUser
  }

  const logout = () => {
    setUser(null)
    setProfile(null)
    localStorage.removeItem('excellere_user')
  }

  const updateProfile = (newProfile) => {
    setProfile(newProfile)
  }

  return (
    <UserContext.Provider value={{ user, profile, isLoading, login, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
