import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';

/**
 * Case Studies Module
 * Interactive clinical cases with diagnosis quiz
 * Mimics NeuroReport AI structure for case presentation and analysis
 */
function CaseStudies() {
  const [selectedCase, setSelectedCase] = useState(0);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const cases = [
    {
      id: 1,
      title: 'Case 1: Carpal Tunnel Syndrome',
      presentation: {
        chiefComplaint: '58-year-old woman with numbness and tingling in both hands',
        history: 'Progressive symptoms over 6 months, worse at night, awakens her from sleep. Shakes hands to get relief. Works as a cashier.',
        symptoms: [
          'Numbness in thumb, index, middle fingers',
          'Nocturnal paresthesias',
          'Hand weakness - difficulty opening jars',
        ],
        exam: [
          'Positive Tinel\'s sign at wrist',
          'Positive Phalen\'s maneuver',
          'Thenar atrophy (mild)',
          'Decreased sensation in median distribution',
        ],
      },
      studyFindings: {
        ncv: [
          { nerve: 'Median (motor)', site: 'Wrist-APB', latency: 5.8, amplitude: 6.2, cv: 48, status: 'abnormal' },
          { nerve: 'Median (sensory)', site: 'Wrist-Digit 2', latency: 4.2, amplitude: 8, cv: 42, status: 'abnormal' },
          { nerve: 'Ulnar (motor)', site: 'Wrist-ADM', latency: 2.8, amplitude: 9.5, cv: 54, status: 'normal' },
          { nerve: 'Ulnar (sensory)', site: 'Wrist-Digit 5', latency: 2.6, amplitude: 18, cv: 52, status: 'normal' },
        ],
        emg: [
          { muscle: 'APB', insertional: 'Normal', spontaneous: 'Fibs 2+', recruitment: 'Reduced', muap: 'Increased duration' },
          { muscle: 'FDI', insertional: 'Normal', spontaneous: 'None', recruitment: 'Full', muap: 'Normal' },
          { muscle: 'Pronator Teres', insertional: 'Normal', spontaneous: 'None', recruitment: 'Full', muap: 'Normal' },
        ],
      },
      options: [
        { id: 'cts', label: 'Bilateral Carpal Tunnel Syndrome' },
        { id: 'c6-rad', label: 'C6 Radiculopathy' },
        { id: 'poly', label: 'Distal Sensory Polyneuropathy' },
        { id: 'tho', label: 'Thoracic Outlet Syndrome' },
      ],
      correct: 'cts',
      explanation: {
        why: 'This is bilateral carpal tunnel syndrome (median neuropathy at the wrist). Key features include prolonged median distal motor latency (5.8ms, normal <4.4ms), prolonged median sensory latency (4.2ms, normal <3.5ms), with normal ulnar studies. EMG shows denervation in APB (median-innervated) but normal FDI (ulnar) and pronator teres (median but proximal to wrist).',
        teaching: [
          'CTS is the most common entrapment neuropathy',
          'Nocturnal symptoms are characteristic due to wrist flexion during sleep',
          'Sensory symptoms typically precede motor symptoms',
          'EMG abnormalities indicate axonal loss and chronic denervation',
          'Bilateral involvement is common, especially in occupational settings',
        ],
        treatment: 'Wrist splinting at night, ergonomic modifications, possible corticosteroid injection. Surgical decompression if conservative management fails or if severe with thenar atrophy.',
      },
    },
    {
      id: 2,
      title: 'Case 2: C6 Radiculopathy',
      presentation: {
        chiefComplaint: '45-year-old man with right arm pain and weakness',
        history: 'Acute onset neck pain 3 weeks ago after lifting heavy boxes. Pain radiates down lateral arm to thumb. Numbness in thumb and index finger.',
        symptoms: [
          'Neck pain with radiation to thumb',
          'Weakness in arm',
          'Numbness in radial hand',
        ],
        exam: [
          'Reduced biceps reflex (right)',
          'Weakness: biceps (4/5), brachioradialis (4/5)',
          'Decreased sensation: lateral forearm, thumb',
          'Positive Spurling\'s test',
        ],
      },
      studyFindings: {
        ncv: [
          { nerve: 'Median (motor)', site: 'Wrist-APB', latency: 3.2, amplitude: 8.5, cv: 56, status: 'normal' },
          { nerve: 'Median (sensory)', site: 'Wrist-Digit 2', latency: 3.0, amplitude: 28, cv: 54, status: 'normal' },
          { nerve: 'Radial (sensory)', site: 'Forearm-Thumb', latency: 2.4, amplitude: 22, cv: 55, status: 'normal' },
        ],
        emg: [
          { muscle: 'Biceps', insertional: 'Increased', spontaneous: 'Fibs 3+, PSWs 2+', recruitment: 'Reduced', muap: 'Normal duration' },
          { muscle: 'Brachioradialis', insertional: 'Increased', spontaneous: 'Fibs 2+', recruitment: 'Reduced', muap: 'Normal' },
          { muscle: 'Pronator Teres', insertional: 'Increased', spontaneous: 'Fibs 2+', recruitment: 'Reduced', muap: 'Normal' },
          { muscle: 'Triceps', insertional: 'Normal', spontaneous: 'None', recruitment: 'Full', muap: 'Normal' },
          { muscle: 'Cervical Paraspinals (C5-6)', insertional: 'Increased', spontaneous: 'Fibs 2+', recruitment: 'N/A', muap: 'N/A' },
        ],
      },
      options: [
        { id: 'c6', label: 'Right C6 Radiculopathy' },
        { id: 'c7', label: 'Right C7 Radiculopathy' },
        { id: 'median-n', label: 'Median Neuropathy (proximal)' },
        { id: 'brachial', label: 'Brachial Plexopathy' },
      ],
      correct: 'c6',
      explanation: {
        why: 'This is a right C6 radiculopathy. Normal nerve conduction studies (lesion is proximal to dorsal root ganglion). EMG shows active denervation (fibrillations, positive sharp waves) in C6 myotome muscles: biceps, brachioradialis, and pronator teres. Cervical paraspinals show denervation, localizing to nerve root. C7 muscles (triceps) are normal.',
        teaching: [
          'Radiculopathies typically have normal NCS (preganglionic lesion)',
          'EMG is the key diagnostic test for radiculopathy',
          'C6 pattern: biceps, brachioradialis, pronator teres affected',
          'Paraspinal involvement confirms root (vs plexus or peripheral nerve)',
          'Acute denervation appears 2-3 weeks after injury',
        ],
        treatment: 'Conservative management: NSAIDs, physical therapy, epidural steroid injection. MRI cervical spine to evaluate for disc herniation. Surgery if progressive weakness or failed conservative treatment.',
      },
    },
    {
      id: 3,
      title: 'Case 3: Axonal Polyneuropathy',
      presentation: {
        chiefComplaint: '62-year-old diabetic man with numbness in feet',
        history: 'Progressive numbness and tingling in feet for 2 years. Started distally, now up to mid-calf. Burning sensation. No weakness. Type 2 diabetes for 15 years, HbA1c 8.5%.',
        symptoms: [
          'Distal numbness - stocking pattern',
          'Burning dysesthesias in feet',
          'Balance problems',
        ],
        exam: [
          'Absent ankle reflexes bilaterally',
          'Decreased vibration sense at toes',
          'Decreased pinprick in stocking distribution',
          'Strength normal',
        ],
      },
      studyFindings: {
        ncv: [
          { nerve: 'Peroneal (motor)', site: 'Ankle-EDB', latency: 4.8, amplitude: 1.2, cv: 42, status: 'abnormal' },
          { nerve: 'Tibial (motor)', site: 'Ankle-AH', latency: 5.2, amplitude: 2.8, cv: 40, status: 'abnormal' },
          { nerve: 'Sural (sensory)', site: 'Calf-Ankle', latency: 'NR', amplitude: 'NR', cv: 'NR', status: 'abnormal' },
          { nerve: 'Superficial Peroneal (sensory)', site: 'Leg-Ankle', latency: 'NR', amplitude: 'NR', cv: 'NR', status: 'abnormal' },
          { nerve: 'Median (motor)', site: 'Wrist-APB', latency: 3.6, amplitude: 7.2, cv: 52, status: 'normal' },
        ],
        emg: [
          { muscle: 'Tibialis Anterior', insertional: 'Normal', spontaneous: 'Fibs 1+', recruitment: 'Reduced', muap: 'Increased duration' },
          { muscle: 'Gastrocnemius', insertional: 'Normal', spontaneous: 'Fibs 1+', recruitment: 'Reduced', muap: 'Increased duration' },
          { muscle: 'Vastus Lateralis', insertional: 'Normal', spontaneous: 'None', recruitment: 'Full', muap: 'Normal' },
        ],
      },
      options: [
        { id: 'axonal', label: 'Axonal Sensorimotor Polyneuropathy' },
        { id: 'demyel', label: 'Demyelinating Polyneuropathy (CIDP)' },
        { id: 'l5-rad', label: 'Bilateral L5 Radiculopathy' },
        { id: 'spinal', label: 'Spinal Stenosis' },
      ],
      correct: 'axonal',
      explanation: {
        why: 'This is an axonal sensorimotor polyneuropathy (likely diabetic). Key features: reduced amplitudes (motor and sensory) with relatively preserved conduction velocities. Absent sural responses. Distal > proximal involvement (length-dependent). Lower extremity >> upper extremity. EMG shows chronic denervation/reinnervation distally.',
        teaching: [
          'Axonal neuropathy: ↓ amplitudes, relatively normal CVs',
          'Diabetic neuropathy is the most common cause in developed countries',
          'Length-dependent pattern - longest nerves affected first',
          'Sensory symptoms typically precede motor symptoms',
          'Poor glycemic control (HbA1c >7%) accelerates neuropathy',
        ],
        treatment: 'Optimize diabetes control (target HbA1c <7%). Gabapentin or pregabalin for neuropathic pain. Duloxetine alternative. Foot care education. B12, thyroid function testing. Consider other causes if atypical features.',
      },
    },
  ];

  const currentCase = cases[selectedCase];

  const handleDiagnosisSubmit = () => {
    if (selectedDiagnosis) {
      setShowFeedback(true);
    }
  };

  const resetCase = () => {
    setSelectedDiagnosis('');
    setShowFeedback(false);
  };

  const isCorrect = selectedDiagnosis === currentCase.correct;

  return (
    <div className="container" style={{ padding: '3rem 2rem', maxWidth: '1400px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Clinical Case Studies</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Practice your diagnostic skills with real-world EMG/NCV cases
        </p>
      </div>

      {/* Case Selection */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
      }}>
        {cases.map((c, index) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCase(index);
              resetCase();
            }}
            className={`btn ${selectedCase === index ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: '1 1 200px' }}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Case Presentation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem',
      }}>
        {/* Clinical History */}
        <div className="card">
          <div className="card-header">Clinical Presentation</div>
          <div style={{ fontSize: '0.875rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Chief Complaint:</strong><br />
              {currentCase.presentation.chiefComplaint}
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>History:</strong><br />
              {currentCase.presentation.history}
            </p>
            <p style={{ marginBottom: '0.5rem' }}><strong>Key Symptoms:</strong></p>
            <ul style={{ marginLeft: '1.25rem', marginBottom: '1rem' }}>
              {currentCase.presentation.symptoms.map((s, i) => (
                <li key={i} style={{ marginBottom: '0.25rem' }}>{s}</li>
              ))}
            </ul>
            <p style={{ marginBottom: '0.5rem' }}><strong>Physical Exam:</strong></p>
            <ul style={{ marginLeft: '1.25rem' }}>
              {currentCase.presentation.exam.map((e, i) => (
                <li key={i} style={{ marginBottom: '0.25rem' }}>{e}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Study Findings - NCV */}
        <div className="card">
          <div className="card-header">Nerve Conduction Studies</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ fontSize: '0.75rem' }}>
              <thead>
                <tr>
                  <th>Nerve</th>
                  <th>Latency</th>
                  <th>Amp</th>
                  <th>CV</th>
                </tr>
              </thead>
              <tbody>
                {currentCase.studyFindings.ncv.map((finding, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: '600' }}>{finding.nerve}</td>
                    <td className={finding.status === 'abnormal' && finding.latency !== 'NR' ? 'text-danger' : ''}>
                      {finding.latency === 'NR' ? 'NR' : `${finding.latency}ms`}
                    </td>
                    <td className={finding.status === 'abnormal' && finding.amplitude !== 'NR' ? 'text-danger' : ''}>
                      {finding.amplitude === 'NR' ? 'NR' : `${finding.amplitude}`}
                    </td>
                    <td className={finding.status === 'abnormal' && finding.cv !== 'NR' ? 'text-danger' : ''}>
                      {finding.cv === 'NR' ? 'NR' : `${finding.cv}m/s`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Study Findings - EMG */}
        <div className="card">
          <div className="card-header">Needle EMG</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ fontSize: '0.75rem' }}>
              <thead>
                <tr>
                  <th>Muscle</th>
                  <th>Spont</th>
                  <th>Recruit</th>
                </tr>
              </thead>
              <tbody>
                {currentCase.studyFindings.emg.map((finding, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: '600' }}>{finding.muscle}</td>
                    <td className={finding.spontaneous !== 'None' ? 'text-danger' : 'text-success'}>
                      {finding.spontaneous}
                    </td>
                    <td className={finding.recruitment === 'Reduced' ? 'text-danger' : 'text-success'}>
                      {finding.recruitment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Diagnosis Section */}
      {!showFeedback && (
        <div className="card" style={{ background: '#f0f9ff' }}>
          <div className="card-header" style={{ borderColor: '#0891b2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} color="#0891b2" />
              What is your diagnosis?
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            {currentCase.options.map((option) => (
              <label
                key={option.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: selectedDiagnosis === option.id ? '#dbeafe' : 'white',
                  border: `2px solid ${selectedDiagnosis === option.id ? '#0891b2' : '#e2e8f0'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="radio"
                  name="diagnosis"
                  value={option.id}
                  checked={selectedDiagnosis === option.id}
                  onChange={(e) => setSelectedDiagnosis(e.target.value)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          <button
            className="btn btn-primary"
            onClick={handleDiagnosisSubmit}
            disabled={!selectedDiagnosis}
            style={{ opacity: selectedDiagnosis ? 1 : 0.5 }}
          >
            Submit Diagnosis
          </button>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div className="card" style={{
          background: isCorrect ? '#d1fae5' : '#fee2e2',
          border: `2px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            {isCorrect ? (
              <CheckCircle size={32} color="#10b981" />
            ) : (
              <XCircle size={32} color="#ef4444" />
            )}
            <div>
              <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {isCorrect
                  ? 'Excellent diagnostic reasoning!'
                  : `The correct answer is: ${currentCase.options.find(o => o.id === currentCase.correct).label}`
                }
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Explanation:</h4>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              {currentCase.explanation.why}
            </p>

            <h4 style={{ marginBottom: '0.5rem' }}>Teaching Points:</h4>
            <ul style={{ fontSize: '0.875rem', lineHeight: '1.6', marginLeft: '1.25rem' }}>
              {currentCase.explanation.teaching.map((point, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>{point}</li>
              ))}
            </ul>

            <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Management:</h4>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              {currentCase.explanation.treatment}
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={resetCase}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default CaseStudies;
