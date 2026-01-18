/**
 * Clinical Constants and Normal Values
 * Based on standard electrophysiology references
 * 
 * References:
 * - Preston & Shapiro: Electromyography and Neuromuscular Disorders
 * - Oh's Clinical Electromyography
 * - American Association of Neuromuscular & Electrodiagnostic Medicine (AANEM) guidelines
 */

/**
 * Normal Motor Nerve Conduction Values
 * Values vary by age - these are for adults 20-60 years
 */
export const MOTOR_NERVE_NORMALS = {
  median: {
    name: 'Median (motor)',
    distalLatency: { normal: '< 4.4 ms', min: 3.0, max: 4.4 },
    amplitude: { normal: '> 4 mV', min: 4.0, typical: 8.0 },
    conductionVelocity: { normal: '> 49 m/s', min: 49, typical: 56 },
    fWaveLatency: { normal: '< 31 ms', max: 31 },
  },
  ulnar: {
    name: 'Ulnar (motor)',
    distalLatency: { normal: '< 3.3 ms', min: 2.0, max: 3.3 },
    amplitude: { normal: '> 6 mV', min: 6.0, typical: 10.0 },
    conductionVelocity: { normal: '> 49 m/s', min: 49, typical: 56 },
    fWaveLatency: { normal: '< 32 ms', max: 32 },
  },
  peroneal: {
    name: 'Peroneal (motor)',
    distalLatency: { normal: '< 6.5 ms', min: 3.5, max: 6.5 },
    amplitude: { normal: '> 2 mV', min: 2.0, typical: 5.0 },
    conductionVelocity: { normal: '> 41 m/s', min: 41, typical: 48 },
    fWaveLatency: { normal: '< 56 ms', max: 56 },
  },
  tibial: {
    name: 'Tibial (motor)',
    distalLatency: { normal: '< 5.8 ms', min: 3.0, max: 5.8 },
    amplitude: { normal: '> 4 mV', min: 4.0, typical: 8.0 },
    conductionVelocity: { normal: '> 41 m/s', min: 41, typical: 46 },
    fWaveLatency: { normal: '< 58 ms', max: 58 },
  },
};

/**
 * Normal Sensory Nerve Conduction Values
 */
export const SENSORY_NERVE_NORMALS = {
  median: {
    name: 'Median (sensory)',
    peakLatency: { normal: '< 3.5 ms', min: 2.0, max: 3.5 },
    amplitude: { normal: '> 15 μV', min: 15, typical: 30 },
    conductionVelocity: { normal: '> 50 m/s', min: 50, typical: 56 },
  },
  ulnar: {
    name: 'Ulnar (sensory)',
    peakLatency: { normal: '< 3.1 ms', min: 2.0, max: 3.1 },
    amplitude: { normal: '> 10 μV', min: 10, typical: 20 },
    conductionVelocity: { normal: '> 50 m/s', min: 50, typical: 56 },
  },
  radial: {
    name: 'Radial (sensory)',
    peakLatency: { normal: '< 2.8 ms', min: 1.8, max: 2.8 },
    amplitude: { normal: '> 15 μV', min: 15, typical: 25 },
    conductionVelocity: { normal: '> 50 m/s', min: 50, typical: 58 },
  },
  sural: {
    name: 'Sural (sensory)',
    peakLatency: { normal: '< 4.4 ms', min: 2.5, max: 4.4 },
    amplitude: { normal: '> 6 μV', min: 6, typical: 15 },
    conductionVelocity: { normal: '> 40 m/s', min: 40, typical: 46 },
  },
};

/**
 * Pathology Patterns for NCV Studies
 */
