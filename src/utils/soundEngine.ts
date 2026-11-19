// Hybrid Cinema ASMR Sound Engine for "NOT EXTRA" / «НЕ ЛИШНИЕ»
// Powered by real CC0-1.0 SFX samples sourced via Patch.gg (45.3 KB total, universal MP3)
// layered with procedural Web Audio sub-bass breath & heartbeat.
// Strictly OFF by default. Activated only when user toggles SOUND ON in header.

type SfxKey =
  | 'footstep_concrete'
  | 'footstep_stride'
  | 'shoelace_cloth'
  | 'shoelace_tighten'
  | 'brass_scale_clink'
  | 'brass_scale_bell'
  | 'sos_beep'
  | 'ui_tick';

const SFX_FILES: Record<SfxKey, string> = {
  footstep_concrete: './sfx/footstep_concrete.mp3',
  footstep_stride: './sfx/footstep_stride.mp3',
  shoelace_cloth: './sfx/shoelace_cloth.mp3',
  shoelace_tighten: './sfx/shoelace_tighten.mp3',
  brass_scale_clink: './sfx/brass_scale_clink.mp3',
  brass_scale_bell: './sfx/brass_scale_bell.mp3',
  sos_beep: './sfx/sos_beep.mp3',
  ui_tick: './sfx/ui_tick.mp3',
};

export class ProceduralSoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled = false;
  private timerId: number | null = null;
  private scrollProgress = 0;
  private stepToggle = false;
  private buffers: Partial<Record<SfxKey, AudioBuffer>> = {};
  private loadingStarted = false;
  private lastShoelaceAt = 0;
  private lastScaleAt = 0;

  public toggle(enable: boolean): boolean {
    if (enable) {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.isEnabled = true;
      this.preloadSamples();
      this.playUiTick();
      this.startLoop();
    } else {
      this.isEnabled = false;
      if (this.timerId !== null) {
        window.clearTimeout(this.timerId);
        this.timerId = null;
      }
    }
    return this.isEnabled;
  }

  public setScrollProgress(progress: number) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
  }

  private preloadSamples() {
    if (this.loadingStarted || !this.ctx) return;
    this.loadingStarted = true;
    const ctx = this.ctx;

    (Object.keys(SFX_FILES) as SfxKey[]).forEach((key) => {
      fetch(SFX_FILES[key])
        .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(new Error('HTTP ' + res.status))))
        .then((arr) => ctx.decodeAudioData(arr))
        .then((decoded) => {
          this.buffers[key] = decoded;
        })
        .catch(() => {
          // Graceful fallback to procedural oscillator if offline
        });
    });
  }

  private playBuffer(key: SfxKey, gainVal: number, playbackRate = 1.0): boolean {
    if (!this.isEnabled || !this.ctx) return false;
    const buf = this.buffers[key];
    if (!buf) return false;

    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.setValueAtTime(playbackRate, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, now);

    src.connect(gain);
    gain.connect(this.ctx.destination);
    src.start(now);
    return true;
  }

  // Tactile SFX hooks for interactive film scenes
  public playUiTick() {
    if (!this.isEnabled || !this.ctx) return;
    if (!this.playBuffer('ui_tick', 0.16, 1.05)) {
      this.playMetronomeFallback(680, 0.02);
    }
  }

  public playShoelacePull(progress: number) {
    if (!this.isEnabled || !this.ctx) return;
    const nowMs = Date.now();
    if (nowMs - this.lastShoelaceAt < 180) return;
    this.lastShoelaceAt = nowMs;

    const key: SfxKey = progress > 0.72 ? 'shoelace_tighten' : 'shoelace_cloth';
    this.playBuffer(key, 0.22, 0.92 + progress * 0.25);
  }

  public playScaleTilt(side: 'left' | 'right') {
    if (!this.isEnabled || !this.ctx) return;
    const nowMs = Date.now();
    if (nowMs - this.lastScaleAt < 240) return;
    this.lastScaleAt = nowMs;

    if (side === 'left') {
      this.playBuffer('brass_scale_clink', 0.2, 0.78);
    } else {
      this.playBuffer('brass_scale_bell', 0.16, 1.18);
    }
  }

  private startLoop() {
    if (!this.isEnabled || !this.ctx) return;

    const p = this.scrollProgress;
    // Dynamic BPM from 64 BPM (Act I) to 188 BPM (Climax)
    const bpm = Math.round(64 + p * 124);
    const intervalMs = Math.max(315, Math.round((60 / bpm) * 1000));
    this.stepToggle = !this.stepToggle;

    if (p < 0.35) {
      // Act I: Heavy 207 kg heartbeat + slow low-pitched concrete step
      this.playBreathAndHeartbeat(50, 0.05);
      if (this.stepToggle) {
        this.playBuffer('footstep_concrete', 0.18, 0.72);
      }
    } else if (p < 0.72) {
      // Act II: Rhythmic running footsteps on tartan/concrete track
      const stepKey: SfxKey = this.stepToggle ? 'footstep_concrete' : 'footstep_stride';
      const played = this.playBuffer(stepKey, 0.22, this.stepToggle ? 0.96 : 1.06);
      this.playBreathAndHeartbeat(58, 0.032);
      if (!played) {
        this.playMetronomeFallback(420, 0.025);
      }
    } else {
      // Act III: 188 BPM SOS Heart-Rate Monitor alert + urgent sprint strides
      const stepKey: SfxKey = this.stepToggle ? 'footstep_stride' : 'footstep_concrete';
      this.playBuffer(stepKey, 0.16, 1.14);
      if (this.stepToggle) {
        if (!this.playBuffer('sos_beep', 0.1, 1.42)) {
          this.playSosFallback(1760, 0.03);
        }
      } else {
        this.playBreathAndHeartbeat(68, 0.04);
      }
    }

    this.timerId = window.setTimeout(() => this.startLoop(), intervalMs);
  }

  private playBreathAndHeartbeat(freq: number, gainVal: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(26, now + 0.26);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.045);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  private playMetronomeFallback(freq: number, gainVal: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  private playSosFallback(freq: number, gainVal: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }
}

export const soundEngine = new ProceduralSoundEngine();
