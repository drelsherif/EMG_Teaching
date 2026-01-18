/**
 * Clinically Accurate EMG Waveform Generation
 * Based on electrophysiology literature and clinical practice
 * 
 * References:
 * - Preston & Shapiro: Electromyography and Neuromuscular Disorders (4th ed)
 * - Dumitru: Electrodiagnostic Medicine (2nd ed)
 * - Normal MUAP duration: 8-15ms, amplitude: 200-2000μV
 * - Fibrillation: biphasic spike, 1-5ms duration, ~100μV, irregular 2-20Hz
 * - Fasciculation: looks like normal MUAP but fires spontaneously
 * - Myotonic: high-frequency 20-150Hz, waxing-waning amplitude
 * - Complex Repetitive Discharge (CRD): 5-100Hz regular bursts
 */

/**
 * Normal Motor Unit Action Potential (MUAP)
 * Duration: 8-15ms
 * Amplitude: 200-2000μV (varies by muscle)
 * Shape: Triphasic (initial small positive, main negative, terminal positive)
 */
export function generateNormalMUAP(timeMs, phase = 0) {
  const duration = 12; // ms - typical MUAP duration
  const amplitude = 800; // μV
  
  if (timeMs < 0 || timeMs > duration) return 0;
  
  // Triphasic waveform: small positive, large negative, small positive
  const t = timeMs / duration;
  
  if (t < 0.15) {
    // Initial small positive deflection
    return amplitude * 0.2 * Math.sin(t * Math.PI / 0.15);
  } else if (t < 0.65) {
    // Main negative spike
    const localT = (t - 0.15) / 0.5;
    return -amplitude * Math.sin(localT * Math.PI);
  } else {
    // Terminal positive deflection
    const localT = (t - 0.65) / 0.35;
    return amplitude * 0.15 * Math.sin(localT * Math.PI);
  }
}

/**
 * Fibrillation Potential
 * Duration: 1-5ms (typically 2ms)
 * Amplitude: 50-300μV (usually ~100μV)
 * Shape: Biphasic (initial positive, then negative) or triphasic
 * Firing rate: Irregular, 2-20Hz
 * Sound: "Rain on tin roof" - short, crisp, irregular clicks
 */
export function generateFibrillation(timeMs) {
  const duration = 2; // ms - classic fibrillation duration
  const amplitude = 150; // μV
  
  if (timeMs < 0 || timeMs > duration) return 0;
  
  const t = timeMs / duration;
  
  if (t < 0.4) {
    // Sharp positive spike
    return amplitude * Math.sin(t * Math.PI / 0.4);
  } else {
    // Negative deflection
    return -amplitude * 0.7 * Math.sin((t - 0.4) * Math.PI / 0.6);
  }
}

/**
 * Fasciculation Potential
 * Looks like normal MUAP but fires spontaneously
 * Duration: 8-15ms
 * Fires randomly every 0.5-5 seconds
 * Sound: "Popcorn popping" - intermittent normal-sounding pops
 */
export function generateFasciculation(timeMs) {
  // Fasciculation is essentially a normal MUAP
  return generateNormalMUAP(timeMs);
}

/**
 * Myotonic Discharge
 * Frequency: 20-150Hz, typically starts high and decreases
 * Duration: Can last hundreds of milliseconds to seconds
 * Amplitude: Waxes and wanes
 * Sound: "Dive bomber" - characteristic high-to-low pitch sweep
 */
export function generateMyotonicDischarge(timeMs, totalDuration = 500) {
  const amplitude = 200; // μV
  
  if (timeMs < 0 || timeMs > totalDuration) return 0;
  
  // Progress through the discharge (0 to 1)
  const progress = timeMs / totalDuration;
  
  // Frequency sweep: 150Hz → 20Hz (dive bomber effect)
  const startFreq = 150;
  const endFreq = 20;
  const freq = startFreq - (startFreq - endFreq) * progress;
  
  // Waxing-waning amplitude envelope
  let envelope;
  if (progress < 0.3) {
    // Waxing phase
    envelope = progress / 0.3;
  } else if (progress < 0.7) {
    // Sustained phase
    envelope = 1.0;
  } else {
    // Waning phase
    envelope = (1.0 - progress) / 0.3;
  }
  
  // Generate waveform
  const phase = 2 * Math.PI * freq * timeMs / 1000;
  return amplitude * envelope * Math.sin(phase);
}

/**
 * Complex Repetitive Discharge (CRD)
 * Frequency: 5-100Hz (typically 20-50Hz)
 * Pattern: Regular, rhythmic, "machine-like"
 * Duration: Each spike ~10-20ms
 * Sound: "Machine gun" or "jackhammer" - very regular rhythm
 */
export function generateComplexRepetitiveDischarge(timeMs, burstFreq = 40) {
  const spikeDuration = 15; // ms per spike
  const amplitude = 300; // μV
  
  // Calculate which spike we're in
  const period = 1000 / burstFreq; // ms per burst
  const timeInPeriod = timeMs % period;
  
  if (timeInPeriod > spikeDuration) return 0;
  
  // Generate complex waveform (serrated appearance)
  const t = timeInPeriod / spikeDuration;
  
  // Multiple components create "complex" appearance
  let value = 0;
  value += Math.sin(t * Math.PI * 2) * 0.5;
  value += Math.sin(t * Math.PI * 3) * 0.3;
  value += Math.sin(t * Math.PI * 4) * 0.2;
  
  return amplitude * value;
}