export const PATHOLOGY_PATTERNS = {
  normal: {
    name: 'Normal',
    motorAmplitude: 1.0,
    motorCV: 1.0,
    sensoryAmplitude: 1.0,
    sensoryCV: 1.0,
    distalLatency: 1.0,
    description: 'All parameters within normal limits',
  },
  axonal: {
    name: 'Axonal Neuropathy',
    motorAmplitude: 0.3, // Reduced amplitudes
    motorCV: 0.95, // Relatively preserved CV
    sensoryAmplitude: 0.3,
    sensoryCV: 0.95,
    distalLatency: 1.0,
    description: 'Reduced amplitudes, preserved conduction velocities - axonal loss',
  },
  demyelinating: {
    name: 'Demyelinating Neuropathy',
    motorAmplitude: 0.7, // Relatively preserved amplitudes
    motorCV: 0.65, // Markedly slowed CV (<70% lower limit)
    sensoryAmplitude: 0.7,
    sensoryCV: 0.65,
    distalLatency: 1.5, // Prolonged latencies
    description: 'Slowed conduction velocities, prolonged latencies, temporal dispersion',
  },
  conductionBlock: {
    name: 'Conduction Block',
    motorAmplitude: 0.4, // >50% drop in amplitude proximal to distal
    motorCV: 0.75,
    sensoryAmplitude: 0.8,
    sensoryCV: 0.85,
    distalLatency: 1.2,
    description: '>50% amplitude drop between stimulation sites without temporal dispersion',
  },
  carpalTunnel: {
    name: 'Carpal Tunnel Syndrome',
    medianMotorDistalLatency: 1.5, // Prolonged median motor latency
    medianSensoryAmplitude: 0.4, // Reduced median sensory amplitude
    medianSensoryLatency: 1.6, // Prolonged median sensory latency
    ulnarNormal: true,
    description: 'Median neuropathy at wrist - prolonged latencies, reduced amplitudes',
  },
};

/**
 * EMG Pattern Definitions
 */
export const EMG_PATTERNS = {
  normal: {
    name: 'Normal Motor Unit',
    insertionalActivity: 'Normal (< 300ms)',
    spontaneousActivity: 'None',
    muapDuration: '8-15ms',
    muapAmplitude: '200-2000μV',
    muapPhases: '2-4 phases',
    recruitment: 'Full, orderly',
    clinicalSignificance: 'No denervation or myopathy',
  },
  denervation: {
    name: 'Acute Denervation',
    insertionalActivity: 'Increased',
    spontaneousActivity: 'Fibrillations, positive sharp waves',
    muapDuration: 'Normal or increased',
    muapAmplitude: 'Normal or increased',
    recruitment: 'Reduced (neurogenic)',
    clinicalSignificance: 'Active denervation - radiculopathy, neuropathy, motor neuron disease',
  },
  chronicDenervation: {
    name: 'Chronic Denervation/Reinnervation',
    insertionalActivity: 'Normal or decreased',
    spontaneousActivity: 'None or occasional fibrillations',
    muapDuration: 'Increased (polyphasic)',
    muapAmplitude: 'Increased',
    muapPhases: 'Polyphasic (>4 phases)',
    recruitment: 'Reduced, large unstable units',
    clinicalSignificance: 'Chronic reinnervation - old radiculopathy, ALS, CIDP',
  },
  myopathy: {
    name: 'Myopathic Pattern',
    insertionalActivity: 'Normal or increased',
    spontaneousActivity: 'May have fibrillations in severe cases',
    muapDuration: 'Decreased (short duration)',
    muapAmplitude: 'Decreased',
    muapPhases: 'Polyphasic',
    recruitment: 'Early recruitment (myopathic)',
    clinicalSignificance: 'Primary muscle disease - inflammatory, dystrophic, metabolic myopathy',
  },
  myotonic: {
    name: 'Myotonic Discharge',
    insertionalActivity: 'Prolonged, waxing-waning',
    spontaneousActivity: 'Myotonic discharges (dive bomber)',
    recruitment: 'May be normal',
    clinicalSignificance: 'Myotonic dystrophy, myotonia congenita, paramyotonia',
  },
};

/**
 * Common Diagnoses with Expected Findings
 */
