'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', color: '#666', textAlign: 'center' }}>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '20px' }}>Please log in to view your profile</p>
          <a href="/login" style={{ color: '#d4af37', textDecoration: 'none' }}>Sign In</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <a href="/dashboard" style={{ color: '#666', textDecoration: 'none', fontSize: '12px', display: 'inline-block', marginBottom: '30px' }}>← BACK TO DASHBOARD</a>
        
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#fff', marginBottom: '40px' }}>My Profile</h1>

        <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px', borderRadius: '8px' }}>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>NAME</p>
            <p style={{ color: '#fff', fontSize: '18px' }}>{user.first_name} {user.last_name}</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>EMAIL</p>
            <p style={{ color: '#fff', fontSize: '16px' }}>{user.email}</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>ROLE</p>
            <p style={{ color: '#d4af37', fontSize: '14px', textTransform: 'capitalize' }}>{user.role}</p>
          </div>

          {user.organisation && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>ORGANISATION</p>
              <p style={{ color: '#fff', fontSize: '14px' }}>{user.organisation}</p>
            </div>
          )}
        </div>

        <button 
          onClick={handleLogout}
          style={{
            marginTop: '30px',
            background: 'transparent',
            border: '1px solid #333',
            color: '#666',
            padding: '12px 24px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          SIGN OUT
        </button>
      </div>
    </div>
  )
}
