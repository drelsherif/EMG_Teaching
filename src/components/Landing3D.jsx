import React, { useEffect, useRef } from 'react';
import { Activity, BookOpen, Stethoscope, Zap, ArrowRight } from 'lucide-react';

/**
 * 3D Landing Page with Neural Network Animation
 * Medical-themed particle system representing nerve signals
 */
function Landing3D({ onGetStarted }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const connectionsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resize();
    window.addEventListener('resize', resize);

    // Particle system - representing neurons/signals
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width / dpr;
        this.y = Math.random() * canvas.height / dpr;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width / dpr;
        if (this.x > canvas.width / dpr) this.x = 0;
        if (this.y < 0) this.y = canvas.height / dpr;
        if (this.y > canvas.height / dpr) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(8, 145, 178, ${this.alpha})`;
        ctx.fill();
      }
    }

    // Initialize particles (neurons)
    const numParticles = 80;
    particlesRef.current = Array.from(
      { length: numParticles },
      () => new Particle()
    );

    // Animation loop
    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = 'rgba(248, 250, 252, 0.1)';
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connections (synapses)
      const maxDistance = 150;
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const alpha = (1 - distance / maxDistance) * 0.2;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(8, 145, 178, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: Activity,
      title: 'EMG Patterns',
      description: 'Learn to recognize fibrillations, fasciculations, myotonic discharges, and more with authentic sounds',
      color: '#0891b2',
    },
    {
      icon: Zap,
      title: 'Nerve Conduction',
      description: 'Master NCV interpretation with interactive visualizations and normal value references',
      color: '#06b6d4',
    },
    {
      icon: Stethoscope,
      title: 'Case Studies',
      description: 'Practice diagnosis with real clinical scenarios and immediate feedback',
      color: '#10b981',
    },
    {
      icon: BookOpen,
      title: 'Report Builder',
      description: 'Create professional EMG/NCV reports with color-coded values and export functionality',
      color: '#0891b2',
    },
  ];

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 200px)' }}>
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Content Overlay */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '4rem 2rem',
      }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          {/* Hero Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(8, 145, 178, 0.1)',
              borderRadius: '999px',
              marginBottom: '1.5rem',
            }}>
              <Activity size={18} color="#0891b2" />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#0891b2',
              }}>
                Version 4.0 • Production Ready
              </span>
            </div>

            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '700',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}>
              Master Clinical Neurophysiology
            </h1>

            <p style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              maxWidth: '700px',
              margin: '0 auto 2rem',
              lineHeight: '1.8',
            }}>
              Interactive EMG and nerve conduction studies platform with clinically accurate waveforms,
              authentic sounds, and comprehensive case studies for neurology residents and fellows.
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={onGetStarted}
                className="btn btn-primary"
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                Start Learning
                <ArrowRight size={20} />
              </button>

              <button
                className="btn btn-secondary"
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                }}
                onClick={() => window.open('https://github.com/yasir2000', '_blank')}
              >
                View on GitHub
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    transition: 'all 0.3s',
                    animationDelay: `${index * 0.1}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: `${feature.color}15`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}>
                    <Icon size={24} color={feature.color} />
                  </div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                  }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Stats Section */}
          <div style={{
            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
            borderRadius: '16px',
            padding: '3rem',
            color: 'white',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center',
            }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  5+
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  EMG Pattern Types
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  8+
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  Nerve Studies
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  3+
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  Clinical Cases
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  Clinically Accurate
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing3D;
