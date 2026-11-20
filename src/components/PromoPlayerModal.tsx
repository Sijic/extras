import React, { useState, useRef, useEffect } from 'react';
import { X, Mail, Lock } from 'lucide-react';
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
  }
> = {
  en: {
    headerTitle: '3-MINUTE OFFICIAL PROMO REEL · SUBTITLED',
    disclaimerLine:
      'Rough Cut assembly with temporary reference music & pre-DI color. Final 4K DCP delivery: Spring 2027.',
    contactDesk: 'Producer Desk',
    pinTitle: 'Screener Access PIN',
    pinSub: 'Enter the 4-digit buyer PIN code to unlock playback.',
    pinError: 'Incorrect PIN code. Please try again.',
    pinUnlock: 'Unlock Screener',
  },
  zh: {
    headerTitle: '3分钟官方中文字幕推介片 · 直连播放',
    disclaimerLine:
      '当前为早期粗剪样片（含临时参考配乐与预调色）。最终4K DCP母带将于2027年春季交付。',
    contactDesk: '制片人直联邮箱',
    pinTitle: '内部审片访问密码',
    pinSub: '请输入4位买方授权密码以解锁播放。',
    pinError: '密码错误，请重新输入。',
    pinUnlock: '解锁播放',
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
  },
  kk: {
    headerTitle: '3 МИНУТТЫҚ РЕСМИ ПРОМО-РОЛИК · ТІКЕЛЕЙ АҒЫН',
    disclaimerLine:
      'Алдын ала монтаждалған нұсқа (Rough Cut, референс-музыка және DI түс коррекциясына дейін). Финалдық 4K DCP — 2027 көктем.',
    contactDesk: 'Продюсер поштасы',
    pinTitle: 'ПИН-код арқылы кіру',
    pinSub: 'Жабық көрсетілімді ашу үшін 4 таңбалы кодты енгізіңіз.',
    pinError: 'ПИН-код қате. Қайта енгізіңіз.',
    pinUnlock: 'Ашу',
  },
};

export const PromoPlayerModal: React.FC<PromoPlayerModalProps> = ({ isOpen, onClose, lang }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [pinUnlocked, setPinUnlocked] = useState<boolean>(!PROMO_VIDEO_CONFIG.requirePin);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  const copy = MODAL_TEXT[lang];

  useEffect(() => {
    if (!isOpen) {
      soundEngine.setVideoPlaying(false);
      return;
    }

    soundEngine.setVideoPlaying(true);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    if (pinUnlocked && videoRef.current) {
      const vid = videoRef.current;
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }

    return () => {
      window.removeEventListener('keydown', onKey);
      soundEngine.setVideoPlaying(false);
    };
  }, [isOpen, pinUnlocked, onClose]);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === PROMO_VIDEO_CONFIG.pinCode) {
      setPinUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <div
      data-testid="promo-player-modal"
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-w-5xl w-full bg-[#0A1322] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 sm:px-6 py-3.5 bg-[#060B14] border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#E61E2A] flex-shrink-0" />
            <span className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-white truncate">
              {copy.headerTitle}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="close-promo-modal-btn"
            aria-label="Close"
            className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!pinUnlocked ? (
          <form onSubmit={handlePinSubmit} className="p-8 sm:p-12 text-center space-y-5 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/15 flex items-center justify-center mx-auto text-[#E61E2A]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-unbounded font-bold text-lg text-white">{copy.pinTitle}</h3>
            <p className="text-xs text-slate-400">{copy.pinSub}</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="• • • •"
              className="w-40 text-center font-mono text-2xl tracking-[0.4em] px-4 py-2.5 rounded-xl bg-[#060B14] border border-white/20 text-white focus:outline-none focus:border-[#E61E2A]"
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
            {/* Native GPU-Composited HTML5 Video Player — ZERO React re-renders during playback! */}
            <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-white/10">
              <video
                ref={videoRef}
                data-testid="promo-html5-video"
                src={PROMO_VIDEO_CONFIG.src}
                poster={PROMO_VIDEO_CONFIG.poster}
                controls
                autoPlay
                playsInline
                preload="auto"
                controlsList="nodownload"
                className="w-full h-full object-contain bg-black"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <p className="text-[11px] text-slate-400 leading-snug">{copy.disclaimerLine}</p>
              <a
                href={`mailto:${CONTACT_CONFIG.email}`}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-sky-400 hover:text-white transition-colors whitespace-nowrap"
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
