/**
 * NeuroReport AI Integration
 * Connects EMG/NCV platform to your Base44 NeuroReport AI service
 */

const NEUROREPORT_API_URL = 'https://neuro-report-ai-8babdd5b.base44.app';

/**
 * Generate EMG/NCV report using AI
 * @param {Object} studyData - EMG/NCV findings data
 * @returns {Promise<Object>} Generated report
 */
export async function generateReport(studyData) {
  try {
    const response = await fetch(`${NEUROREPORT_API_URL}/api/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studyData),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('NeuroReport AI integration error:', error);
    return generateFallbackReport(studyData);
  }
}

/**
 * Fallback report generation if API unavailable
 */
function generateFallbackReport(studyData) {
  return {
    patientInfo: studyData.patientInfo || {},
    findings: studyData.findings || [],
    interpretation: generateLocalInterpretation(studyData),
    recommendations: generateRecommendations(studyData),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Local interpretation logic when AI unavailable
 */
function generateLocalInterpretation(studyData) {
  const findings = studyData.findings || [];
  let interpretation = [];

  // Analyze motor nerve findings
  const motorFindings = findings.filter(f => f.type === 'motor');
  if (motorFindings.length > 0) {
    const avgAmplitude = motorFindings.reduce((sum, f) => sum + (f.amplitude || 0), 0) / motorFindings.length;
    const avgCV = motorFindings.reduce((sum, f) => sum + (f.conductionVelocity || 0), 0) / motorFindings.length;

    if (avgAmplitude < 2) {
      interpretation.push('Reduced motor amplitudes suggest axonal loss');
    }
    if (avgCV < 40) {
      interpretation.push('Slowed conduction velocities suggest demyelination');
    }
  }

  // Analyze sensory nerve findings
  const sensoryFindings = findings.filter(f => f.type === 'sensory');
  if (sensoryFindings.length > 0) {
    const avgAmplitude = sensoryFindings.reduce((sum, f) => sum + (f.amplitude || 0), 0) / sensoryFindings.length;
    
    if (avgAmplitude < 5) {
      interpretation.push('Reduced sensory amplitudes present');
    }
  }

  // Analyze EMG findings
  const emgFindings = findings.filter(f => f.type === 'emg');
  if (emgFindings.some(f => f.fibrillations)) {
    interpretation.push('Active denervation present (fibrillation potentials)');
  }
  if (emgFindings.some(f => f.reducedRecruitment)) {
    interpretation.push('Reduced recruitment pattern suggests neurogenic process');
  }

  return interpretation.length > 0 
    ? interpretation 
    : ['Study within normal limits'];
}

/**
 * Generate clinical recommendations
 */
function generateRecommendations(studyData) {
  const recommendations = [];
  const interpretation = generateLocalInterpretation(studyData);

  if (interpretation.some(i => i.includes('axonal'))) {
    recommendations.push('Consider metabolic workup including diabetes, B12, thyroid function');
    recommendations.push('Clinical correlation with symptoms and distribution');
  }

  if (interpretation.some(i => i.includes('demyelination'))) {
    recommendations.push('Consider inflammatory neuropathy workup (CIDP, GBS)');
    recommendations.push('May benefit from CSF analysis and nerve biopsy consideration');
  }

  if (interpretation.some(i => i.includes('denervation'))) {
    recommendations.push('Consider radiculopathy vs anterior horn cell disease');
    recommendations.push('MRI of appropriate spinal level if radicular pattern');
  }

  return recommendations.length > 0 
    ? recommendations 
    : ['Routine follow-up as clinically indicated'];
}

/**
 * Format report for export
 */
export function formatReportForExport(reportData, format = 'html') {
  if (format === 'html') {
    return generateHTMLReport(reportData);
  } else if (format === 'pdf') {
    return generatePDFReport(reportData);
  } else if (format === 'json') {
    return JSON.stringify(reportData, null, 2);
  }
}

/**
 * Generate HTML formatted report
 */
function generateHTMLReport(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>EMG/NCV Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
    h2 { color: #34495e; margin-top: 30px; }
    .normal { color: #27ae60; font-weight: bold; }
    .abnormal { color: #e74c3c; font-weight: bold; }
    .finding { margin: 15px 0; padding: 10px; border-left: 4px solid #3498db; background: #ecf0f1; }
    .interpretation { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #34495e; color: white; }
  </style>
</head>
<body>
  <h1>ELECTRODIAGNOSTIC STUDY REPORT</h1>
  
  <div class="patient-info">
    <h2>Patient Information</h2>
    <p><strong>Name:</strong> ${data.patientInfo?.name || 'Not provided'}</p>
    <p><strong>Date:</strong> ${new Date(data.timestamp).toLocaleDateString()}</p>
    <p><strong>Indication:</strong> ${data.patientInfo?.indication || 'Not specified'}</p>
  </div>

  <h2>Nerve Conduction Studies</h2>
  <table>
    <tr>
      <th>Nerve</th>
      <th>Type</th>
      <th>Amplitude</th>
      <th>Velocity</th>
      <th>Latency</th>
    </tr>
    ${(data.findings || [])
      .filter(f => f.type !== 'emg')
      .map(f => `
        <tr>
          <td>${f.nerve}</td>
          <td>${f.type}</td>
          <td class="${f.amplitudeStatus || 'normal'}">${f.amplitude} ${f.type === 'motor' ? 'mV' : 'μV'}</td>
          <td class="${f.cvStatus || 'normal'}">${f.conductionVelocity || 'N/A'} m/s</td>
          <td class="${f.latencyStatus || 'normal'}">${f.latency || 'N/A'} ms</td>
        </tr>
      `).join('')}
  </table>

  <h2>Needle EMG</h2>
  <div>
    ${(data.findings || [])
      .filter(f => f.type === 'emg')
      .map(f => `
        <div class="finding">
          <strong>${f.muscle}</strong>: ${f.description || 'Normal'}
        </div>
      `).join('')}
  </div>

  <div class="interpretation">
    <h2>Interpretation</h2>
    ${(data.interpretation || []).map(i => `<p>• ${i}</p>`).join('')}
  </div>

  <h2>Recommendations</h2>
  ${(data.recommendations || []).map(r => `<p>• ${r}</p>`).join('')}

  <div style="margin-top: 50px; border-top: 2px solid #ccc; padding-top: 20px;">
    <p><strong>Yasir El-Sherif, MD, PhD</strong></p>
    <p>Board Certified in Neurology and Clinical Neurophysiology</p>
    <p>Generated: ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
  `;
}

/**
 * Generate PDF report (placeholder - requires PDF library)
 */
function generatePDFReport(data) {
  // This would integrate with jsPDF or similar
  console.log('PDF generation would go here');
  return generateHTMLReport(data);
}

/**
 * Send report to NeuroReport AI for AI-enhanced interpretation
 */
export async function enhanceReportWithAI(reportData) {
  try {
    const response = await fetch(`${NEUROREPORT_API_URL}/api/enhance-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('AI enhancement unavailable, using standard report');
  }
  
  return reportData;
}

export default {
  generateReport,
  formatReportForExport,
  enhanceReportWithAI,
};
