/**
 * Joyful Procedural Audio Synthesizer (Kids Edition)
 * Warm, playful cartoon sound effects & melodic background music
 */
class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.musicEnabled = true;
    this.sfxVolume = 0.65;
    this.musicVolume = 0.35;
    
    this.engineOsc1 = null;
    this.engineOsc2 = null;
    this.engineGain = null;
    this.engineFilter = null;
    this.engineRunning = false;
    
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.currentMusicStyle = 'happy';
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    this.ctx = new AudioCtxClass();
    
    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // SFX Bus
    this.sfxBus = this.ctx.createGain();
    this.sfxBus.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    this.sfxBus.connect(this.masterGain);

    // Music Bus
    this.musicBus = this.ctx.createGain();
    this.musicBus.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    this.musicBus.connect(this.masterGain);

    this.initEngineSound();
  }

  // --- Cute Cartoon Kart Engine Sound (Warm & Pleasant) ---
  initEngineSound() {
    if (!this.ctx || this.engineOsc1) return;
    try {
      this.engineOsc1 = this.ctx.createOscillator();
      this.engineOsc1.type = 'triangle'; // Warm, soft wave
      this.engineOsc1.frequency.setValueAtTime(65, this.ctx.currentTime);

      this.engineOsc2 = this.ctx.createOscillator();
      this.engineOsc2.type = 'sine'; // Sub harmonic
      this.engineOsc2.frequency.setValueAtTime(130, this.ctx.currentTime);

      this.engineFilter = this.ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
      this.engineFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      this.engineOsc1.connect(this.engineFilter);
      this.engineOsc2.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.sfxBus);

      this.engineOsc1.start();
      this.engineOsc2.start();
      this.engineRunning = true;
    } catch (e) {
      console.warn("Engine sound init failed", e);
    }
  }

  updateEngineSound(speedNormalized, isBoosting, isBraking) {
    if (!this.ctx || !this.engineRunning || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      // Gentle purr frequency that rises smoothly with speed
      const baseF = 60 + speedNormalized * 90 + (isBoosting ? 40 : 0) - (isBraking ? 15 : 0);
      const targetGain = Math.min(0.16, 0.04 + speedNormalized * 0.1);

      this.engineOsc1.frequency.setTargetAtTime(Math.max(45, baseF), now, 0.08);
      this.engineOsc2.frequency.setTargetAtTime(Math.max(90, baseF * 2), now, 0.08);
      this.engineFilter.frequency.setTargetAtTime(250 + speedNormalized * 350, now, 0.08);
      this.engineGain.gain.setTargetAtTime(targetGain, now, 0.08);
    } catch (e) {}
  }

  stopEngine() {
    if (this.engineGain && this.ctx) {
      this.engineGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    }
  }

  // --- Sparkling Music Box Coin Sound ---
  playCoinSound(combo = 1) {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      // Bright pentatonic bell notes
      const scales = [
        [1046.50, 1318.51, 1567.98], // C6, E6, G6
        [1174.66, 1396.91, 1760.00], // D6, F6, A6
        [1318.51, 1567.98, 2093.00]  // E6, G6, C7
      ];
      const chord = scales[(combo - 1) % scales.length];

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.035);

        gain.gain.setValueAtTime(0.18, now + idx * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.22);

        osc.connect(gain);
        gain.connect(this.sfxBus);
        osc.start(now + idx * 0.035);
        osc.stop(now + idx * 0.035 + 0.22);
      });
    } catch (e) {}
  }

  // --- Ascending Rocket Boost Whoosh ---
  playNitroSound() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.45);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  // --- Power-up Ta-da Chime ---
  playPowerupSound() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - High C
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.2, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxBus);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    } catch (e) {}
  }

  // --- Cartoon "Boing" Bump Sound (Gentle & Funny) ---
  playHitSound() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      // Cartoon spring pitch drop & wobble
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // --- Cute Soapy Bubble Shield Pop ---
  playShieldBreakSound() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // --- Cute Near Miss "Ding!" ---
  playNearMissSound() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.51, now); // E6
      osc.frequency.setValueAtTime(1567.98, now + 0.08); // G6

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // --- Cheerful Melodic Kids BGM (Catchy, Joyful & Soft) ---
  startBGM(style = 'happy') {
    this.currentMusicStyle = style;
    this.stopBGM();
    if (!this.musicEnabled || this.isMuted || !this.ctx) return;

    // Upbeat joyful melodies
    const tunes = {
      happy: {
        melody: [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33, 523.25],
        bass: [261.63, 261.63, 329.63, 329.63, 392.00, 392.00, 349.23, 349.23],
        tempoMs: 150
      },
      synthwave: {
        melody: [659.25, 783.99, 987.77, 880.00, 783.99, 659.25, 587.33, 659.25],
        bass: [220.00, 220.00, 261.63, 261.63, 293.66, 293.66, 329.63, 329.63],
        tempoMs: 160
      },
      cyber: {
        melody: [587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33, 440.00],
        bass: [146.83, 146.83, 174.61, 174.61, 196.00, 196.00, 220.00, 220.00],
        tempoMs: 145
      },
      desert: {
        melody: [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 392.00],
        bass: [196.00, 196.00, 220.00, 220.00, 261.63, 261.63, 196.00, 196.00],
        tempoMs: 155
      }
    };

    const tune = tunes[style] || tunes.happy;
    this.bgmStep = 0;

    this.bgmTimer = setInterval(() => {
      if (!this.musicEnabled || this.isMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const mFreq = tune.melody[this.bgmStep % tune.melody.length];
        const bFreq = tune.bass[this.bgmStep % tune.bass.length];

        // Soft Marimba / Bell Tone for Melody
        const mOsc = this.ctx.createOscillator();
        const mGain = this.ctx.createGain();
        mOsc.type = 'sine';
        mOsc.frequency.setValueAtTime(mFreq, now);

        mGain.gain.setValueAtTime(0.09, now);
        mGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        mOsc.connect(mGain);
        mGain.connect(this.musicBus);
        mOsc.start(now);
        mOsc.stop(now + 0.2);

        // Bouncy Warm Bass
        if (this.bgmStep % 2 === 0) {
          const bOsc = this.ctx.createOscillator();
          const bGain = this.ctx.createGain();
          bOsc.type = 'triangle';
          bOsc.frequency.setValueAtTime(bFreq, now);

          bGain.gain.setValueAtTime(0.08, now);
          bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

          bOsc.connect(bGain);
          bGain.connect(this.musicBus);
          bOsc.start(now);
          bOsc.stop(now + 0.26);
        }

        this.bgmStep++;
      } catch (e) {}
    }, tune.tempoMs);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
    }
    if (this.isMuted) {
      this.stopBGM();
      this.stopEngine();
    } else {
      this.startBGM(this.currentMusicStyle);
    }
    return this.isMuted;
  }
}
