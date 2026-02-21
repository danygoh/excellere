'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AuthHeader() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav style={{ background: '#0a0a0a', borderBottom: '1px solid #222', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontSize: '12px', letterSpacing: '6px', color: '#d4af37' }}>✦ EXCELLERE</span>
      </Link>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: '#666', fontSize: '11px' }}>
              {user.name} <span style={{ color: '#d4af37' }}>({user.role})</span>
            </span>
            {user.role === 'validator' && (
              <Link href="/validate" style={{ color: '#fff', fontSize: '11px', textDecoration: 'none' }}>Dashboard</Link>
            )}
            <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #333', color: '#666', padding: '6px 12px', fontSize: '10px', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" style={{ background: '#d4af37', color: '#000', padding: '8px 16px', fontSize: '11px', textDecoration: 'none', fontWeight: 600 }}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
