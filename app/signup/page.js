'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '../../context/UserContext'
import styles from './auth.module.css'

export default function Signup() {
  const router = useRouter()
  const { login } = useUser()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!name || !email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      await login(email, password, name)
      router.push('/onboarding')
    } catch (err) {
      setError('Error creating account')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>✦</div>
          <h1>Get Started</h1>
          <p>Begin your AI learning journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Chen"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className={styles.btnPrimary}>
            Create Account
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
