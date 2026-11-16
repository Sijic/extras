// Procedural Web Audio API Engine for "NOT EXTRA" / «НЕ ЛИШНИЕ»
// Strictly OFF by default. Activated only when user toggles SOUND ON in header.
// Act I (0-35%): Low visceral breathing & room rumble
// Act II (35-72%): Rhythmic camp metronome & heartbeat
// Act III (72-100%): 188 BPM SOS heart-rate monitor alert pulse

export class ProceduralSoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled = false;
  private timerId: number | null = null;
  private scrollProgress = 0;

  public toggle(enable: boolean): boolean {
    if (enable) {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isEnabled = true;
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

  private startLoop() {
    if (!this.isEnabled || !this.ctx) return;

    const p = this.scrollProgress;
    // Dynamic BPM from 64 BPM (Act I) to 188 BPM (Climax)
    const bpm = Math.round(64 + p * 124);
    const intervalMs = Math.max(310, Math.round((60 / bpm) * 1000));

    if (p < 0.35) {
      // Act I: Soft heavy breath / low thud
      this.playBreathAndHeartbeat(52, 0.045);
    } else if (p < 0.72) {
      // Act II: Camp metronome + heartbeat
      this.playMetronomeTick(440, 0.03);
    } else {
      // Act III: SOS Heart-Rate Monitor beep (188 BPM alert)
      this.playSosBeep(1760, 0.035);
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
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.28);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.34);
  }

  private playMetronomeTick(freq: number, gainVal: number) {
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

  private playSosBeep(freq: number, gainVal: number) {
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
