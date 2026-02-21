// OG Image Generation for Credentials
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request, { params }) {
  const slug = params.slug;
  
  // Extract name from slug
  const name = slug?.replace(/-/g, ' ') || 'Learner';
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || 'Learner';
  const lastName = nameParts.slice(1).join(' ') || '';
  
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
          backgroundColor: '#1a1a2e',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Background pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Content */}
        <div style={{ textAlign: 'center', color: 'white', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ fontSize: 14, letterSpacing: 6, marginBottom: 40, opacity: 0.7 }}>EXCELLERE</div>
          
          {/* Avatar */}
          <div style={{ 
            width: 100, 
            height: 100, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #e94560 0%, #d6304b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 600,
            margin: '0 auto 24px'
          }}>
            {firstName[0]}{lastName[0] || firstName[1] || 'L'}
          </div>
          
          {/* Name */}
          <div style={{ fontSize: 36, fontWeight: 600, marginBottom: 8 }}>
            {firstName} {lastName}
          </div>
          
          {/* Role */}
          <div style={{ fontSize: 18, color: '#e94560', marginBottom: 24 }}>
            AI Leadership Credential
          </div>
          
          {/* Badge */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8,
            background: '#2ecc71',
            padding: '8px 16px',
            borderRadius: 20,
            fontSize: 14,
          }}>
            ✓ Verified by Prof. Mark Esposito
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ position: 'absolute', bottom: 24, fontSize: 12, color: '#666' }}>
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