export const CLINICAL_DIAGNOSES = {
  carpalTunnel: {
    name: 'Carpal Tunnel Syndrome',
    ncvFindings: [
      'Prolonged median motor distal latency (>4.4ms)',
      'Prolonged median sensory peak latency (>3.5ms)',
      'Reduced median sensory amplitude',
      'Normal ulnar studies',
    ],
    emgFindings: [
      'May be normal if mild',
      'Chronic: fibrillations in APB, thenar muscles',
      'Chronic denervation changes in severe cases',
    ],
    severity: {
      mild: 'Sensory latency prolongation only',
      moderate: 'Sensory and motor latency prolongation',
      severe: 'Amplitude reduction, denervation on EMG',
    },
  },
  c6Radiculopathy: {
    name: 'C6 Radiculopathy',
    ncvFindings: [
      'Normal nerve conduction studies (lesion proximal to DRG)',
      'May have reduced SNAP amplitudes if severe/chronic',
    ],
    emgFindings: [
      'Fibrillations in C6 myotome: biceps, brachioradialis, pronator teres',
      'Normal cervical paraspinals or fibrillations if root involved',
      'Spares C5, C7 muscles',
    ],
    distribution: 'C6 dermatome/myotome pattern',
  },
  axonalPolyneuropathy: {
    name: 'Axonal Polyneuropathy',
    ncvFindings: [
      'Reduced amplitudes (motor and sensory)',
      'Relatively preserved conduction velocities',
      'Distal > proximal involvement (length-dependent)',
      'Lower extremity > upper extremity',
    ],
    emgFindings: [
      'Distal muscle fibrillations',
      'Reduced recruitment',
      'Large polyphasic MUAPs in chronic cases',
    ],
    causes: 'Diabetes, alcohol, B12 deficiency, chemotherapy, critical illness',
  },
  cidp: {
    name: 'CIDP (Chronic Inflammatory Demyelinating Polyneuropathy)',
    ncvFindings: [
      'Markedly slowed conduction velocities (<70-75% LLN)',
      'Prolonged distal latencies (>130-150% ULN)',
      'Conduction block or temporal dispersion',
      'Prolonged or absent F-waves',
    ],
    emgFindings: [
      'Reduced recruitment pattern',
      'Fibrillations if axonal component',
      'Large polyphasic MUAPs from reinnervation',
    ],
    treatment: 'IVIg, steroids, plasmapheresis',
  },
  als: {
    name: 'ALS (Amyotrophic Lateral Sclerosis)',
    ncvFindings: [
      'Normal or mildly reduced motor amplitudes (late)',
      'Normal sensory studies',
      'Normal conduction velocities',
    ],
    emgFindings: [
      'Widespread acute denervation (fibrillations, PSWs)',
      'Chronic reinnervation (large, polyphasic MUAPs)',
      'Fasciculations (must have other findings)',
      'Involvement in ≥3 regions (bulbar, cervical, thoracic, lumbosacral)',
    ],
    awaji: 'Fasciculations equivalent to fibrillations for diagnosis (Awaji criteria)',
  },
};

/**
 * Age-Related Adjustments
 * Conduction velocities decrease ~1-2 m/s per decade after age 60
 */
export function adjustForAge(value, age, parameterType) {
  if (age < 60) return value;
  
  const decadesOver60 = (age - 60) / 10;
  
  if (parameterType === 'cv') {
    // Reduce CV by 1.5 m/s per decade
    return value - (decadesOver60 * 1.5);
  } else if (parameterType === 'amplitude') {
    // Reduce amplitude by 10% per decade
    return value * Math.pow(0.9, decadesOver60);
  }
  
  return value;
}

/**
 * Temperature Adjustments
 * Conduction velocity changes ~2 m/s per °C
 * Standard temperature: 33-34°C limb temperature
 */
export function adjustForTemperature(cv, measuredTemp, standardTemp = 34) {
  const tempDiff = standardTemp - measuredTemp;
  return cv + (tempDiff * 2); // 2 m/s per degree
}

/**
 * Height/Distance Adjustments for Latencies
 * F-wave latencies vary with limb length
 */
export function adjustLatencyForHeight(latency, height, nerve) {
  // This is approximate - clinical labs use more detailed formulas
  const heightFactor = height / 170; // Normalized to 170cm
  return latency * heightFactor;
}

export default {
  MOTOR_NERVE_NORMALS,
  SENSORY_NERVE_NORMALS,
  PATHOLOGY_PATTERNS,
  EMG_PATTERNS,
  CLINICAL_DIAGNOSES,
  adjustForAge,
  adjustForTemperature,
  adjustLatencyForHeight,
};
