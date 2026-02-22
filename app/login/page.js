'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'validator') {
        router.push('/validate');
      } else if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Failed to connect');
      setLoading(false);
    }
  };

  // Demo accounts - correct credentials
  const demoAccounts = [
    { email: 'sarah.chen@techcorp.com', password: 'demo', role: 'Learner', name: 'Sarah Chen' },
    { email: 'james.wilson@healthplus.com', password: 'demo', role: 'Learner', name: 'James Wilson' },
    { email: 'mark@excellere.ai', password: 'demo', role: 'Validator', name: 'Prof. Mark Esposito' },
    { email: 'terence@excellere.ai', password: 'demo', role: 'Validator', name: 'Prof. Terence Tse' },
    { email: 'danny@excollere.ai', password: 'demo', role: 'Admin', name: 'Danny Goh' },
  ];

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '450px', margin: '0 auto' }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '14px', letterSpacing: '8px', color: '#d4af37' }}>✦</span>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 400, color: '#fff', letterSpacing: '6px', marginTop: '10px' }}>
            SIGN IN
          </div>
        </div>

        {/* Form */}
        <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '40px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#666', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>EMAIL</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '14px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#666', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>PASSWORD</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '14px' }} />
            </div>

            {error && <p style={{ color: '#c00', fontSize: '12px', marginBottom: '20px' }}>{error}</p>}

            <button type="submit" disabled={loading} style={{ width: '100%', background: '#d4af37', color: '#000', border: 'none', padding: '14px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', cursor: 'pointer' }}>
              {loading ? 'PLEASE WAIT...' : 'SIGN IN'}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div style={{ marginTop: '40px', background: '#0a0a0a', border: '1px solid #222', padding: '20px' }}>
          <p style={{ color: '#666', fontSize: '10px', letterSpacing: '2px', marginBottom: '12px' }}>DEMO ACCOUNTS (password: demo)</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {demoAccounts.map((acc, i) => (
              <div key={i} onClick={() => fillDemo(acc)} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#1a1a1a', cursor: 'pointer', fontSize: '11px' }}>
                <span style={{ color: '#fff' }}>{acc.name}</span>
                <span style={{ color: '#d4af37' }}>{acc.role}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
