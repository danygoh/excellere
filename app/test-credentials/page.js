'use client';
import { useState, useEffect } from 'react';

export default function CredentialTest() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { loadProfiles(); }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/credentials/reports');
      const data = await res.json();
      setProfiles(data.profiles);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const generateReport = async (profileId) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/credentials/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileId })
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } 
      catch { setError('Server error'); setLoading(false); return; }
      if (data.success) setResult(data);
      else setError(data.error);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ fontSize: '14px', letterSpacing: '8px', color: '#d4af37' }}>✦</span>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 400, color: '#fff', letterSpacing: '6px', marginTop: '10px' }}>CREDENTIAL TEST</div>
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>}
        {error && <p style={{ textAlign: 'center', color: '#c00', background: '#1a1a1a', padding: '12px' }}>{error}</p>}

        {/* Profiles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {profiles.map(p => (
            <div key={p.id} style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#1a1a1a', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600, margin: '0 auto 16px', fontFamily: 'Playfair Display, serif' }}>
                {p.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff', marginBottom: '4px' }}>{p.name}</h3>
              <p style={{ color: '#d4af37', fontSize: '12px', letterSpacing: '1px', marginBottom: '4px' }}>{p.role}</p>
              <p style={{ color: '#444', fontSize: '11px', marginBottom: '12px' }}>{p.sector}</p>
              <span style={{ background: '#1a1a1a', color: '#888', padding: '4px 12px', fontSize: '10px', letterSpacing: '1px' }}>{p.archetype}</span>
              <button onClick={() => generateReport(p.id)} style={{ display: 'block', width: '100%', marginTop: '16px', background: '#d4af37', color: '#000', border: 'none', padding: '12px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', cursor: 'pointer' }}>
                GENERATE REPORT
              </button>
            </div>
          ))}
        </div>

        {/* Result */}
        {result && (
          <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <span style={{ color: '#d4af37', fontSize: '12px', letterSpacing: '3px' }}>ASSESSMENT REPORT</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#fff', marginTop: '10px' }}>{result.report?.report_title}</h2>
            </div>

            {/* Aria Noticed */}
            <div style={{ borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: '30px 0', margin: '20px 0' }}>
              <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>What Aria Noticed</p>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff', fontStyle: 'italic', lineHeight: 1.7 }}>
                "{result.report?.aria_noticed?.observation}"
              </p>
            </div>

            {/* Score */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <span style={{ color: '#d4af37', fontSize: '10px', letterSpacing: '3px' }}>OVERALL SCORE</span>
              <div style={{ fontSize: '48px', fontWeight: 600, color: '#d4af37', marginTop: '10px' }}>{result.report?.overall_score}</div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {result.public_url && (
                <a href={result.public_url} target="_blank" style={{ background: '#d4af37', color: '#000', padding: '14px 28px', textDecoration: 'none', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>
                  VIEW CREDENTIAL →
                </a>
              )}
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://excellere.vercel.app' + result.public_url)}`} target="_blank" style={{ background: '#1a1a1a', color: '#fff', padding: '14px 28px', textDecoration: 'none', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', border: '1px solid #333' }}>
                LINKEDIN
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
