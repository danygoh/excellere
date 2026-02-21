'use client';
// Test page for credential system
import { useState, useEffect } from 'react';

export default function CredentialTest() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/credentials/reports');
      const data = await res.json();
      setProfiles(data.profiles);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const generateReport = async (profileId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/credentials/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileId })
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        setError(`Server error: ${text.substring(0, 100)}`);
        setLoading(false);
        return;
      }
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif', background: '#fff', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', marginBottom: '10px', color: '#1a1a2e' }}>
        🎓 Excellere Credential System - Test
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Test the "What Aria Noticed" section with five real profiles.
      </p>

      {loading && <p style={{ color: '#666' }}>Loading...</p>}
      {error && <p style={{ color: '#c00', background: '#fee', padding: '12px', borderRadius: '6px' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {profiles.map(p => (
          <div key={p.id} style={{
            background: '#fff', padding: '24px', borderRadius: '12px',
            border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', marginBottom: '4px', color: '#1a1a2e' }}>{p.name}</h3>
            <p style={{ color: '#e94560', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{p.role}</p>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '12px' }}>{p.sector}</p>
            <span style={{
              background: '#f0f0f0', color: '#333', padding: '6px 14px', borderRadius: '20px',
              fontSize: '11px', fontWeight: '500', display: 'inline-block'
            }}>
              {p.archetype}
            </span>
            <button 
              onClick={() => generateReport(p.id)}
              style={{
                display: 'block', width: '100%', marginTop: '16px',
                background: '#e94560', color: '#fff', border: 'none',
                padding: '10px', borderRadius: '6px', fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Generate Report
            </button>
          </div>
        ))}
      </div>

      {result && (
        <div style={{ marginTop: '40px', background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#1a1a2e' }}>{result.report?.report_title || 'Report'}</h2>
            <span style={{ background: '#e94560', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontWeight: '600' }}>
              Score: {result.report?.overall_score || 'N/A'}
            </span>
          </div>

          <div style={{
            background: '#fffbf0', borderLeft: '4px solid #d4af37', padding: '24px', margin: '20px 0'
          }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#d4af37', marginBottom: '12px' }}>
              What Aria Noticed
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontStyle: 'italic', lineHeight: '1.6', color: '#333' }}>
              {result.report?.aria_noticed?.observation || 'No observation'}
            </div>
            <div style={{ marginTop: '16px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
              {result.report?.aria_noticed?.prediction || ''}
            </div>
          </div>

          <p style={{ color: '#333' }}><strong>Headline:</strong> {result.report?.executive_summary?.headline || 'N/A'}</p>
          
          {result.badges_earned && result.badges_earned.length > 0 && (
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {result.badges_earned.map(b => (
                <span key={b} style={{ background: '#f0f0f0', color: '#333', padding: '6px 12px', borderRadius: '16px', fontSize: '12px' }}>
                  {b}
                </span>
              ))}
            </div>
          )}

          <p style={{ marginTop: '20px', fontSize: '13px', color: '#888' }}>
            <strong>Share slug:</strong> {result.share_slug}
          </p>
          
          {result.public_url && (
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a 
                href={result.public_url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'inline-block', background: '#2ecc71', color: '#fff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500' }}
              >
                View Public Credential →
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://excellere.vercel.app' + result.public_url)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', background: '#0077b5', color: '#fff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500' }}
              >
                Share on LinkedIn
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
