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

  const login = async (email, password, name = '') => {
    // Demo: create mock user with profile
    const mockUser = {
      id: 'demo-user',
      email,
      name: name || email.split('@')[0],
      role: 'Head of Strategy',
      sector: 'FinTech',
      seniority: 'Executive',
      goal: 'Lead AI transformation',
      cognitiveFingerprint: {
        archetype: 'Strategic Reframer',
        dimensions: {
          strategic_vs_operational: 85,
          conceptual_vs_technical: 70,
          single_vs_double_loop: 90,
          challenge_vs_confirmation: 75
        }
      }
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
    // Save to localStorage
    if (user) {
      const updatedUser = { ...user, ...newProfile }
      setUser(updatedUser)
      localStorage.setItem('excellere_user', JSON.stringify(updatedUser))
    }
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
