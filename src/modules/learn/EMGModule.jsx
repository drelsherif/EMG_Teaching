import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Info } from 'lucide-react';
import { generateEMGPattern, getPatternMetadata } from '../../utils/waveformGen';
import { playContinuousPattern, getAudioCharacteristics } from '../../utils/audioSynthesis';

/**
 * EMG Module - Interactive EMG Pattern Learning
 * Features fixed authentic sounds and clinically accurate waveforms
 */
function EMGModule() {
  const [selectedPattern, setSelectedPattern] = useState('normal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const canvasRef = useRef(null);
  const audioControlRef = useRef(null);
  const animationRef = useRef(null);

  const patterns = [
    { id: 'normal', name: 'Normal MUAP', color: '#10b981' },
    { id: 'fibrillation', name: 'Fibrillation', color: '#ef4444' },
    { id: 'fasciculation', name: 'Fasciculation', color: '#f59e0b' },
    { id: 'myotonic', name: 'Myotonic Discharge', color: '#8b5cf6' },
    { id: 'crd', name: 'Complex Repetitive', color: '#ec4899' },
  ];

  // Draw waveform to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Generate waveform data
    const duration = 2000; // 2 seconds
    const data = generateEMGPattern(selectedPattern, duration, 10);

    // Find amplitude range for scaling
    let maxAmp = 0;
    for (let i = 0; i < data.length; i++) {
      maxAmp = Math.max(maxAmp, Math.abs(data[i]));
    }

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    // Vertical grid lines (time)
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal grid lines (amplitude)
    for (let i = 0; i <= 6; i++) {
      const y = (i / 6) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw baseline
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw waveform
    const pattern = patterns.find(p => p.id === selectedPattern);
    ctx.strokeStyle = pattern?.color || '#0891b2';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const x = (i / data.length) * width;
      const y = height / 2 - (data[i] / maxAmp) * (height * 0.4);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw time markers
    ctx.fillStyle = '#475569';
    ctx.font = '12px var(--font-mono)';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const x = (i / 4) * width;
      const time = (i / 4) * 2000;
      ctx.fillText(`${time}ms`, x, height - 5);
    }

    // Draw amplitude markers
    ctx.textAlign = 'right';
    ctx.fillText(`+${Math.round(maxAmp)}μV`, width - 5, 15);
    ctx.fillText('0μV', width - 5, height / 2 + 5);
    ctx.fillText(`-${Math.round(maxAmp)}μV`, width - 5, height - 15);

  }, [selectedPattern]);

  // Handle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      // Stop
      if (audioControlRef.current) {
        audioControlRef.current.stop();
        audioControlRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // Start
      if (soundEnabled) {
        audioControlRef.current = playContinuousPattern(selectedPattern, 0, 0.3);
      }
      setIsPlaying(true);

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (audioControlRef.current) {
          audioControlRef.current.stop();
          audioControlRef.current = null;
        }
        setIsPlaying(false);
      }, 10000);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioControlRef.current) {
        audioControlRef.current.stop();
      }
    };
  }, []);

  const metadata = getPatternMetadata(selectedPattern);
  const audioInfo = getAudioCharacteristics(selectedPattern);

  return (
    <div className="container" style={{ padding: '3rem 2rem', maxWidth: '1400px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>EMG Pattern Recognition</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Learn to identify and interpret common EMG waveform patterns with clinically accurate sounds
        </p>
      </div>

      {/* Pattern Selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            onClick={() => {
              setSelectedPattern(pattern.id);
              if (isPlaying) {
                if (audioControlRef.current) {
                  audioControlRef.current.stop();
                }
                setIsPlaying(false);
              }
            }}
            style={{
              padding: '1rem',
              background: selectedPattern === pattern.id
                ? `${pattern.color}15`
                : 'var(--surface)',
              border: `2px solid ${selectedPattern === pattern.id ? pattern.color : 'var(--border-light)'}`,
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              if (selectedPattern !== pattern.id) {
                e.currentTarget.style.borderColor = pattern.color;
                e.currentTarget.style.background = `${pattern.color}08`;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPattern !== pattern.id) {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.background = 'var(--surface)';
              }
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.25rem',
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: pattern.color,
              }} />
              <span style={{
                fontWeight: '600',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
              }}>
                {pattern.name}
              </span>
            </div>
            {selectedPattern === pattern.id && (
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
                marginTop: '0.25rem',
              }}>
                Selected
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Waveform Display */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
          <h3 style={{ margin: 0 }}>Waveform Display</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{ padding: '0.5rem 1rem' }}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
            </button>
            <button
              className={`btn ${isPlaying ? 'btn-danger' : 'btn-success'}`}
              onClick={togglePlay}
              style={{ padding: '0.5rem 1.5rem' }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              <span>{isPlaying ? 'Stop' : 'Play Pattern'}</span>
            </button>
          </div>
        </div>

        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '400px',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* Pattern Information */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
      }}>
        {/* Waveform Characteristics */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={20} color="var(--primary-500)" />
            Waveform Characteristics
          </div>
          <table style={{ fontSize: '0.875rem' }}>
            <tbody>
              <tr>
                <td style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Duration</td>
                <td><code>{metadata.duration}</code></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Amplitude</td>
                <td><code>{metadata.amplitude}</code></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Firing Rate</td>
                <td><code>{metadata.firing}</code></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Sound</td>
                <td><em>{metadata.sound}</em></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Clinical Significance */}
        <div className="card" style={{ background: '#fef3c7' }}>
          <div className="card-header" style={{ borderColor: '#fbbf24' }}>
            Clinical Significance
          </div>
          <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>
            {metadata.clinical}
          </p>
        </div>

        {/* Audio Characteristics */}
        <div className="card">
          <div className="card-header">Audio Characteristics</div>
          <table style={{ fontSize: '0.875rem' }}>
            <tbody>
              <tr>
                <td style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Description</td>
                <td>{audioInfo.soundDescription}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Frequency</td>
                <td><code>{audioInfo.frequency}</code></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Timing</td>
                <td><code>{audioInfo.timing}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EMGModule;
