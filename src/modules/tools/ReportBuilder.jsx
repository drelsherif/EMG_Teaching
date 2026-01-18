import React, { useState } from 'react';
import { FileText, Download, Printer, Plus, Trash2 } from 'lucide-react';
import { MOTOR_NERVE_NORMALS, SENSORY_NERVE_NORMALS } from '../../utils/constants';

/**
 * Report Builder Module
 * Professional EMG/NCV report generation with export functionality
 * Mimics NeuroReport AI report structure
 */
function ReportBuilder() {
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    mrn: '',
    dob: '',
    date: new Date().toISOString().split('T')[0],
    indication: '',
  });

  const [ncvFindings, setNcvFindings] = useState([]);
  const [emgFindings, setEmgFindings] = useState([]);
  const [interpretation, setInterpretation] = useState('');
  const [recommendations, setRecommendations] = useState('');

  // Add NCV finding
  const addNcvFinding = () => {
    setNcvFindings([
      ...ncvFindings,
      {
        id: Date.now(),
        type: 'motor',
        nerve: 'median',
        latency: '',
        amplitude: '',
        cv: '',
      },
    ]);
  };

  // Add EMG finding
  const addEmgFinding = () => {
    setEmgFindings([
      ...emgFindings,
      {
        id: Date.now(),
        muscle: '',
        insertional: 'Normal',
        spontaneous: 'None',
        recruitment: 'Full',
        muap: 'Normal',
      },
    ]);
  };

  // Update finding
  const updateNcvFinding = (id, field, value) => {
    setNcvFindings(ncvFindings.map(f =>
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const updateEmgFinding = (id, field, value) => {
    setEmgFindings(emgFindings.map(f =>
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  // Delete finding
  const deleteNcvFinding = (id) => {
    setNcvFindings(ncvFindings.filter(f => f.id !== id));
  };

  const deleteEmgFinding = (id) => {
    setEmgFindings(emgFindings.filter(f => f.id !== id));
  };

  // Check if value is abnormal
  const checkAbnormal = (finding) => {
    const normals = finding.type === 'motor'
      ? MOTOR_NERVE_NORMALS[finding.nerve]
      : SENSORY_NERVE_NORMALS[finding.nerve];

    if (!normals || !finding.latency || !finding.amplitude || !finding.cv) {
      return { latency: false, amplitude: false, cv: false };
    }

    const latency = parseFloat(finding.latency);
    const amplitude = parseFloat(finding.amplitude);
    const cv = parseFloat(finding.cv);

    return {
      latency: finding.type === 'motor'
        ? latency > normals.distalLatency.max
        : latency > normals.peakLatency.max,
      amplitude: amplitude < normals.amplitude.min,
      cv: cv < normals.conductionVelocity.min,
    };
  };

  // Generate HTML report
  const generateReport = () => {
    const reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>EMG/NCV Report - ${patientInfo.name}</title>
  <style>
    @media print {
      @page { margin: 0.75in; }
      body { margin: 0; }
    }
    body {
      font-family: 'Segoe UI', -apple-system, sans-serif;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.5in;
      color: #1a1a1a;
      line-height: 1.6;
    }
    .header {
      border-bottom: 4px solid #0891b2;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
    h1 {
      color: #0891b2;
      font-size: 28px;
      margin: 0 0 0.5rem 0;
      font-weight: 700;
    }
    .subtitle {
      color: #64748b;
      font-size: 14px;
      margin: 0;
    }
    .patient-info {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
    .patient-info-item {
      font-size: 14px;
    }
    .patient-info-item strong {
      color: #475569;
      display: inline-block;
      min-width: 100px;
    }
    h2 {
      color: #0f172a;
      font-size: 20px;
      margin: 2rem 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
      font-size: 13px;
    }
    th {
      background: #0891b2;
      color: white;
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 0.75rem;
      border-bottom: 1px solid #e2e8f0;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tbody tr:hover {
      background: #f8fafc;
    }
    .normal {
      color: #059669;
      font-weight: 600;
    }
    .abnormal {
      color: #dc2626;
      font-weight: 600;
      background: #fee2e2;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
    .interpretation {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 1rem;
      margin: 1.5rem 0;
      border-radius: 4px;
    }
    .interpretation h3 {
      color: #92400e;
      margin: 0 0 0.5rem 0;
      font-size: 16px;
    }
    .interpretation p {
      margin: 0.5rem 0;
      color: #451a03;
    }
    .recommendations {
      background: #dbeafe;
      border-left: 4px solid #0891b2;
      padding: 1rem;
      margin: 1.5rem 0;
      border-radius: 4px;
    }
    .recommendations h3 {
      color: #075985;
      margin: 0 0 0.5rem 0;
      font-size: 16px;
    }
    .recommendations p {
      margin: 0.5rem 0;
      color: #0c4a6e;
    }
    .footer {
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 2px solid #e2e8f0;
      font-size: 12px;
      color: #64748b;
    }
    .signature {
      margin-top: 2rem;
    }
    .signature-line {
      border-top: 1px solid #0f172a;
      width: 300px;
      margin-top: 3rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ELECTRODIAGNOSTIC STUDY REPORT</h1>
    <p class="subtitle">EMG and Nerve Conduction Studies</p>
  </div>

  <div class="patient-info">
    <div class="patient-info-item"><strong>Patient Name:</strong> ${patientInfo.name || 'Not provided'}</div>
    <div class="patient-info-item"><strong>MRN:</strong> ${patientInfo.mrn || 'Not provided'}</div>
    <div class="patient-info-item"><strong>Date of Birth:</strong> ${patientInfo.dob || 'Not provided'}</div>
    <div class="patient-info-item"><strong>Study Date:</strong> ${patientInfo.date}</div>
    <div class="patient-info-item" style="grid-column: 1 / -1;"><strong>Indication:</strong> ${patientInfo.indication || 'Not specified'}</div>
  </div>

  <h2>Nerve Conduction Studies</h2>
  ${ncvFindings.length > 0 ? `
  <table>
    <thead>
      <tr>
        <th>Nerve</th>
        <th>Type</th>
        <th>Distal Latency (ms)</th>
        <th>Amplitude</th>
        <th>Conduction Velocity (m/s)</th>
      </tr>
    </thead>
    <tbody>
      ${ncvFindings.map(f => {
        const abnormal = checkAbnormal(f);
        return `
        <tr>
          <td><strong>${f.nerve.charAt(0).toUpperCase() + f.nerve.slice(1)}</strong></td>
          <td>${f.type === 'motor' ? 'Motor' : 'Sensory'}</td>
          <td class="${abnormal.latency ? 'abnormal' : 'normal'}">${f.latency || 'N/A'}</td>
          <td class="${abnormal.amplitude ? 'abnormal' : 'normal'}">
            ${f.amplitude || 'N/A'} ${f.type === 'motor' ? 'mV' : 'μV'}
          </td>
          <td class="${abnormal.cv ? 'abnormal' : 'normal'}">${f.cv || 'N/A'}</td>
        </tr>
        `;
      }).join('')}
    </tbody>
  </table>
  ` : '<p><em>No nerve conduction studies performed.</em></p>'}

  <h2>Needle Electromyography</h2>
  ${emgFindings.length > 0 ? `
  <table>
    <thead>
      <tr>
        <th>Muscle</th>
        <th>Insertional Activity</th>
        <th>Spontaneous Activity</th>
        <th>Recruitment</th>
        <th>MUAP</th>
      </tr>
    </thead>
    <tbody>
      ${emgFindings.map(f => `
      <tr>
        <td><strong>${f.muscle}</strong></td>
        <td>${f.insertional}</td>
        <td class="${f.spontaneous !== 'None' ? 'abnormal' : 'normal'}">${f.spontaneous}</td>
        <td class="${f.recruitment === 'Reduced' ? 'abnormal' : 'normal'}">${f.recruitment}</td>
        <td>${f.muap}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>
  ` : '<p><em>No needle EMG performed.</em></p>'}

  ${interpretation ? `
  <div class="interpretation">
    <h3>Interpretation</h3>
    <p>${interpretation.split('\n').join('</p><p>')}</p>
  </div>
  ` : ''}

  ${recommendations ? `
  <div class="recommendations">
    <h3>Recommendations</h3>
    <p>${recommendations.split('\n').join('</p><p>')}</p>
  </div>
  ` : ''}

  <div class="footer">
    <div class="signature">
      <p><strong>Yasir El-Sherif, MD, PhD</strong></p>
      <p>Board Certified in Neurology and Clinical Neurophysiology</p>
      <p>Staten Island University Hospital, Northwell Health</p>
      <div class="signature-line"></div>
      <p style="margin-top: 0.5rem;">Electronic Signature: ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
    `;

    // Open in new window for printing/saving
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportHTML);
    printWindow.document.close();
  };

  // Download as HTML
  const downloadReport = () => {
    const reportHTML = generateReport();
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EMG-NCV-Report-${patientInfo.name.replace(/\s+/g, '-')}-${patientInfo.date}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container" style={{ padding: '3rem 2rem', maxWidth: '1400px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '2rem',
      }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>EMG/NCV Report Builder</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Create professional electrodiagnostic reports with color-coded values
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={generateReport}>
            <Printer size={18} />
            Print Preview
          </button>
          <button className="btn btn-primary" onClick={downloadReport}>
            <Download size={18} />
            Download HTML
          </button>
        </div>
      </div>

      {/* Patient Information */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">Patient Information</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
            }}>
              Patient Name *
            </label>
            <input
              type="text"
              value={patientInfo.name}
              onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
            }}>
              MRN
            </label>
            <input
              type="text"
              value={patientInfo.mrn}
              onChange={(e) => setPatientInfo({ ...patientInfo, mrn: e.target.value })}
              placeholder="12345678"
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
            }}>
              Date of Birth
            </label>
            <input
              type="date"
              value={patientInfo.dob}
              onChange={(e) => setPatientInfo({ ...patientInfo, dob: e.target.value })}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
            }}>
              Study Date *
            </label>
            <input
              type="date"
              value={patientInfo.date}
              onChange={(e) => setPatientInfo({ ...patientInfo, date: e.target.value })}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
            }}>
              Clinical Indication *
            </label>
            <textarea
              value={patientInfo.indication}
              onChange={(e) => setPatientInfo({ ...patientInfo, indication: e.target.value })}
              placeholder="Evaluate for carpal tunnel syndrome"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* NCV Findings */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
          <div className="card-header" style={{ margin: 0, padding: 0, border: 'none' }}>
            Nerve Conduction Studies
          </div>
          <button className="btn btn-primary" onClick={addNcvFinding} style={{ padding: '0.5rem 1rem' }}>
            <Plus size={18} />
            Add Study
          </button>
        </div>

        {ncvFindings.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem' }}>
            No nerve conduction studies added. Click "Add Study" to begin.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {ncvFindings.map((finding) => {
              const abnormal = checkAbnormal(finding);
              return (
                <div
                  key={finding.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr 1fr auto',
                    gap: '1rem',
                    alignItems: 'end',
                    padding: '1rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ minWidth: '100px' }}>
                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                      Type
                    </label>
                    <select
                      value={finding.type}
                      onChange={(e) => updateNcvFinding(finding.id, 'type', e.target.value)}
                      style={{ padding: '0.5rem' }}
                    >
                      <option value="motor">Motor</option>
                      <option value="sensory">Sensory</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                      Nerve
                    </label>
                    <select
                      value={finding.nerve}
                      onChange={(e) => updateNcvFinding(finding.id, 'nerve', e.target.value)}
                    >
                      {Object.keys(finding.type === 'motor' ? MOTOR_NERVE_NORMALS : SENSORY_NERVE_NORMALS).map(n => (
                        <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                      Latency (ms)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={finding.latency}
                      onChange={(e) => updateNcvFinding(finding.id, 'latency', e.target.value)}
                      style={{ color: abnormal.latency ? 'var(--danger)' : 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                      Amplitude
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={finding.amplitude}
                      onChange={(e) => updateNcvFinding(finding.id, 'amplitude', e.target.value)}
                      style={{ color: abnormal.amplitude ? 'var(--danger)' : 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                      CV (m/s)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={finding.cv}
                      onChange={(e) => updateNcvFinding(finding.id, 'cv', e.target.value)}
                      style={{ color: abnormal.cv ? 'var(--danger)' : 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                      Status
                    </label>
                    <span className={`badge ${
                      abnormal.latency || abnormal.amplitude || abnormal.cv
                        ? 'badge-danger'
                        : 'badge-success'
                    }`}>
                      {abnormal.latency || abnormal.amplitude || abnormal.cv ? 'Abnormal' : 'Normal'}
                    </span>
                  </div>

                  <button
                    className="btn btn-danger"
                    onClick={() => deleteNcvFinding(finding.id)}
                    style={{ padding: '0.5rem' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EMG Findings */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
          <div className="card-header" style={{ margin: 0, padding: 0, border: 'none' }}>
            Needle EMG
          </div>
          <button className="btn btn-primary" onClick={addEmgFinding} style={{ padding: '0.5rem 1rem' }}>
            <Plus size={18} />
            Add Muscle
          </button>
        </div>

        {emgFindings.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem' }}>
            No EMG studies added. Click "Add Muscle" to begin.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {emgFindings.map((finding) => (
              <div
                key={finding.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr auto',
                  gap: '1rem',
                  alignItems: 'end',
                  padding: '1rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                    Muscle
                  </label>
                  <input
                    type="text"
                    value={finding.muscle}
                    onChange={(e) => updateEmgFinding(finding.id, 'muscle', e.target.value)}
                    placeholder="e.g., APB, FDI, Biceps"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                    Insertional
                  </label>
                  <select
                    value={finding.insertional}
                    onChange={(e) => updateEmgFinding(finding.id, 'insertional', e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Increased">Increased</option>
                    <option value="Decreased">Decreased</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                    Spontaneous
                  </label>
                  <select
                    value={finding.spontaneous}
                    onChange={(e) => updateEmgFinding(finding.id, 'spontaneous', e.target.value)}
                    style={{ color: finding.spontaneous !== 'None' ? 'var(--danger)' : 'inherit' }}
                  >
                    <option value="None">None</option>
                    <option value="Fibs 1+">Fibs 1+</option>
                    <option value="Fibs 2+">Fibs 2+</option>
                    <option value="Fibs 3+">Fibs 3+</option>
                    <option value="Fibs 4+">Fibs 4+</option>
                    <option value="Fasc">Fasciculations</option>
                    <option value="CRD">CRD</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                    Recruitment
                  </label>
                  <select
                    value={finding.recruitment}
                    onChange={(e) => updateEmgFinding(finding.id, 'recruitment', e.target.value)}
                    style={{ color: finding.recruitment === 'Reduced' ? 'var(--danger)' : 'inherit' }}
                  >
                    <option value="Full">Full</option>
                    <option value="Reduced">Reduced</option>
                    <option value="Early">Early</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                    MUAP
                  </label>
                  <select
                    value={finding.muap}
                    onChange={(e) => updateEmgFinding(finding.id, 'muap', e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Increased duration">Increased duration</option>
                    <option value="Decreased duration">Decreased duration</option>
                    <option value="Polyphasic">Polyphasic</option>
                  </select>
                </div>

                <button
                  className="btn btn-danger"
                  onClick={() => deleteEmgFinding(finding.id)}
                  style={{ padding: '0.5rem' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interpretation & Recommendations */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
      }}>
        <div className="card" style={{ background: '#fef3c7' }}>
          <div className="card-header" style={{ borderColor: '#fbbf24' }}>
            Interpretation
          </div>
          <textarea
            value={interpretation}
            onChange={(e) => setInterpretation(e.target.value)}
            placeholder="Enter your clinical interpretation based on the findings..."
            rows={8}
            style={{ background: 'white' }}
          />
        </div>

        <div className="card" style={{ background: '#dbeafe' }}>
          <div className="card-header" style={{ borderColor: '#0891b2' }}>
            Recommendations
          </div>
          <textarea
            value={recommendations}
            onChange={(e) => setRecommendations(e.target.value)}
            placeholder="Enter clinical recommendations and follow-up plan..."
            rows={8}
            style={{ background: 'white' }}
          />
        </div>
      </div>
    </div>
  );
}

export default ReportBuilder;
