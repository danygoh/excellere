import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main>
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
        padding: '0 48px',
        height: '80px',
        background: 'rgba(13,17,23,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(48,54,61,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo - using text since we have the image */}
          <div style={{ 
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '24px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '2px'
          }}>
            EXC<span style={{ color: '#3B82F6' }}>ELLER</span>E
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#about" style={{ 
            fontSize: '13px', 
            fontWeight: 500, 
            color: '#8B949E', 
            textDecoration: 'none',
            fontFamily: "'Montserrat', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>About</a>
          <a href="#programme" style={{ 
            fontSize: '13px', 
            fontWeight: 500, 
            color: '#8B949E', 
            textDecoration: 'none',
            fontFamily: "'Montserrat', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>Programme</a>
          <a href="#team" style={{ 
            fontSize: '13px', 
            fontWeight: 500, 
            color: '#8B949E', 
            textDecoration: 'none',
            fontFamily: "'Montserrat', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>Team</a>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/login" style={{ 
            padding: '12px 24px', 
            color: '#8B949E', 
            fontSize: '13px', 
            fontWeight: 500,
            textDecoration: 'none',
            fontFamily: "'Montserrat', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>Log In</Link>
          <Link href="/signup" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '180px 48px 120px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #0D1117 0%, #161B22 100%)',
        overflow: 'hidden'
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(30, 64, 175, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 className="display-font" style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              color: '#fff',
              marginBottom: '24px',
              lineHeight: 1.2
            }}>
              Together, we come up with ideas to make a{' '}
              <span style={{ color: '#3B82F6' }}>better world</span> for everyone.
            </h1>
            
            <p style={{
              fontSize: '18px',
              color: '#8B949E',
              lineHeight: 1.8,
              marginBottom: '48px',
              maxWidth: '700px',
              margin: '0 auto 48px',
              fontFamily: "'Source Sans Pro', sans-serif"
            }}>
              Excellere is an independent, non-partisan research organisation that develops 
              and disseminates actionable data- and algorithm-driven ideas and solutions 
              to foster sustainable economies, governments and societies.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/signup" className="btn btn-primary" style={{ padding: '16px 40px' }}>
                Start Your Journey
              </Link>
              <a href="#programme" className="btn btn-secondary" style={{ padding: '16px 40px' }}>
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="about" style={{
        padding: '120px 48px',
        background: '#161B22'
      }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '60px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                width: '100%',
                height: '400px',
                background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Inknut Antiqua', serif",
                fontSize: '24px',
                color: 'rgba(255,255,255,0.3)'
              }}>
                [Excellere Loop Graphic]
              </div>
            </div>
            
            <div>
              <h2 style={{
                fontSize: '32px',
                marginBottom: '24px',
                color: '#fff'
              }}>
                Our conviction is guided by <strong style={{ color: '#3B82F6' }}>the Excellere Loop</strong>
              </h2>
              
              <p style={{
                fontSize: '17px',
                color: '#8B949E',
                lineHeight: 1.8,
                marginBottom: '20px'
              }}>
                We produce actionable ideas to create a sustainable economy and society 
                by unleashing and expanding human potential through frontier technologies.
              </p>
              
              <p style={{
                fontSize: '17px',
                color: '#8B949E',
                lineHeight: 1.8
              }}>
                We help industry leaders, government ministries and entrepreneurs make 
                informed decisions so they can ride the technology wave and achieve 
                sustainable goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Programme Section */}
      <section id="programme" style={{
        padding: '120px 48px',
        background: '#0D1117'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '36px',
              marginBottom: '16px',
              color: '#fff'
            }}>
              The <span style={{ color: '#3B82F6' }}>AI Fluency Programme</span>
            </h2>
            <p style={{ color: '#8B949E', fontSize: '18px' }}>
              A comprehensive programme for business leaders
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '24px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {[
              { num: '01', title: 'AI Fundamentals', desc: 'Understanding the AI landscape without technical jargon' },
              { num: '02', title: 'Strategic Adoption', desc: 'How to assess AI opportunities in your organisation' },
              { num: '03', title: 'Corporate Governance', desc: 'Risk, compliance, and ethical considerations' },
              { num: '04', title: 'AI-Ready Teams', desc: 'Building teams for the AI age' },
              { num: '05', title: 'Financial Performance', desc: 'Measuring ROI and investment cases' },
              { num: '06', title: 'Innovation & AI', desc: 'Competitive advantage through AI' }
            ].map((item, i) => (
              <div key={i} className="card" style={{ 
                padding: '32px',
                borderLeft: i % 2 === 0 ? '3px solid #3B82F6' : '3px solid #1E40AF'
              }}>
                <div style={{ 
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '14px', 
                  color: '#3B82F6', 
                  fontWeight: 600,
                  marginBottom: '12px'
                }}>
                  {item.num}
                </div>
                <h3 style={{ 
                  fontSize: '18px', 
                  marginBottom: '8px', 
                  color: '#fff',
                  fontFamily: "'Montserrat', sans-serif"
                }}>
                  {item.title}
                </h3>
                <p style={{ color: '#8B949E', fontSize: '14px', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/signup" className="btn btn-primary" style={{ padding: '16px 48px' }}>
              Enroll Now
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section style={{
        padding: '80px 48px',
        background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
        textAlign: 'center'
      }}>
        <div className="container">
          <blockquote style={{
            fontSize: 'clamp(20px, 3vw, 32px)',
            fontFamily: "'Inknut Antiqua', serif",
            color: '#fff',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.5,
            fontStyle: 'italic'
          }}>
            "Excellere, where human potential is unleashed and development capabilities are 'accelerated'."
          </blockquote>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '40px 48px', 
        background: '#0D1117',
        borderTop: '1px solid #30363D'
      }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ 
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '2px'
            }}>
              EXC<span style={{ color: '#3B82F6' }}>ELLER</span>E
            </div>
            
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" style={{ color: '#8B949E', textDecoration: 'none', fontSize: '13px' }}>About</a>
              <a href="#" style={{ color: '#8B949E', textDecoration: 'none', fontSize: '13px' }}>Research</a>
              <a href="#" style={{ color: '#8B949E', textDecoration: 'none', fontSize: '13px' }}>Contact</a>
            </div>
            
            <div style={{ color: '#8B949E', fontSize: '14px' }}>
              © 2025 Excellere. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
