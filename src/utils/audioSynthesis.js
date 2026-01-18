/**
 * Clinically Accurate EMG Audio Synthesis
 * Generates authentic-sounding EMG audio patterns based on clinical electrophysiology
 * 
 * Key principles:
 * - Fibrillations: Short clicks (2-5ms), irregular timing, "rain on roof"
 * - Fasciculations: Longer pops (8-15ms), very irregular, "popcorn"
 * - Myotonic: Continuous tone with frequency sweep, "dive bomber"
 * - CRD: Regular rhythm machine-gun pattern
 * - Normal MUAP: Clean pops with voluntary recruitment
 */

let audioContext = null;

/**
 * Initialize Web Audio Context
 */
function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Play Normal Motor Unit Action Potential
 * Clean, brief pop sound (8-15ms duration)
 * Dominant frequency: 50-150Hz
 */
export function playNormalMUAP(volume = 0.3) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  // Oscillator for main tone
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Frequency: 100Hz (typical MUAP dominant frequency)
  osc.frequency.value = 100;
  osc.type = 'sine';
  
  // Envelope: quick attack, brief sustain, quick decay
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.002); // 2ms attack
  gainNode.gain.linearRampToValueAtTime(volume * 0.7, now + 0.008); // 8ms sustain
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.015); // decay to 15ms
  
  osc.start(now);
  osc.stop(now + 0.015);
}

/**
 * Play Fibrillation Potential
 * Short, crisp click (1-5ms)
 * "Rain on tin roof" sound - very brief transient
 */
export function playFibrillation(volume = 0.25) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  // Use noise burst for authentic click sound
  const bufferSize = ctx.sampleRate * 0.005; // 5ms
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  // Generate brief noise burst with envelope
  for (let i = 0; i < bufferSize; i++) {
    const t = i / bufferSize;
    const envelope = t < 0.2 ? t / 0.2 : Math.exp(-(t - 0.2) * 10);
    data[i] = (Math.random() * 2 - 1) * envelope;
  }
  
  const source = ctx.createBufferSource();
  const gainNode = ctx.createGain();
  
  source.buffer = buffer;
  source.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  gainNode.gain.value = volume;
  
  source.start(now);
}

/**
 * Play Fasciculation Potential
 * Sounds like normal MUAP but irregular timing
 * "Popcorn popping" - intermittent pops
 */
export function playFasciculation(volume = 0.3) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Slightly lower frequency than normal MUAP
  osc.frequency.value = 80;
  osc.type = 'sine';
  
  // Envelope similar to MUAP but slightly longer
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.003);
  gainNode.gain.linearRampToValueAtTime(volume * 0.6, now + 0.012);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.020);
  
  osc.start(now);
  osc.stop(now + 0.020);
}

/**
 * Play Myotonic Discharge
 * Continuous tone with frequency sweep (high to low)
 * "Dive bomber" sound - characteristic of myotonia
 * Duration: 400-600ms
 */
export function playMyotonicDischarge(volume = 0.2, duration = 0.5) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Frequency sweep: 1500Hz → 200Hz (dive bomber effect)
  osc.frequency.setValueAtTime(1500, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + duration);
  
  // Use sawtooth for more "buzzy" motor-like sound
  osc.type = 'sawtooth';
  
  // Waxing-waning amplitude envelope
  const waxDuration = duration * 0.3;
  const sustainDuration = duration * 0.4;
  const waneDuration = duration * 0.3;
  
  gainNode.gain.setValueAtTime(0, now);
  // Waxing
  gainNode.gain.linearRampToValueAtTime(volume, now + waxDuration);
  // Sustain
  gainNode.gain.setValueAtTime(volume, now + waxDuration + sustainDuration);
  // Waning
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
  
  osc.start(now);
  osc.stop(now + duration);
}

/**
 * Play Complex Repetitive Discharge
 * Regular, rhythmic bursts - "machine gun"
 * Frequency: 20-50Hz typical
 */
export function playComplexRepetitiveDischarge(volume = 0.25) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  // Create burst of 3-5 rapid clicks
  const numSpikes = 3 + Math.floor(Math.random() * 3); // 3-5 spikes
  const spikeInterval = 0.015; // 15ms between spikes (66Hz within burst)
  
  for (let i = 0; i < numSpikes; i++) {
    const startTime = now + (i * spikeInterval);
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Square wave for "mechanical" sound
    osc.type = 'square';
    osc.frequency.value = 150 + (i * 20); // Slight frequency variation
    
    // Very brief envelope for each spike
    const spikeDuration = 0.010; // 10ms per spike
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + spikeDuration);
    
    osc.start(startTime);
    osc.stop(startTime + spikeDuration);
  }
}

