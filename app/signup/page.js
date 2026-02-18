import Link from 'next/link'

export default function Signup() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'linear-gradient(180deg, #0D1117 0%, #161B22 100%)' }}>
      {/* Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Link href="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '10px', 
          textDecoration: 'none', 
          marginBottom: '40px' 
        }}>
          <div style={{ 
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '24px', 
            fontWeight: 700, 
            color: '#fff',
            letterSpacing: '2px'
          }}>
            EXC<span style={{ color: '#3B82F6' }}>ELLER</span>E
          </div>
        </Link>
        
        {/* Card */}
        <div style={{
          background: '#161B22',
          border: '1px solid #30363D',
          borderRadius: '12px',
          padding: '40px'
        }}>
          <h1 style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'center', fontFamily: "'Montserrat', sans-serif" }}>Create your account</h1>
          <p style={{ color: '#8B949E', textAlign: 'center', marginBottom: '32px' }}>
            Join the AI Fluency Programme
          </p>
          
          <form>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#E8EDF2', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                Full Name
              </label>
              <input type="text" className="input" placeholder="John Smith" />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#E8EDF2', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                Work Email
              </label>
              <input type="email" className="input" placeholder="john@company.com" />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#E8EDF2', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                Password
              </label>
              <input type="password" className="input" placeholder="••••••••" />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Create Account
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#8B949E' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#3B82F6', textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#6B7280' }}>
          © 2025 Excellere. All rights reserved.
        </p>
      </div>
    </main>
  )
}
