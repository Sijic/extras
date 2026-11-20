import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Mail,
  Lock,
} from 'lucide-react';
import { PROMO_VIDEO_CONFIG, CONTACT_CONFIG } from '../config/siteConfig';
import { soundEngine } from '../utils/soundEngine';

export type UILang = 'en' | 'zh' | 'ru' | 'kk';

interface PromoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: UILang;
}

const MODAL_TEXT: Record<
  UILang,
  {
    headerTitle: string;
    disclaimerLine: string;
    contactDesk: string;
    pinTitle: string;
    pinSub: string;
    pinError: string;
    pinUnlock: string;
    playLabel: string;
    pauseLabel: string;
  }
> = {
  en: {
    headerTitle: '3-MINUTE OFFICIAL PROMO REEL · SUBTITLED',
    disclaimerLine:
      'Rough Cut assembly with temporary reference music & pre-DI color. Final 4K DCP & Dolby Atmos delivery: Spring 2027.',
    contactDesk: 'Producer Desk',
    pinTitle: 'Screener Access PIN',
    pinSub: 'Enter the 4-digit buyer PIN code to unlock playback.',
    pinError: 'Incorrect PIN code. Please try again.',
    pinUnlock: 'Unlock Screener',
    playLabel: 'Play Promo',
    pauseLabel: 'Pause',
  },
  zh: {
    headerTitle: '3分钟官方中文字幕推介片 · 直连播放',
    disclaimerLine:
      '当前为早期粗剪样片（含临时参考配乐与预调色）。最终4K DCP母带与杜比全景声将于2027年春季交付。',
    contactDesk: '制片人直联邮箱',
    pinTitle: '内部审片访问密码',
    pinSub: '请输入4位买方授权密码以解锁播放。',
    pinError: '密码错误，请重新输入。',
    pinUnlock: '解锁播放',
    playLabel: '播放推介片',
    pauseLabel: '暂停',
  },
  ru: {
    headerTitle: '3-МИНУТНЫЙ ПРОМО-РОЛИК · ПРЯМОЙ ПОТОК',
    disclaimerLine:
      'Черновой монтаж (Rough Cut) с референс-музыкой до финальной цветокоррекции DI. Финальный 4K DCP — весна 2027.',
    contactDesk: 'Почта продюсера',
    pinTitle: 'Доступ по ПИН-коду',
    pinSub: 'Введите 4-значный код для просмотра закрытого скринера.',
    pinError: 'Неверный ПИН-код. Попробуйте снова.',
    pinUnlock: 'Открыть доступ',
    playLabel: 'Смотреть ролик',
    pauseLabel: 'Пауза',
  },
  kk: {
    headerTitle: '3 МИНУТТЫҚ РЕСМИ ПРОМО-РОЛИК · ТІКЕЛЕЙ АҒЫН',
    disclaimerLine:
      'Алдын ала монтаждалған нұсқа (Rough Cut, референс-музыка және DI түс коррекциясына дейін). Финалдық 4K DCP — 2027 жылдың көктемі.',
    contactDesk: 'Продюсер поштасы',
    pinTitle: 'ПИН-код арқылы кіру',
    pinSub: 'Жабық көрсетілімді ашу үшін 4 таңбалы кодты енгізіңіз.',
    pinError: 'ПИН-код қате. Қайта енгізіңіз.',
    pinUnlock: 'Ашу',
    playLabel: 'Роликті қосу',
    pauseLabel: 'Кідірту',
  },
};

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const PromoPlayerModal: React.FC<PromoPlayerModalProps> = ({ isOpen, onClose, lang }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [pinUnlocked, setPinUnlocked] = useState<boolean>(!PROMO_VIDEO_CONFIG.requirePin);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(179.6);
  const [bufferedPct, setBufferedPct] = useState<number>(0);

  const copy = MODAL_TEXT[lang];

  useEffect(() => {
    if (!isOpen) {
      soundEngine.setVideoPlaying(false);
      setIsPlaying(false);
      return;
    }

    soundEngine.setVideoPlaying(true);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' && pinUnlocked && videoRef.current) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', onKey);

    if (pinUnlocked && videoRef.current) {
      const vid = videoRef.current;
      vid.currentTime = 0;
      vid
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    return () => {
      window.removeEventListener('keydown', onKey);
      soundEngine.setVideoPlaying(false);
    };
  }, [isOpen, pinUnlocked]);

  if (!isOpen) return null;

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vid = videoRef.current;
    if (!vid) return;
    const t = Number(e.target.value);
    vid.currentTime = t;
    setCurrentTime(t);
  };

  const handleFullscreen = () => {
    const el = containerRef.current || videoRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === PROMO_VIDEO_CONFIG.pinCode) {
      setPinUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      data-testid="promo-player-modal"
      className="fixed inset-0 z-50 bg-[#03060C]/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-w-5xl w-full bg-[#0A1322] border border-[#38BDF8]/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Cinema Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#060B14] border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#E61E2A] animate-pulse flex-shrink-0" />
            <span className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#F8FAFC] truncate">
              {copy.headerTitle}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="close-promo-modal-btn"
            aria-label="Close"
            className="p-1.5 rounded-full bg-[#111F36] text-[#94A3B8] hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Optional PIN Gate OR Direct HTML5 Video Player */}
        {!pinUnlocked ? (
          <form onSubmit={handlePinSubmit} className="p-8 sm:p-12 text-center space-y-5 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#111F36] border border-[#38BDF8]/25 flex items-center justify-center mx-auto text-[#E61E2A]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-unbounded font-bold text-lg text-[#F8FAFC]">{copy.pinTitle}</h3>
            <p className="text-xs text-[#94A3B8]">{copy.pinSub}</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="• • • •"
              className="w-40 text-center font-mono text-2xl tracking-[0.4em] px-4 py-2.5 rounded-xl bg-[#060B14] border border-[#38BDF8]/30 text-[#F8FAFC] focus:outline-none focus:border-[#E61E2A]"
            />
            {pinError && <div className="text-xs text-[#E61E2A]">{copy.pinError}</div>}
            <div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#E61E2A] hover:bg-white text-white hover:text-[#060B14] font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors"
              >
                {copy.pinUnlock}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-3 sm:p-5 space-y-3">
            {/* Custom HTML5 Video Stage */}
            <div
              ref={containerRef}
              className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-white/10 group"
            >
              <video
                ref={videoRef}
                data-testid="promo-html5-video"
                src={PROMO_VIDEO_CONFIG.src}
                poster={PROMO_VIDEO_CONFIG.poster}
                playsInline
                preload="metadata"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={(e) => {
                  const vid = e.currentTarget;
                  if (vid.duration && Number.isFinite(vid.duration)) {
                    setDuration(vid.duration);
                  }
                }}
                onTimeUpdate={(e) => {
                  const vid = e.currentTarget;
                  setCurrentTime(vid.currentTime);
                  if (vid.buffered.length > 0 && vid.duration > 0) {
                    const end = vid.buffered.end(vid.buffered.length - 1);
                    setBufferedPct(Math.min(100, (end / vid.duration) * 100));
                  }
                }}
                className="w-full h-full object-contain cursor-pointer bg-black"
              />

              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={copy.playLabel}
                  className="absolute inset-0 flex items-center justify-center bg-[#060B14]/35 hover:bg-[#060B14]/20 transition-colors"
                >
                  <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E61E2A] hover:bg-white text-white hover:text-[#060B14] flex items-center justify-center shadow-2xl transition-all">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  </span>
                </button>
              )}

              {/* Custom Control Bar */}
              <div className="absolute bottom-0 left-0 right-0 px-3 sm:px-4 pt-6 pb-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                <div className="relative h-2 flex items-center mb-2.5">
                  <div className="absolute inset-x-0 h-1 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full bg-[#38BDF8]/45 transition-all"
                      style={{ width: `${bufferedPct}%` }}
                    />
                  </div>
                  <div
                    className="absolute left-0 h-1 rounded-full bg-[#E61E2A] pointer-events-none"
                    style={{ width: `${progressPct}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={duration || 180}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    aria-label="Seek video"
                    className="relative z-10 w-full h-3 opacity-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? copy.pauseLabel : copy.playLabel}
                      className="text-white hover:text-[#E61E2A] transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label="Mute"
                      className="text-[#94A3B8] hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="font-mono text-[10px] sm:text-xs text-[#CBD5E1] tabular-nums">
                      {formatTime(currentTime)} <span className="text-[#64748B]">/ {formatTime(duration)}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleFullscreen}
                    aria-label="Fullscreen"
                    className="text-[#94A3B8] hover:text-white transition-colors"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Single Clean Small Disclaimer Line + Direct Email Link Underneath */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <p className="text-[11px] text-[#94A3B8] leading-snug">{copy.disclaimerLine}</p>
              <a
                href={`mailto:${CONTACT_CONFIG.email}`}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#38BDF8] hover:text-white transition-colors whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5 text-[#E61E2A]" />
                <span>
                  {copy.contactDesk}: {CONTACT_CONFIG.email}
                </span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
