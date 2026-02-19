'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Demo: redirect to onboarding
    router.push('/onboarding')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07080d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#161b2e',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px',
        padding: '48px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✦</div>
          <h1 style={{ fontFamily: 'Instrument Serif', fontSize: '1.75rem', marginBottom: '8px' }}>Get Started</h1>
          <p style={{ color: '#8b8fa3', fontSize: '0.9375rem' }}>Begin your AI learning journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#8b8fa3', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Full Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Chen"
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                background: '#13162a',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#8b8fa3', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                background: '#13162a',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#8b8fa3', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                background: '#13162a',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '14px',
            background: '#e9b84c',
            border: 'none',
            borderRadius: '9999px',
            color: '#07080d',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Create Account
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: '#8b8fa3', fontSize: '0.875rem' }}>
          Already have an account? <Link href="/login" style={{ color: '#e9b84c', textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}
