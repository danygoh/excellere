// OG Image Generation for Credentials - Premium Design
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request, { params }) {
  const slug = params.slug;
  
  // Extract data from slug
  const name = slug?.replace(/-/g, ' ') || 'Learner';
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || 'Learner';
  const lastName = nameParts.slice(1).join(' ') || '';
  const initials = (firstName[0] || 'L') + (lastName[0] || 'L');

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div style={{ 
            position: 'absolute', 
            top: '-50%', 
            right: '-50%', 
            width: '100%', 
            height: '100%', 
            background: 'radial-gradient(circle, #d4af37 0%, transparent 50%)', 
            opacity: 0.1 
          }} />
          <div style={{ 
            position: 'absolute', 
            bottom: '-50%', 
            left: '-50%', 
            width: '100%', 
            height: '100%', 
            background: 'radial-gradient(circle, #d4af37 0%, transparent 50%)', 
            opacity: 0.05 
          }} />
        </div>
        
        {/* Content */}
        <div style={{ zIndex: 1, textAlign: 'center', padding: '40px' }}>
          {/* Logo */}
          <div style={{ fontSize: 14, letterSpacing: 8, color: '#d4af37', marginBottom: 40 }}>
            ✦ EXCELLERE
          </div>
          
          {/* Verified Badge */}
          <div style={{ 
            display: 'inline-block', 
            background: '#d4af37', 
            color: '#000', 
            padding: '6px 16px', 
            borderRadius: 20, 
            fontSize: 11, 
            fontWeight: 600,
            letterSpacing: 1,
            marginBottom: 30 
          }}>
            ✓ VERIFIED CREDENTIAL
          </div>
          
          {/* Avatar */}
          <div style={{ 
            width: 120, 
            height: 120, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            fontWeight: 700,
            color: '#000',
            margin: '0 auto 24px',
            fontFamily: 'Playfair Display, serif'
          }}>
            {initials}
          </div>
          
          {/* Name */}
          <div style={{ fontSize: 42, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
            {firstName} {lastName}
          </div>
          
          {/* Role */}
          <div style={{ fontSize: 18, color: '#d4af37', marginBottom: 24 }}>
            AI Leadership Credential
          </div>
          
          {/* Archetype */}
          <div style={{ 
            display: 'inline-block', 
            background: '#1a1a1a', 
            color: '#888', 
            padding: '8px 20px', 
            borderRadius: 20, 
            fontSize: 14,
            marginBottom: 30 
          }}>
            Strategic Reframer
          </div>
          
          {/* Validator */}
          <div style={{ fontSize: 14, color: '#666', marginTop: 20 }}>
            Validated by Prof. Mark Esposito
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ position: 'absolute', bottom: 20, fontSize: 12, color: '#333' }}>
          excellere.ai
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
