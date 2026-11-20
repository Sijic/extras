// Cinema Foley & ASMR Audio Engine for "NOT EXTRA" / «НЕ ЛИШНИЕ»
// Powered by real short (<12 KB) film Foley MP3 stems from F:\SFX_Library
// Unlocks gently on first user interaction; always mutable via top/corner Mute toggle;
// automatically mutes during HTML5 Promo Video playback.

type SfxKey =
  | 'scale_spring'
  | 'steam_hiss'
  | 'lace_snap'
  | 'xray_heart'
  | 'sos_watch'
  | 'ui_tick';

const SFX_FILES: Record<SfxKey, string> = {
  scale_spring: './sfx/film_scale_spring.mp3',
  steam_hiss: './sfx/film_steam_hiss.mp3',
  lace_snap: './sfx/film_lace_snap.mp3',
  xray_heart: './sfx/film_xray_heart.mp3',
  sos_watch: './sfx/film_sos_watch.mp3',
  ui_tick: './sfx/ui_tick.mp3',
};

export class CinemaFoleyEngine {
  private ctx: AudioContext | null = null;
  private isEnabled = false;
  private userMuted = false;
  private videoPlaying = false;
  private buffers: Partial<Record<SfxKey, AudioBuffer>> = {};
  private loadingStarted = false;
  private listeners = new Set<(enabled: boolean) => void>();

  private lastLaceAt = 0;
  private lastXrayAt = 0;
  private lastSteamAt = 0;
  private lastSosAt = 0;

  public subscribe(fn: (enabled: boolean) => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    const active = this.isEnabled && !this.userMuted && !this.videoPlaying;
    this.listeners.forEach((fn) => fn(active));
  }

  public isActive(): boolean {
    return this.isEnabled && !this.userMuted && !this.videoPlaying;
  }

  // Called once on first user tap/pointerdown anywhere on the page (if user hasn't explicitly muted)
  public unlockOnFirstGesture() {
    if (this.userMuted || this.isEnabled) return;
    this.ensureContext();
    this.isEnabled = true;
    this.preloadSamples();
    this.notify();
  }

  public toggle(enable: boolean): boolean {
    if (enable) {
      this.userMuted = false;
      this.ensureContext();
      this.isEnabled = true;
      this.preloadSamples();
      this.notify();
      this.playUiTick();
    } else {
      this.userMuted = true;
      this.isEnabled = false;
      this.notify();
    }
    return this.isActive();
  }

  public setVideoPlaying(playing: boolean) {
    this.videoPlaying = playing;
    this.notify();
  }

  public setScrollProgress(_progress: number) {
    // Kept for smooth compatibility; subtle SOS watch pulse can trigger near climax if user clicks HUD
  }

  private ensureContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
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
        .catch(() => {});
    });
  }

  private playBuffer(key: SfxKey, gainVal: number, playbackRate = 1.0): boolean {
    if (!this.isActive() || !this.ctx) return false;
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

  public playUiTick() {
    if (!this.isActive() || !this.ctx) return;
    if (!this.playBuffer('ui_tick', 0.14, 1.05)) {
      this.playToneFallback(720, 0.015, 0.04);
    }
  }

  // Metallic scale spring release when samsa is swiped/tapped off
  public playScaleSpring() {
    if (!this.isActive() || !this.ctx) return;
    if (!this.playBuffer('scale_spring', 0.28, 1.15)) {
      this.playToneFallback(190, 0.04, 0.18);
    }
  }

  // Soft steam hiss when hovering/touching the hot samsa
  public playSteamHiss() {
    if (!this.isActive() || !this.ctx) return;
    const now = Date.now();
    if (now - this.lastSteamAt < 1100) return;
    this.lastSteamAt = now;
    this.playBuffer('steam_hiss', 0.14, 1.05);
  }

  // Realistic shoelace rustle / pull when dragging Verlet laces
  public playShoelacePull(intensity = 0.5) {
    if (!this.isActive() || !this.ctx) return;
    const now = Date.now();
    if (now - this.lastLaceAt < 220) return;
    this.lastLaceAt = now;
    this.playBuffer('lace_snap', 0.18, 0.88 + Math.min(0.35, intensity * 0.35));
  }

  // Deep muffled heartbeat while scanning with the X-Ray finger/cursor
  public playXrayHeartbeat() {
    if (!this.isActive() || !this.ctx) return;
    const now = Date.now();
    if (now - this.lastXrayAt < 640) return;
    this.lastXrayAt = now;
    if (!this.playBuffer('xray_heart', 0.22, 0.92)) {
      this.playSubThudFallback(54, 0.045);
    }
  }

  // Subtle SOS watch alert beep
  public playSosPulse() {
    if (!this.isActive() || !this.ctx) return;
    const now = Date.now();
    if (now - this.lastSosAt < 450) return;
    this.lastSosAt = now;
    this.playBuffer('sos_watch', 0.12, 1.0);
  }

  private playToneFallback(freq: number, gainVal: number, dur: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.01);
  }

  private playSubThudFallback(freq: number, gainVal: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.24);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

export const soundEngine = new CinemaFoleyEngine();
