import React, { useState, useEffect, useRef } from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import { MOTOR_NERVE_NORMALS, SENSORY_NERVE_NORMALS, PATHOLOGY_PATTERNS } from '../../utils/constants';

/**
 * NCV Module - Interactive Nerve Conduction Studies
 * Features fixed scaling and proper waveform centering
 */
function NCVModule() {
  const [nerveType, setNerveType] = useState('motor');
  const [selectedNerve, setSelectedNerve] = useState('median');
  const [pattern, setPattern] = useState('normal');
  const [distance, setDistance] = useState(200); // mm
  const [distalLatency, setDistalLatency] = useState(3.5); // ms
  const [proximalLatency, setProximalLatency] = useState(7.8); // ms
  
  const canvasRef = useRef(null);

  const motorNerves = Object.keys(MOTOR_NERVE_NORMALS);
  const sensoryNerves = Object.keys(SENSORY_NERVE_NORMALS);
  const patternList = Object.keys(PATHOLOGY_PATTERNS);

  // Calculate conduction velocity
  const conductionVelocity = distance / (proximalLatency - distalLatency);

  // Get normal values
  const getNormals = () => {
    if (nerveType === 'motor') {
      return MOTOR_NERVE_NORMALS[selectedNerve];
    } else {
      return SENSORY_NERVE_NORMALS[selectedNerve];
    }
  };

  const normals = getNormals();

  // Check if value is abnormal
  const isAbnormal = (value, type) => {
    if (!normals) return false;
    
    if (type === 'cv') {
      return value < normals.conductionVelocity.min;
    } else if (type === 'latency') {
      const maxLatency = nerveType === 'motor' ? normals.distalLatency.max : normals.peakLatency.max;
      return distalLatency > maxLatency;
    }
    return false;
  };

  // Draw NCV visualization
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

    // Clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Calculate positions - FIXED CENTERING
    const margin = 80;
    const usableWidth = width - 2 * margin;
    const centerY = height / 2;
    const nerveY = centerY;

    // Distal and proximal stimulation points
    const distalX = margin;
    const proximalX = margin + (distance / 300) * usableWidth; // Scale based on distance

    // Draw nerve (horizontal line)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(distalX, nerveY);
    ctx.lineTo(proximalX, nerveY);
    ctx.stroke();

    // Draw stimulation points
    const drawStimPoint = (x, label) => {
      // Electrode
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x, nerveY - 30, 8, 0, Math.PI * 2);
      ctx.fill();

      // Connection line
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x, nerveY - 30);
      ctx.lineTo(x, nerveY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = '#0f172a';
      ctx.font = '14px var(--font-display)';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, nerveY - 45);
    };

    drawStimPoint(distalX, 'Distal');
    drawStimPoint(proximalX, 'Proximal');

    // Draw recording electrode
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(distalX - 40, nerveY, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = '14px var(--font-display)';
    ctx.textAlign = 'center';
    ctx.fillText('Recording', distalX - 40, nerveY + 30);

    // Draw distance measurement
    ctx.strokeStyle = '#0891b2';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(distalX, nerveY + 40);
    ctx.lineTo(proximalX, nerveY + 40);
    ctx.stroke();

    // Distance arrows
    const drawArrow = (x, y, direction) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + direction * 10, y - 5);
      ctx.lineTo(x + direction * 10, y + 5);
      ctx.closePath();
      ctx.fillStyle = '#0891b2';
      ctx.fill();
    };

    drawArrow(distalX, nerveY + 40, 1);
    drawArrow(proximalX, nerveY + 40, -1);

    ctx.fillStyle = '#0891b2';
    ctx.font = 'bold 14px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.fillText(`${distance}mm`, (distalX + proximalX) / 2, nerveY + 35);

    // Draw waveforms
    const waveformHeight = 80;
    const waveformWidth = 150;

    const drawWaveform = (x, y, latency, label) => {
      // Get pattern modifiers
      const patternData = PATHOLOGY_PATTERNS[pattern];
      const amplitude = nerveType === 'motor'
        ? patternData.motorAmplitude
        : patternData.sensoryAmplitude;

      // Background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x - waveformWidth / 2, y - waveformHeight / 2, waveformWidth, waveformHeight);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - waveformWidth / 2, y - waveformHeight / 2, waveformWidth, waveformHeight);

      // Baseline
      ctx.strokeStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(x - waveformWidth / 2, y);
      ctx.lineTo(x + waveformWidth / 2, y);
      ctx.stroke();

      // Stimulus artifact
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - waveformWidth / 2 + 20, y - 10);
      ctx.lineTo(x - waveformWidth / 2 + 20, y + 10);
      ctx.stroke();

      // Action potential
      const startX = x - waveformWidth / 2 + 20 + (latency / 10) * 80;
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      
      // Triphasic waveform scaled by amplitude
      const points = [
        [0, 0],
        [5, -15 * amplitude],
        [10, -30 * amplitude],
        [15, -20 * amplitude],
        [20, 10 * amplitude],
        [25, 5 * amplitude],
        [30, 0],
      ];

      points.forEach((point, i) => {
        const px = startX + point[0];
        const py = y + point[1];
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      });

      ctx.stroke();

      // Latency marker
      ctx.fillStyle = '#0891b2';
      ctx.font = '11px var(--font-mono)';
      ctx.textAlign = 'center';
      ctx.fillText(`${latency.toFixed(1)}ms`, startX + 15, y - waveformHeight / 2 - 5);

      // Label
      ctx.fillStyle = '#475569';
      ctx.font = '13px var(--font-display)';
      ctx.fillText(label, x, y + waveformHeight / 2 + 20);
    };

    drawWaveform(distalX, centerY - 120, distalLatency, 'Distal Response');
    drawWaveform(proximalX, centerY - 120, proximalLatency, 'Proximal Response');

    // Calculate and display CV
    const cvX = width / 2;
    const cvY = height - 40;

    ctx.fillStyle = isAbnormal(conductionVelocity, 'cv') ? '#ef4444' : '#10b981';
    ctx.font = 'bold 24px var(--font-display)';
    ctx.textAlign = 'center';
    ctx.fillText(`${conductionVelocity.toFixed(1)} m/s`, cvX, cvY);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px var(--font-display)';
    ctx.fillText('Conduction Velocity', cvX, cvY + 20);

  }, [distance, distalLatency, proximalLatency, selectedNerve, nerveType, pattern]);

  return (
    <div className="container" style={{ padding: '3rem 2rem', maxWidth: '1400px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Nerve Conduction Studies</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Interactive NCV visualization with proper scaling and normal value references
        </p>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Nerve Type */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
            }}>
              Nerve Type
            </label>
            <select
              value={nerveType}
              onChange={(e) => {
                setNerveType(e.target.value);
                setSelectedNerve(e.target.value === 'motor' ? 'median' : 'median');
              }}
            >
              <option value="motor">Motor</option>
              <option value="sensory">Sensory</option>
            </select>
          </div>

          {/* Selected Nerve */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
            }}>
              Nerve
            </label>
            <select
              value={selectedNerve}
              onChange={(e) => setSelectedNerve(e.target.value)}
            >
              {(nerveType === 'motor' ? motorNerves : sensoryNerves).map(nerve => (
                <option key={nerve} value={nerve}>
                  {nerve.charAt(0).toUpperCase() + nerve.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Pattern */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
            }}>
              Pattern
            </label>
            <select
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
            >
              {patternList.map(p => (
                <option key={p} value={p}>
                  {PATHOLOGY_PATTERNS[p].name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
        }}>
          <div>
            <label style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
            }}>
              <span>Distance (mm)</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{distance}</span>
            </label>
            <input
              type="range"
              min="100"
              max="300"
              value={distance}
              onChange={(e) => setDistance(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
            }}>
              <span>Distal Latency (ms)</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                color: isAbnormal(distalLatency, 'latency') ? 'var(--danger)' : 'inherit',
              }}>
                {distalLatency.toFixed(1)}
              </span>
            </label>
            <input
              type="range"
              min="2.0"
              max="10.0"
              step="0.1"
              value={distalLatency}
              onChange={(e) => setDistalLatency(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
            }}>
              <span>Proximal Latency (ms)</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{proximalLatency.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="5.0"
              max="20.0"
              step="0.1"
              value={proximalLatency}
              onChange={(e) => setProximalLatency(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Canvas Display */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '500px',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* Results */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
      }}>
        {/* Calculated Values */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="var(--primary-500)" />
            Calculated Values
          </div>
          <table style={{ fontSize: '0.875rem' }}>
            <tbody>
              <tr>
                <td style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Conduction Velocity</td>
                <td>
                  <span className={isAbnormal(conductionVelocity, 'cv') ? 'text-danger' : 'text-success'}>
                    {conductionVelocity.toFixed(1)} m/s
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Distal Latency</td>
                <td>
                  <span className={isAbnormal(distalLatency, 'latency') ? 'text-danger' : 'text-success'}>
                    {distalLatency.toFixed(1)} ms
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Latency Difference</td>
                <td><code>{(proximalLatency - distalLatency).toFixed(1)} ms</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Normal Values */}
        {normals && (
          <div className="card" style={{ background: '#dbeafe' }}>
            <div className="card-header" style={{ borderColor: '#3b82f6' }}>
              Normal Reference Values
            </div>
            <table style={{ fontSize: '0.875rem' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: '600' }}>Conduction Velocity</td>
                  <td><code>{normals.conductionVelocity.normal}</code></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>
                    {nerveType === 'motor' ? 'Distal Latency' : 'Peak Latency'}
                  </td>
                  <td>
                    <code>
                      {nerveType === 'motor'
                        ? normals.distalLatency.normal
                        : normals.peakLatency.normal}
                    </code>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>Amplitude</td>
                  <td><code>{normals.amplitude.normal}</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Pattern Info */}
        <div className="card" style={{ background: '#fef3c7' }}>
          <div className="card-header" style={{ borderColor: '#fbbf24' }}>
            Pattern: {PATHOLOGY_PATTERNS[pattern].name}
          </div>
          <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>
            {PATHOLOGY_PATTERNS[pattern].description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default NCVModule;
