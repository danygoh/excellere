import Link from 'next/link'

export default function Dashboard() {
  const modules = [
    { id: 1, title: 'AI Fundamentals for Executives', progress: 100, status: 'completed' },
    { id: 2, title: 'Strategic AI Adoption', progress: 75, status: 'in-progress' },
    { id: 3, title: 'AI & Corporate Governance', progress: 0, status: 'locked' },
    { id: 4, title: 'Building AI-Ready Teams', progress: 0, status: 'locked' },
    { id: 5, title: 'AI & Financial Performance', progress: 0, status: 'locked' },
    { id: 6, title: 'Customer Experience with AI', progress: 0, status: 'locked' },
    { id: 7, title: 'Innovation & AI', progress: 0, status: 'locked' },
    { id: 8, title: 'The AI-Ready Organisation', progress: 0, status: 'locked' }
  ]

  return (
    <main style={{ minHeight: '100vh', background: '#0D1117' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: '64px',
        background: 'rgba(13,17,23,0.95)',
        borderBottom: '1px solid #1E2733'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #C8922A, #E8B84B)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'DM Serif Display', serif",
              fontSize: '16px',
              color: '#0D1117'
            }}>E</div>
          </Link>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Dashboard', 'Courses', 'Coach', 'Live'].map((item, i) => (
              <a key={i} href={item === 'Dashboard' ? '#' : `/${item.toLowerCase()}`} style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: i === 0 ? '#fff' : '#8896A4',
                background: i === 0 ? '#1E2733' : 'transparent',
                textDecoration: 'none'
              }}>{item}</a>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C8922A, #E8B84B)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 600,
            color: '#0D1117'
          }}>DS</div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ paddingTop: '96px', padding: '96px 32px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Welcome */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Welcome back, Daniel 👋</h1>
          <p style={{ color: '#8896A4' }}>Continue your AI fluency journey</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Modules Completed', value: '1/8', color: '#14B8A6' },
            { label: 'Hours Learned', value: '2.5', color: '#fff' },
            { label: 'Days Active', value: '3', color: '#fff' },
            { label: 'Coach Sessions', value: '5', color: '#fff' }
          ].map((stat, i) => (
            <div key={i} style={{ background: '#0D1117', border: '1px solid #1E2733', borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '13px', color: '#8896A4', marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '28px', fontFamily: "'DM Serif Display', serif", color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Current Module */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Continue Learning</h2>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #1E2733 0%, #0D1117 100%)',
            border: '1px solid #C8922A',
            borderRadius: '20px',
            padding: '32px',
            display: 'flex',
            gap: '24px',
            alignItems: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              background: 'rgba(200,146,42,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>🎯</div>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', color: '#E8B84B', marginBottom: '8px' }}>Module 2 — In Progress</div>
              <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>Strategic AI Adoption</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '6px', background: '#1E2733', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '75%', height: '100%', background: '#E8B84B', borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '14px', color: '#8896A4' }}>75%</span>
              </div>
            </div>
            
            <button className="btn btn-primary">Continue →</button>
          </div>
        </div>

        {/* All Modules */}
        <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>All Modules</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {modules.map((mod, i) => (
            <div key={mod.id} style={{
              background: mod.status === 'in-progress' ? '#1E2733' : '#0D1117',
              border: `1px solid ${mod.status === 'completed' ? '#14B8A6' : mod.status === 'in-progress' ? '#E8B84B' : '#1E2733'}`,
              borderRadius: '12px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              opacity: mod.status === 'locked' ? 0.5 : 1
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: mod.status === 'completed' ? '#14B8A6' : mod.status === 'in-progress' ? '#E8B84B' : '#1E2733',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: mod.status === 'completed' || mod.status === 'in-progress' ? '#0D1117' : '#8896A4'
              }}>
                {mod.status === 'completed' ? '✓' : mod.id}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>{mod.title}</div>
                {mod.status === 'in-progress' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '4px', background: '#1E2733', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '75%', height: '100%', background: '#E8B84B', borderRadius: '2px' }} />
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ fontSize: '14px', color: mod.status === 'completed' ? '#14B8A6' : mod.status === 'in-progress' ? '#E8B84B' : '#8896A4' }}>
                {mod.status === 'completed' ? 'Completed' : mod.status === 'in-progress' ? 'In Progress' : 'Locked'}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