/**
 * Play Positive Sharp Wave
 * Similar to fibrillation but slightly different acoustic quality
 */
export function playPositiveSharpWave(volume = 0.25) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Higher frequency transient
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.020);
  osc.type = 'triangle';
  
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.002);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.020);
  
  osc.start(now);
  osc.stop(now + 0.020);
}

/**
 * Play continuous EMG pattern
 * @param {string} patternType - Type of EMG pattern
 * @param {number} duration - Duration in seconds
 * @param {boolean} loop - Whether to loop the pattern
 * @returns {Object} Control object with stop() method
 */
export function playContinuousPattern(patternType, duration = 5, volume = 0.3) {
  let isPlaying = true;
  let timeoutIds = [];
  
  function playPattern() {
    if (!isPlaying) return;
    
    switch (patternType) {
      case 'normal':
        // Normal MUAPs at ~15Hz
        playNormalMUAP(volume);
        timeoutIds.push(setTimeout(playPattern, 50 + Math.random() * 100));
        break;
        
      case 'fibrillation':
        // Fibrillations at irregular 5-15Hz
        playFibrillation(volume);
        timeoutIds.push(setTimeout(playPattern, 70 + Math.random() * 130));
        break;
        
      case 'fasciculation':
        // Fasciculations every 0.5-3 seconds
        playFasciculation(volume);
        timeoutIds.push(setTimeout(playPattern, 500 + Math.random() * 2500));
        break;
        
      case 'myotonic':
        // Play one complete dive bomber
        playMyotonicDischarge(volume, 0.5);
        timeoutIds.push(setTimeout(playPattern, 600));
        break;
        
      case 'crd':
        // CRD bursts at 40Hz (25ms intervals)
        playComplexRepetitiveDischarge(volume);
        timeoutIds.push(setTimeout(playPattern, 300)); // Burst every 300ms
        break;
    }
  }
  
  playPattern();
  
  // Auto-stop after duration
  if (duration > 0) {
    timeoutIds.push(setTimeout(() => {
      isPlaying = false;
      timeoutIds.forEach(id => clearTimeout(id));
    }, duration * 1000));
  }
  
  return {
    stop: () => {
      isPlaying = false;
      timeoutIds.forEach(id => clearTimeout(id));
    },
  };
}

/**
 * Get audio characteristics for UI display
 */
export function getAudioCharacteristics(patternType) {
  const characteristics = {
    normal: {
      soundDescription: 'Clean pops - voluntary muscle activation',
      frequency: '50-150Hz dominant',
      timing: 'Regular when voluntarily recruited',
      clinicalNote: 'Normal motor unit firing',
    },
    fibrillation: {
      soundDescription: 'Rain on tin roof - short, crisp, irregular clicks',
      frequency: 'Brief transients (1-5ms)',
      timing: 'Irregular 2-20Hz',
      clinicalNote: 'Active denervation marker',
    },
    fasciculation: {
      soundDescription: 'Popcorn popping - intermittent random pops',
      frequency: 'Similar to normal MUAP',
      timing: 'Random, 0.1-5 seconds apart',
      clinicalNote: 'Can be benign or pathologic',
    },
    myotonic: {
      soundDescription: 'Dive bomber airplane - high to low frequency sweep',
      frequency: '1500Hz → 200Hz sweep',
      timing: 'Continuous 0.5-1 second duration',
      clinicalNote: 'Pathognomonic for myotonia',
    },
    crd: {
      soundDescription: 'Machine gun / jackhammer - very regular mechanical rhythm',
      frequency: '150-300Hz with harmonics',
      timing: 'Regular bursts at 20-50Hz',
      clinicalNote: 'Chronic denervation/reinnervation',
    },
  };
  
  return characteristics[patternType] || characteristics.normal;
}

export default {
  playNormalMUAP,
  playFibrillation,
  playFasciculation,
  playMyotonicDischarge,
  playComplexRepetitiveDischarge,
  playPositiveSharpWave,
  playContinuousPattern,
  getAudioCharacteristics,
};
