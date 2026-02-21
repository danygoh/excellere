'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('learner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'signup',
          email,
          password,
          name: isLogin ? undefined : name,
          role: isLogin ? undefined : role
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

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
    }

    setLoading(false);
  };

  // Demo accounts info
  const demoAccounts = [
    { email: 'sarah@fintech.com', password: 'learner123', role: 'Learner' },
    { email: 'mark@excellere.ai', password: 'validator123', role: 'Validator' },
    { email: 'terence@excellere.ai', password: 'validator123', role: 'Validator' },
    { email: 'danny@excellere.ai', password: 'validator123', role: 'Validator/Admin' },
  ];

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '450px', margin: '0 auto' }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '14px', letterSpacing: '8px', color: '#d4af37' }}>✦</span>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 400, color: '#fff', letterSpacing: '6px', marginTop: '10px' }}>
            {isLogin ? 'WELCOME BACK' : 'JOIN EXCELLERE'}
          </div>
        </div>

        {/* Form */}
        <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '40px' }}>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#666', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>NAME</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required={!isLogin} style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '14px' }} />
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#666', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>EMAIL</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '14px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#666', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>PASSWORD</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '14px' }} />
            </div>

            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#666', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>I AM A</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '14px' }}>
                  <option value="learner">Senior Executive (Learner)</option>
                  <option value="validator">Validator (Faculty)</option>
                </select>
              </div>
            )}

            {error && <p style={{ color: '#c00', fontSize: '12px', marginBottom: '20px' }}>{error}</p>}

            <button type="submit" disabled={loading} style={{ width: '100%', background: '#d4af37', color: '#000', border: 'none', padding: '14px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', cursor: 'pointer' }}>
              {loading ? 'PLEASE WAIT...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', color: '#444', fontSize: '12px' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#d4af37', cursor: 'pointer' }}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>

        {/* Demo Accounts */}
        <div style={{ marginTop: '40px', background: '#0a0a0a', border: '1px solid #222', padding: '20px' }}>
          <p style={{ color: '#666', fontSize: '10px', letterSpacing: '2px', marginBottom: '12px' }}>DEMO ACCOUNTS</p>
          {demoAccounts.map((acc, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px' }}>
              <span style={{ color: '#888' }}>{acc.email}</span>
              <span style={{ color: '#d4af37' }}>{acc.password} ({acc.role})</span>
            </div>
          ))}
          <p style={{ color: '#444', fontSize: '10px', marginTop: '12px' }}>Click to auto-fill:</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {demoAccounts.map((acc, i) => (
              <span key={i} onClick={() => { setEmail(acc.email); setPassword(acc.password); }} style={{ background: '#1a1a1a', color: '#666', padding: '4px 8px', fontSize: '10px', cursor: 'pointer' }}>
                {acc.role}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