/**
 * Positive Sharp Wave
 * Duration: 10-30ms
 * Amplitude: 50-1000μV
 * Shape: Initial sharp positive deflection, slow negative phase
 * Often seen with fibrillations
 */
export function generatePositiveSharpWave(timeMs) {
  const duration = 20; // ms
  const amplitude = 400; // μV
  
  if (timeMs < 0 || timeMs > duration) return 0;
  
  const t = timeMs / duration;
  
  if (t < 0.2) {
    // Sharp positive spike
    return amplitude * (t / 0.2);
  } else {
    // Slow negative decay
    return -amplitude * 0.7 * Math.exp(-(t - 0.2) * 5);
  }
}

/**
 * Generate complete EMG pattern for visualization
 * @param {string} patternType - Type of EMG pattern to generate
 * @param {number} durationMs - Total duration in milliseconds
 * @param {number} sampleRate - Samples per millisecond
 * @returns {Float32Array} Waveform data
 */
export function generateEMGPattern(patternType, durationMs, sampleRate = 10) {
  const numSamples = Math.floor(durationMs * sampleRate);
  const data = new Float32Array(numSamples);
  
  switch (patternType) {
    case 'normal':
      // Normal MUAPs firing at ~10-20Hz
      for (let i = 0; i < numSamples; i++) {
        const timeMs = i / sampleRate;
        // Random MUAP firings
        if (Math.random() < 0.015) { // ~15 MUAPs per second
          const muapDuration = 12;
          for (let j = 0; j < muapDuration * sampleRate && i + j < numSamples; j++) {
            data[i + j] += generateNormalMUAP(j / sampleRate);
          }
        }
      }
      break;
      
    case 'fibrillation':
      // Irregular fibrillations at 2-20Hz
      for (let i = 0; i < numSamples; i++) {
        if (Math.random() < 0.008) { // Average ~8 per second
          const fibDuration = 2;
          for (let j = 0; j < fibDuration * sampleRate && i + j < numSamples; j++) {
            data[i + j] += generateFibrillation(j / sampleRate);
          }
        }
      }
      break;
      
    case 'fasciculation':
      // Occasional fasciculations (1-2 per second)
      for (let i = 0; i < numSamples; i++) {
        if (Math.random() < 0.0015) { // ~1.5 per second
          const fascDuration = 12;
          for (let j = 0; j < fascDuration * sampleRate && i + j < numSamples; j++) {
            data[i + j] += generateFasciculation(j / sampleRate);
          }
        }
      }
      break;
      
    case 'myotonic':
      // Continuous myotonic discharge
      for (let i = 0; i < numSamples; i++) {
        const timeMs = i / sampleRate;
        data[i] = generateMyotonicDischarge(timeMs, durationMs);
      }
      break;
      
    case 'crd':
      // Regular complex repetitive discharges
      for (let i = 0; i < numSamples; i++) {
        const timeMs = i / sampleRate;
        data[i] = generateComplexRepetitiveDischarge(timeMs, 40);
      }
      break;
      
    default:
      // Baseline noise
      for (let i = 0; i < numSamples; i++) {
        data[i] = (Math.random() - 0.5) * 10; // 10μV baseline noise
      }
  }
  
  return data;
}

/**
 * Get pattern metadata for UI display
 */
export function getPatternMetadata(patternType) {
  const metadata = {
    normal: {
      name: 'Normal Motor Unit',
      duration: '8-15ms',
      amplitude: '200-2000μV',
      firing: '5-30Hz',
      sound: 'Clean pops',
      clinical: 'Normal voluntary recruitment',
    },
    fibrillation: {
      name: 'Fibrillation Potential',
      duration: '1-5ms',
      amplitude: '50-300μV',
      firing: 'Irregular 2-20Hz',
      sound: 'Rain on tin roof',
      clinical: 'Active denervation - seen in radiculopathies, neuropathies, myopathies',
    },
    fasciculation: {
      name: 'Fasciculation Potential',
      duration: '8-15ms (MUAP-like)',
      amplitude: '200-2000μV',
      firing: 'Random, 0.5-5s apart',
      sound: 'Popcorn popping',
      clinical: 'Can be benign or pathologic (ALS, radiculopathy, metabolic)',
    },
    myotonic: {
      name: 'Myotonic Discharge',
      duration: '100-1000ms',
      amplitude: 'Waxing-waning',
      firing: '20-150Hz sweep',
      sound: 'Dive bomber airplane',
      clinical: 'Myotonic dystrophy, myotonia congenita, paramyotonia',
    },
    crd: {
      name: 'Complex Repetitive Discharge',
      duration: '10-20ms per spike',
      amplitude: '100-1000μV',
      firing: 'Regular 20-50Hz',
      sound: 'Machine gun / jackhammer',
      clinical: 'Chronic denervation, various myopathies, rare normal',
    },
  };
  
  return metadata[patternType] || metadata.normal;
}
