import React, { useState } from 'react';
import { Activity, BookOpen, Stethoscope, FileText, Zap } from 'lucide-react';
import Landing3D from './components/Landing3D';
import EMGModule from './modules/learn/EMGModule';
import NCVModule from './modules/learn/NCVModule';
import CaseStudies from './modules/practice/CaseStudies';
import ReportBuilder from './modules/tools/ReportBuilder';

/**
 * Main Application Component
 * Modern tabbed navigation with medical-grade aesthetics
 */
function App() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Home', icon: Zap, color: 'primary' },
    { id: 'emg', label: 'EMG Patterns', icon: Activity, color: 'accent' },
    { id: 'ncv', label: 'Nerve Conduction', icon: Zap, color: 'accent' },
    { id: 'cases', label: 'Case Studies', icon: Stethoscope, color: 'success' },
    { id: 'reports', label: 'Report Builder', icon: FileText, color: 'primary' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Landing3D onGetStarted={() => setActiveTab('emg')} />;
      case 'emg':
        return <EMGModule />;
      case 'ncv':
        return <NCVModule />;
      case 'cases':
        return <CaseStudies />;
      case 'reports':
        return <ReportBuilder />;
      default:
        return <Landing3D onGetStarted={() => setActiveTab('emg')} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Navigation */}
      <header style={{
        background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          {/* Title Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem 0 1rem 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
              }}>
                <Activity size={28} color="white" />
              </div>
              <div>
                <h1 style={{
                  color: 'white',
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}>
                  EMG/NCV Teaching Platform
                </h1>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.875rem',
                  margin: 0,
                  fontWeight: '400',
                }}>
                  Clinical Neurophysiology Education
                </p>
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)',
            }}>
              <p style={{
                color: 'white',
                fontSize: '0.75rem',
                margin: 0,
                fontWeight: '500',
              }}>
                v4.0 • Dr. Yasir El-Sherif
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
            paddingBottom: '0',
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 1.5rem',
                    background: isActive
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'transparent',
                    border: 'none',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.75)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderBottom: isActive
                      ? '3px solid white'
                      : '3px solid transparent',
                    transform: isActive ? 'translateY(0)' : 'translateY(0)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
                    }
                  }}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        background: 'var(--bg-secondary)',
        minHeight: 'calc(100vh - 140px)',
      }}>
        <div className="fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border-light)',
        padding: '2rem 0',
        marginTop: 'auto',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem',
        }}>
          <div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              margin: '0 0 0.25rem 0',
            }}>
              EMG/NCV Teaching Platform v4.0
            </p>
            <p style={{
              color: 'var(--text-tertiary)',
              fontSize: '0.75rem',
              margin: 0,
            }}>
              © 2025 Yasir El-Sherif, MD, PhD • Staten Island University Hospital
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a
              href="#"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-500)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              Documentation
            </a>
            <a
              href="https://github.com/yasir2000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-500)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              GitHub
            </a>
            <div style={{
              padding: '0.375rem 0.875rem',
              background: 'var(--bg-tertiary)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontWeight: '600',
            }}>
              MIT License
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
