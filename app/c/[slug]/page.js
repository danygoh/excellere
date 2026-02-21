'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function CredentialPage() {
  const params = useParams();
  const slug = params?.slug;
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchCredential();
    } else {
      setLoading(false);
    }
  }, [slug]);

  const fetchCredential = async () => {
    if (!slug) return;
    try {
      const res = await fetch(`/api/credentials/${slug}`);
      const data = await res.json();
      if (data.success) {
        setCredential(data.credential);
      } else {
        setError(data.error || 'Credential not found');
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <p>Loading credential...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <h1>Credential Not Found</h1>
        <p style={{ color: '#666' }}>{error}</p>
      </div>
    );
  }

  const { report, profile, validated, validator, share_slug } = credential || {};

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, letterSpacing: '4px' }}>EXCELLERE</div>
        <div style={{ background: '#2ecc71', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>✓ Verified Credential</div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 600, margin: '0 auto 20px' }}>
          {profile?.first_name?.[0]}{profile?.last_name?.[0]}
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', marginBottom: '8px' }}>{profile?.first_name} {profile?.last_name}</h1>
        <p style={{ color: '#e94560', fontWeight: 500, marginBottom: '4px' }}>{profile?.role}</p>
        <p style={{ color: '#888', fontSize: '14px' }}>AI Leadership Credential</p>
      </div>

      {/* Archetype */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '8px' }}>Thinking Archetype</div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px' }}>{profile?.archetype || 'AI Leader'}</div>
      </div>

      {/* Aria Noticed */}
      {report?.aria_noticed && (
        <div style={{ background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%)', borderLeft: '4px solid #d4af37', padding: '24px', marginBottom: '30px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#d4af37', marginBottom: '12px' }}>What Aria Noticed</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontStyle: 'italic', lineHeight: 1.6 }}>{report.aria_noticed.observation}</div>
        </div>
      )}

      {/* Executive Summary */}
      {report?.executive_summary && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '12px' }}>Summary</h3>
          <p style={{ fontSize: '15px', lineHeight: 1.7 }}>{report.executive_summary.body}</p>
        </div>
      )}

      {/* Score */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #e94560', display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '32px', fontWeight: 700, color: '#e94560' }}>{report?.overall_score || 0}</span>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px' }}>Score</span>
        </div>
      </div>

      {/* Validator */}
      {validated && validator && (
        <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '12px' }}>Validated By</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 600 }}>{validator.name}</div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>{validator.title}</div>
          {validator.comment && (
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', fontStyle: 'italic', color: '#444' }}>"{validator.comment}"</div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', paddingTop: '30px', borderTop: '1px solid #eee', fontSize: '12px', color: '#888' }}>
        <p>This credential was issued by Excellere</p>
        <p style={{ marginTop: '8px' }}>Credential ID: EXC-{share_slug?.split('-').pop()?.toUpperCase() || 'N/A'}</p>
      </div>
    </div>
  );
}
