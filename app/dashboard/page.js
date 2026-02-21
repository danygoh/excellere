'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LearnerDashboard() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Fetch modules
    fetch('/api/modules')
      .then(res => res.json())
      .then(data => {
        setModules(data.modules || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
      
    // Fetch progress
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      fetch(`/api/learn/progress?userId=${userObj.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setProgress(data.progress);
          }
        });
    }
  }, []);

  const currentModuleIndex = modules.findIndex(m => m.id === (progress?.currentModule || 'ai-native-business-design'));
  const currentModule = modules[currentModuleIndex] || {};

  if (loading) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '14px', letterSpacing: '8px', color: '#d4af37' }}>✦</span>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 400, color: '#fff', letterSpacing: '6px', marginTop: '10px' }}>
            LEARNER DASHBOARD
          </div>
          {user && <p style={{ color: '#666', marginTop: '10px' }}>Welcome back, {user.name}</p>}
        </div>

        {/* Progress Card */}
        <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#fff', fontSize: '18px', fontFamily: 'Playfair Display, serif' }}>
              Current Module
            </h2>
            <span style={{ background: '#d4af37', color: '#000', padding: '4px 12px', fontSize: '10px', letterSpacing: '1px' }}>
              {progress?.phase?.toUpperCase() || 'UNDERSTAND'}
            </span>
          </div>
          
          <h3 style={{ color: '#d4af37', fontSize: '24px', marginBottom: '10px' }}>
            {currentModule.name || 'Loading...'}
          </h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            {currentModule.description}
          </p>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ background: '#d4af37', color: '#000', border: 'none', padding: '12px 24px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', cursor: 'pointer' }}>
              CONTINUE LEARNING →
            </button>
          </div>
        </div>

        {/* Module List */}
        <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '20px' }}>Programme Modules</h3>
        
        {modules.map((module, index) => {
          const isActive = module.id === progress?.currentModule;
          const isCompleted = progress?.conceptsCompleted?.length >= 3;
          
          return (
            <div key={module.id} style={{ 
              background: isActive ? '#0a0a0a' : '#050505', 
              border: `1px solid ${isActive ? '#d4af37' : '#222'}`,
              padding: '24px', 
              marginBottom: '16px',
              borderRadius: '4px',
              opacity: isCompleted ? 0.5 : 1
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: '#444', fontSize: '12px', marginRight: '10px' }}>
                    MODULE {index + 1}
                  </span>
                  <span style={{ color: '#d4af37', fontSize: '18px', fontFamily: 'Playfair Display, serif' }}>
                    {module.name}
                  </span>
                </div>
                {isCompleted && <span style={{ color: '#2ecc71', fontSize: '12px' }}>✓ COMPLETED</span>}
                {isActive && <span style={{ color: '#d4af37', fontSize: '12px' }}>→ IN PROGRESS</span>}
              </div>
              <p style={{ color: '#666', fontSize: '13px', marginTop: '8px' }}>{module.description}</p>
            </div>
          );
        })}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '30px' }}>
          <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#d4af37', fontWeight: 600 }}>{progress?.sessionsCompleted || 0}</div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '1px' }}>SESSIONS</div>
          </div>
          <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#d4af37', fontWeight: 600 }}>{progress?.conceptsCompleted?.length || 0}/3</div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '1px' }}>CONCEPTS</div>
          </div>
          <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#d4af37', fontWeight: 600 }}>0</div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '1px' }}>BADGES</div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ marginTop: '40px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link href="/test-credentials" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>
            My Credentials →
          </Link>
          <Link href="/validate" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>
            Validator Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
