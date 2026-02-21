'use client';
import { useState, useEffect } from 'react';

export default function ShareMoment({ type = 'report-ready', report, onClose, onShare, onDownload }) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    // Animate in
    setTimeout(() => setShow(true), 100);
  }, []);

  if (!report) return null;

  const isValidated = type === 'validated';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      opacity: show ? 1 : 0,
      transition: 'opacity 0.5s ease'
    }}>
      <div style={{ 
        maxWidth: '600px', 
        padding: '40px', 
        textAlign: 'center',
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        transition: 'transform 0.5s ease'
      }}>
        
        {/* Icon */}
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>
          {isValidated ? '🏛️' : '✨'}
        </div>
        
        {/* Headline */}
        <h2 style={{ 
          fontFamily: 'Playfair Display, serif', 
          fontSize: '32px', 
          color: '#fff', 
          marginBottom: '16px' 
        }}>
          {isValidated 
            ? 'Your Report Has Been Validated' 
            : 'Your Assessment Report is Ready'}
        </h2>
        
        {/* Validator comment for validated */}
        {isValidated && report.validator_comment && (
          <div style={{ 
            background: '#0a0a0a', 
            border: '1px solid #222',
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '24px' 
          }}>
            <p style={{ color: '#d4af37', fontSize: '14px', marginBottom: '8px' }}>
              {report.validator_name} says:
            </p>
            <p style={{ color: '#fff', fontStyle: 'italic', fontSize: '16px' }}>
              "{report.validator_comment}"
            </p>
          </div>
        )}
        
        {/* For report ready */}
        {!isValidated && report.executive_summary && (
          <p style={{ color: '#888', fontSize: '18px', marginBottom: '24px', fontStyle: 'italic' }}>
            "{report.executive_summary.headline}"
          </p>
        )}
        
        {/* Preview URL */}
        {report.public_url && (
          <div style={{ 
            background: '#0a0a0a', 
            padding: '16px', 
            borderRadius: '8px',
            marginBottom: '30px',
            fontSize: '12px',
            color: '#666'
          }}>
            <p>Your credential is live at:</p>
            <p style={{ color: '#d4af37', marginTop: '8px', wordBreak: 'break-all' }}>
              {typeof window !== 'undefined' ? window.location.origin : ''}{report.public_url}
            </p>
          </div>
        )}
        
        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={onShare}
            style={{ 
              background: '#d4af37', 
              color: '#000', 
              border: 'none', 
              padding: '14px 28px', 
              fontSize: '14px', 
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isValidated ? '📱 Share on LinkedIn' : '🔗 Copy Link'}
          </button>
          
          <a 
            href={report.public_url}
            target="_blank"
            style={{ 
              background: 'transparent', 
              color: '#fff', 
              border: '1px solid #333', 
              padding: '14px 28px', 
              fontSize: '14px', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            👁️ View Credential
          </a>
          
          {onClose && (
            <button 
              onClick={onClose}
              style={{ 
                background: 'transparent', 
                color: '#666', 
                border: 'none', 
                padding: '14px 20px', 
                fontSize: '14px', 
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          )}
        </div>
        
        {/* LinkedIn Post Preview */}
        {isValidated && (
          <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #222' }}>
            <p style={{ color: '#444', fontSize: '12px', marginBottom: '16px' }}>
              📝 LinkedIn post preview:
            </p>
            <div style={{ 
              background: '#0a0a0a', 
              border: '1px solid #222',
              padding: '20px', 
              borderRadius: '8px',
              textAlign: 'left',
              fontSize: '13px',
              color: '#888'
            }}>
              <p style={{ color: '#fff', marginBottom: '8px' }}>
                I've just completed the {report.module_name} programme with @Excellere. 
              </p>
              <p style={{ color: '#888', marginBottom: '8px' }}>
                What surprised me most wasn't the content — it was the assessment. 
                Aria identified me as a "{report.archetype}" — which, honestly, 
                is more accurate than anything I'd have written about myself.
              </p>
              <p style={{ color: '#d4af37' }}>
                #AIStrategy #ExecEd #AILeadership
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
