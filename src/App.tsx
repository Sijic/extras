import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import {
  Volume2,
  VolumeX,
  Play,
  Globe,
  Scale,
  Footprints,
  Sparkles,
  FileDown,
  Copy,
  Check,
  Mail,
  Phone,
  Instagram,
  ChevronDown,
  ChevronUp,
  X,
  ShieldCheck,
  Disc,
  Film,
  Eye,
  Award,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import {
  Lang,
  I18N,
  CAST_DATA,
  ENSEMBLE_CAST_DATA,
  KEY_CREW_DATA,
  FULL_CREDITS_DATA,
  HORIZONTAL_TRACK_STAGES,
  DIARY_XRAY_QUOTES,
} from './data/filmData';
import { soundEngine } from './utils/soundEngine';
import { IshimWaterCanvas } from './components/IshimWaterCanvas';
import { SosHudWidget } from './components/SosHudWidget';
import { CinemaLookbookSection } from './components/CinemaLookbookSection';

gsap.registerPlugin(ScrollTrigger);

const CINEMA_CHAPTERS = [
  { id: 'hero', num: '01', label: 'PROLOGUE' },
  { id: 'lace', num: '02', label: 'SHOELACE' },
  { id: 'scales', num: '03', label: 'SCALES' },
  { id: 'lookbook', num: '04', label: 'LOOKBOOK' },
  { id: 'track', num: '05', label: '42.2 KM' },
  { id: 'cast', num: '06', label: 'CAST' },
  { id: 'sales', num: '07', label: 'BUYERS' },
];

const LANG_BUTTONS: Array<{ code: Lang; label: string }> = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'kk', label: 'KK' },
  { code: 'zh', label: '中文' },
];

export default function App() {
  const [isChinaMarketUrl, setIsChinaMarketUrl] = useState<boolean>(false);
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('market') === 'cn' || params.get('lang') === 'zh') {
        return 'zh';
      }
      const saved = localStorage.getItem('not_extra_v2_lang') as Lang | null;
      if (saved === 'ru' || saved === 'en' || saved === 'kk' || saved === 'zh') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'ru';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [heroShatter, setHeroShatter] = useState<number>(0);
  const [laceProgress, setLaceProgress] = useState<number>(0);
  const [scaleTilt, setScaleTilt] = useState<number>(-14);
  const [xrayCoords, setXrayCoords] = useState<{ x: number; y: number }>({ x: 260, y: 140 });
  const [mobileXraySlider, setMobileXraySlider] = useState<number>(52);
  const [activeTrackIdx, setActiveTrackIdx] = useState<number>(0);
  const [showFullCredits, setShowFullCredits] = useState<boolean>(false);
  const [isScreeningModalOpen, setIsScreeningModalOpen] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [titleWeightVar, setTitleWeightVar] = useState<{ tracking: number; skew: number }>({
    tracking: 0,
    skew: 0,
  });

  const lenisRef = useRef<Lenis | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const laceSectionRef = useRef<HTMLElement | null>(null);
  const trackPinSectionRef = useRef<HTMLElement | null>(null);
  const diaryBoxRef = useRef<HTMLDivElement | null>(null);

  // Strict rule: hide Instagram & Western social links in ZH mode or ?market=cn
  const hideWesternSocials = lang === 'zh' || isChinaMarketUrl;
  const t = I18N[lang];
  const diaryData = DIARY_XRAY_QUOTES[0];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('market') === 'cn') {
      setIsChinaMarketUrl(true);
      setLang('zh');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('not_extra_v2_lang', lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang;
    if (lang === 'zh') {
      document.title = '《绝不多余》 / 《并非多余》 (NOT EXTRA) — 官方互动网站与大中华区发行专区 (2027春季)';
    } else if (lang === 'en') {
      document.title = 'NOT EXTRA — Official Interactive Film Experience (Spring 2027)';
    } else if (lang === 'kk') {
      document.title = 'АРТЫҚ ЕМЕС / НЕ ЛИШНИЕ — Фильмнің ресми интерактивті сайты (2027)';
    } else {
      document.title = 'НЕ ЛИШНИЕ / NOT EXTRA — Официальный интерактивный сайт фильма (Весна 2027)';
    }
  }, [lang]);

  // Lenis smooth scroll with dynamic weight physics + GSAP ScrollTrigger sync
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', (e: { progress: number; velocity: number }) => {
      ScrollTrigger.update();
      const prog = typeof e.progress === 'number' ? e.progress : 0;
      const vel = typeof e.velocity === 'number' ? e.velocity : 0;
      setScrollProgress(prog);
      soundEngine.setScrollProgress(prog);

      setTitleWeightVar({
        tracking: Math.max(-2, Math.min(7, Math.abs(vel) * 0.4)),
        skew: Math.max(-3, Math.min(3, vel * 0.1)),
      });

      const lenisInternal = lenis as unknown as { options?: { wheelMultiplier?: number; duration?: number } };
      if (lenisInternal.options) {
        if (prog < 0.25) {
          lenisInternal.options.wheelMultiplier = 0.62;
          lenisInternal.options.duration = 1.75;
        } else if (prog < 0.65) {
          lenisInternal.options.wheelMultiplier = 0.95;
          lenisInternal.options.duration = 1.25;
        } else {
          lenisInternal.options.wheelMultiplier = 1.2;
          lenisInternal.options.duration = 0.95;
        }
      }
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'auto' });
        }
      }, 150);
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // GSAP ScrollTriggers for Scene 1 (Hero Shatter), Scene 2 (Shoelace Knot), Scene 4 (42.2km Track)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroSectionRef.current) {
        ScrollTrigger.create({
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
          onUpdate: (self) => {
            setHeroShatter(self.progress);
          },
        });
      }

      if (laceSectionRef.current) {
        ScrollTrigger.create({
          trigger: laceSectionRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          scrub: 0.5,
          onUpdate: (self) => {
            setLaceProgress(self.progress);
          },
        });
      }

      if (trackPinSectionRef.current) {
        ScrollTrigger.create({
          trigger: trackPinSectionRef.current,
          start: 'top 65%',
          end: 'bottom 35%',
          scrub: 0.4,
          onUpdate: (self) => {
            const idx = Math.min(3, Math.floor(self.progress * 4));
            setActiveTrackIdx(idx);
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleToggleSound = () => {
    const nextState = soundEngine.toggle(!soundEnabled);
    setSoundEnabled(nextState);
  };

  const handleJumpToSection = (sectionId: string) => {
    soundEngine.playUiTick();
    const el = document.getElementById(sectionId);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -64 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDiaryMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!diaryBoxRef.current) return;
    const rect = diaryBoxRef.current.getBoundingClientRect();
    setXrayCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText('sergey@sijicbond.site').catch(() => {});
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const currentTrackStage = HORIZONTAL_TRACK_STAGES[activeTrackIdx];

  return (
    <div className="min-h-screen bg-[#0B0807] text-[#FBF3E8] overflow-x-hidden relative selection:bg-[#E85D04] selection:text-[#0B0807]">
      {/* Subtle 35mm Cinema Grain Overlay (0 FPS cost) */}
      <div className="fixed inset-0 cinema-grain pointer-events-none z-30 opacity-60" aria-hidden="true" />

      {/* Minimalist Darkroom Slate Top Navigation (ORYZO / Lusion × Linear) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0807]/82 backdrop-blur-xl border-b border-[#FFEDD7]/10">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
          {/* Minimalist Film Slate Monogram */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleJumpToSection('hero');
            }}
            className="flex items-center gap-3 group min-w-0"
          >
            <div className="w-8 h-8 rounded-full border border-[#FFEDD7]/25 group-hover:border-[#E85D04] flex items-center justify-center font-mono font-bold text-[10px] text-[#FFEDD7] group-hover:text-[#E85D04] transition-colors flex-shrink-0">
              42.2
            </div>
            <div className="truncate">
              <div className="font-unbounded font-bold text-xs sm:text-sm text-[#FBF3E8] tracking-[0.14em] uppercase truncate">
                {t.title}
              </div>
              <div className="font-mono text-[9px] text-[#8E847C] tracking-[0.22em] uppercase hidden md:block truncate">
                BIG MOVIE STUDIO · JANA MEN
              </div>
            </div>
          </a>

          {/* Quiet Uppercase Editorial Navigation */}
          <nav className="hidden xl:flex items-center gap-7 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#A69B91]">
            <button onClick={() => handleJumpToSection('hero')} className="hover:text-[#FBF3E8] transition-colors">
              {t.nav.hero}
            </button>
            <button onClick={() => handleJumpToSection('lace')} className="hover:text-[#FBF3E8] transition-colors">
              {t.nav.lace}
            </button>
            <button onClick={() => handleJumpToSection('scales')} className="hover:text-[#FBF3E8] transition-colors">
              {t.nav.scales}
            </button>
            <button onClick={() => handleJumpToSection('lookbook')} className="hover:text-[#FBF3E8] transition-colors">
              {lang === 'zh' ? '视觉剧照集' : lang === 'en' ? 'Lookbook' : 'Лукбук'}
            </button>
            <button onClick={() => handleJumpToSection('track')} className="hover:text-[#FBF3E8] transition-colors">
              {t.nav.track}
            </button>
            <button onClick={() => handleJumpToSection('cast')} className="hover:text-[#FBF3E8] transition-colors">
              {t.nav.cast}
            </button>
            <a
              href="#sales"
              onClick={() => handleJumpToSection('sales')}
              className="px-3.5 py-1.5 rounded-full border border-[#E85D04]/55 text-[#E85D04] hover:bg-[#E85D04] hover:text-[#0B0807] transition-all"
            >
              {t.nav.sales}
            </a>
          </nav>

          {/* Right Precision Controls: Procedural Web Audio + 4-Language Switcher */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleToggleSound}
              data-testid="sound-toggle-btn"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[10px] font-medium uppercase tracking-[0.14em] transition-all ${
                soundEnabled
                  ? 'bg-[#E85D04]/15 border-[#E85D04] text-[#E85D04]'
                  : 'bg-transparent border-[#FFEDD7]/15 text-[#9E948B] hover:text-[#FBF3E8] hover:border-[#FFEDD7]/35'
              }`}
              title="Procedural Web Audio API (Breath -> Metronome -> 188 BPM SOS)"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{soundEnabled ? t.soundOn : t.soundOff}</span>
            </button>

            <div
              className="flex items-center rounded-full border border-[#FFEDD7]/14 bg-[#130F0D]/90 p-0.5"
              role="group"
              aria-label="4-Language Switcher"
            >
              {LANG_BUTTONS.map((item) => {
                const active = lang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      soundEngine.playUiTick();
                      setLang(item.code);
                    }}
                    data-testid={`lang-btn-${item.code}`}
                    className={`px-2.5 py-1 rounded-full font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider transition-all ${
                      active
                        ? 'bg-[#FFEDD7] text-[#0B0807]'
                        : 'text-[#9E948B] hover:text-[#FBF3E8]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Precision Bottom-Centered SOS Telemetry Dock (Zero Overlap) */}
      <SosHudWidget
        scrollProgress={scrollProgress}
        lang={lang}
        onJumpToSection={handleJumpToSection}
      />

      {/* Awwwards / Watson Design Group Right-Edge Vertical Cinema Chapter Scrubber */}
      <aside
        aria-label="Cinema Chapter Scrubber"
        className="hidden 2xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3"
      >
        {CINEMA_CHAPTERS.map((ch, idx) => {
          const activeIdx = Math.min(
            CINEMA_CHAPTERS.length - 1,
            Math.floor(scrollProgress * CINEMA_CHAPTERS.length)
          );
          const isActive = idx === activeIdx;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => handleJumpToSection(ch.id)}
              className="group flex items-center gap-2.5 font-mono text-[9px] tracking-[0.18em] uppercase transition-all"
            >
              <span
                className={`transition-all ${
                  isActive
                    ? 'text-[#FFEDD7] opacity-100'
                    : 'text-[#7E746B] opacity-0 group-hover:opacity-100'
                }`}
              >
                {ch.num} · {ch.label}
              </span>
              <span
                className={`block h-[2px] transition-all ${
                  isActive
                    ? 'w-6 bg-[#E85D04]'
                    : 'w-2.5 bg-[#FFEDD7]/25 group-hover:w-4 group-hover:bg-[#FFEDD7]/70'
                }`}
              />
            </button>
          );
        })}
      </aside>

      {/* ==================== SCENE 1 (HERO): DARKROOM CINEMA EDITORIAL (ORYZO / LUSION) ==================== */}
      <section
        id="hero"
        ref={heroSectionRef}
        className="relative min-h-screen flex flex-col justify-between pt-20 sm:pt-22 pb-20 sm:pb-24 overflow-hidden"
      >
        {/* Lightweight 60fps 2D Canvas Shader: Warm Ishim Caustics -> Concrete Hairlines */}
        <IshimWaterCanvas shatterProgress={heroShatter} />

        {/* Clean Single-Frame 1080p Film Still Crossfade (ZERO ghosting / ZERO baked text!) */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: `url('./stills/still_astana_marathon_crowd.jpg')`,
            opacity: Math.max(0, 0.42 * (1 - heroShatter * 2.2)),
            filter: 'contrast(1.06) saturate(0.88)',
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: `url('./stills/still_stadium_vest.jpg')`,
            opacity: Math.max(0, Math.min(0.56, (heroShatter - 0.25) * 1.15)),
            filter: 'contrast(1.12) saturate(1.04)',
          }}
        />

        {/* Warm Darkroom Vignette (lets orange safety vest glow while cream text stays 100% legible) */}
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            background:
              'linear-gradient(180deg, rgba(11,8,7,0.78) 0%, rgba(11,8,7,0.44) 38%, rgba(11,8,7,0.82) 76%, #0B0807 100%)',
          }}
        />

        {/* Hairline Ember Concrete Fracture Line reacting to scroll */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 190 L 340 295 L 520 225 L 780 465 L 960 415 L 1190 675 L 1440 745"
            fill="none"
            stroke="#E85D04"
            strokeWidth={1 + heroShatter * 2}
            strokeDasharray="1800"
            strokeDashoffset={1800 - heroShatter * 1800}
            opacity={0.18 + heroShatter * 0.55}
          />
        </svg>

        <div className="relative z-20 max-w-[1380px] mx-auto px-4 sm:px-8 w-full flex-1 flex flex-col justify-between gap-6 sm:gap-8">
          {/* Top Cinema Slate Metadata Strip (ORYZO restrained typography, zero pill clutter) */}
          <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-6 pb-3.5 hairline-dashed-b font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em]">
            <div className="flex items-center gap-3 text-[#E9DEC9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E85D04]" />
              <span>{t.hero.bridgeTag}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[#9E948B]">
              <span className="hidden lg:inline text-[#7E746B]">2.39:1 SCOPE · 24 FPS · 4K DCP</span>
              <span className="hidden lg:inline text-[#FFEDD7]/20">·</span>
              <span className="text-[#E85D04]">{t.statusPill}</span>
              <span className="text-[#FFEDD7]/20">·</span>
              <span className="text-[#FBF3E8]">{t.releasePill}</span>
            </div>
          </div>

          {/* Center Monumental Kinetic Display Typography floating in Darkroom Negative Space */}
          <div className="my-auto py-3 sm:py-6">
            <div className="font-mono text-[10px] sm:text-xs font-medium uppercase tracking-[0.28em] text-[#D4A373] mb-3">
              {t.genre}
            </div>

            <h1
              className="font-unbounded font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] uppercase text-[#FFEDD7] leading-[0.98] tracking-[-0.03em] transition-transform duration-150 mb-3"
              style={{
                letterSpacing: `${-0.02 + titleWeightVar.tracking * 0.008}em`,
                transform: `skewX(${titleWeightVar.skew}deg)`,
              }}
            >
              {t.title}
            </h1>

            <div className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#A69B91]">
              {t.subTitle}
            </div>
          </div>

          {/* Lower Editorial Strip: Hairline Dashed Grid (Fits 100% above bottom SOS Dock) */}
          <div className="pt-6 hairline-dashed grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            {/* Left 7 Cols: Logline & High-Contrast Film Actions */}
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xl sm:text-2xl md:text-[28px] font-medium text-[#FBF3E8] leading-[1.3] tracking-[-0.015em] max-w-2xl">
                {t.hero.pitchLine}
              </p>
              <p className="text-sm sm:text-[15px] text-[#A69B91] leading-relaxed max-w-2xl">
                {t.hero.hookLine}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a
                  href="#sales"
                  onClick={() => handleJumpToSection('sales')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#FFEDD7] hover:bg-[#E85D04] text-[#0B0807] hover:text-[#FBF3E8] font-mono font-bold text-[11px] uppercase tracking-[0.16em] transition-all"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{t.hero.ctaSales}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsScreeningModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#130F0D]/80 hover:bg-[#1E1714] border border-[#FFEDD7]/20 hover:border-[#FFEDD7]/50 text-[#FBF3E8] font-mono font-semibold text-[11px] uppercase tracking-[0.16em] transition-all"
                >
                  <Play className="w-3.5 h-3.5 text-[#E85D04] fill-current" />
                  <span>{t.hero.ctaTeaser}</span>
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Mirage -> Reality Meter + Editorial Cultural Bridge */}
            <div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-[#FFEDD7]/12 space-y-5">
              {/* Hairline Mirage / Reality State Indicator */}
              <div>
                <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em] mb-2">
                  <span className={heroShatter < 0.45 ? 'text-[#FBF3E8]' : 'text-[#6C635C]'}>
                    {t.hero.dreamState}
                  </span>
                  <span className={heroShatter >= 0.45 ? 'text-[#E85D04]' : 'text-[#6C635C]'}>
                    {t.hero.realityState}
                  </span>
                </div>
                <div className="w-full h-[2px] bg-[#FFEDD7]/12 overflow-hidden">
                  <div
                    className="h-full bg-[#E85D04] transition-all duration-150"
                    style={{ width: `${Math.max(10, Math.round(heroShatter * 100))}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E85D04]">
                  {lang === 'zh'
                    ? '中哈文化桥梁 ·《热辣滚烫》× 黄金港片基因'
                    : 'CULTURAL BRIDGE · YOLO (热辣滚烫) × 80S HK CINEMA'}
                </div>
                <p className="text-xs sm:text-[13px] text-[#B8AEA4] leading-relaxed">
                  {lang === 'zh'
                    ? '男主角拉苏尔将童年创伤锁进207公斤的身体里，他狭小的球场储物间贴满80年代成龙与李小龙的海报。通过真实的极限减重与马拉松奔跑重塑自我尊严，高度契合《热辣滚烫》“为自己赢一次”的全民共鸣。'
                    : lang === 'ru'
                    ? 'Расул прячет детскую травму внутри 207-килограммового тела, а единственным моральным компасом в его подтрибунной каморке служат плакаты боевиков 80-х с Джеки Чаном и Брюсом Ли — в духе народного хита «YOLO» (热辣滚烫).'
                    : 'Rasul hides childhood trauma inside a 207-kg frame while 1980s Jackie Chan and Bruce Lee posters on his stadium room walls serve as his moral compass—echoing the massive inspirational wave of "YOLO" (热辣滚烫).'}
                </p>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-[#7E746B]">
                <span>207 KG INERTIA</span>
                <span className="text-[#D4A373]">{t.hero.scrollHint} ↓</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCENE 2: THE UNTIED SHOELACE & 10 METERS OF ETERNITY ==================== */}
      <section
        id="lace"
        ref={laceSectionRef}
        className="relative py-24 sm:py-32 hairline-dashed bg-gradient-to-b from-[#130A09] via-[#0D0807] to-[#0B0807] overflow-hidden"
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#E85D04] mb-4">
                <Footprints className="w-3.5 h-3.5" />
                <span>{t.lace.tag}</span>
              </div>
              <h2 className="font-unbounded font-bold text-2xl sm:text-4xl lg:text-[42px] text-[#FFEDD7] leading-[1.12] tracking-[-0.02em]">
                {t.lace.title}
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm sm:text-[15px] text-[#A69B91] leading-relaxed">{t.lace.desc}</p>
            </div>
          </div>

          {/* Darkroom Red-Tartan Architectural Shoelace Plinth */}
          <div className="rounded-2xl bg-[#140B0A] border border-[#FFEDD7]/12 p-6 sm:p-10 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] mb-6 pb-4 hairline-dashed-b">
              <span className={laceProgress < 0.5 ? 'text-[#E85D04]' : 'text-[#6C635C]'}>
                {t.lace.untiedLabel}
              </span>
              <span className="text-[#FBF3E8]">
                KNOT TENSION · {Math.round(laceProgress * 100)}%
              </span>
              <span className={laceProgress >= 0.5 ? 'text-[#D4A373]' : 'text-[#6C635C]'}>
                {t.lace.tiedLabel}
              </span>
            </div>

            <svg
              viewBox="0 0 1000 240"
              className="w-full h-36 sm:h-48 overflow-visible"
              aria-label="Interactive Shoelace Knot Animation"
            >
              {/* Running Track Lane Hairlines */}
              <line x1="0" y1="60" x2="1000" y2="60" stroke="rgba(255,237,215,0.10)" strokeWidth="1" strokeDasharray="12 10" />
              <line x1="0" y1="180" x2="1000" y2="180" stroke="rgba(255,237,215,0.10)" strokeWidth="1" strokeDasharray="12 10" />

              {/* Left Shoelace Strand (Ember Safety Orange) */}
              <path
                d={`M 40,${40 + laceProgress * 80} C ${260 + laceProgress * 140},${
                  20 + laceProgress * 100
                } ${380 + laceProgress * 100},${210 - laceProgress * 90} 500,120`}
                fill="none"
                stroke="#E85D04"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Right Shoelace Strand (Warm Cream) */}
              <path
                d={`M 960,${200 - laceProgress * 80} C ${740 - laceProgress * 140},${
                  220 - laceProgress * 100
                } ${620 - laceProgress * 100},${30 + laceProgress * 90} 500,120`}
                fill="none"
                stroke="#FFEDD7"
                strokeWidth="7"
                strokeLinecap="round"
              />

              {/* Central Knot Loop */}
              <ellipse
                cx="500"
                cy="120"
                rx={Math.max(14, 72 - laceProgress * 56)}
                ry={Math.max(14, 48 - laceProgress * 32)}
                fill="none"
                stroke="#D4A373"
                strokeWidth={3 + laceProgress * 4}
              />
            </svg>

            <div className="mt-6 pt-5 hairline-dashed flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8E847C]">UNTIED</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(laceProgress * 100)}
                onChange={(e) => {
                  const val = Number(e.target.value) / 100;
                  setLaceProgress(val);
                  soundEngine.playShoelacePull(val);
                }}
                aria-label="Tighten shoelace knot"
                className="w-full h-1 bg-[#2A221E] rounded-full appearance-none cursor-pointer accent-[#E85D04]"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FFEDD7]">TIED KNOT</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCENE 3: AITYM'S BRASS SCALES & DIARY X-RAY ==================== */}
      <section id="scales" className="py-24 sm:py-32 hairline-dashed bg-[#0B0807]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 space-y-24">
          {/* Part A: Interactive Brushed Brass Apothecary Scales */}
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#D4A373] mb-4">
                  <Scale className="w-3.5 h-3.5" />
                  <span>{t.scales.tag}</span>
                </div>
                <h2 className="font-unbounded font-bold text-2xl sm:text-4xl text-[#FFEDD7] leading-[1.14]">
                  {t.scales.title}
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-sm sm:text-[15px] text-[#A69B91] leading-relaxed">{t.scales.desc}</p>
              </div>
            </div>

            <div
              className="rounded-2xl bg-[#110D0B] border border-[#FFEDD7]/10 p-6 sm:p-12"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const norm = (e.clientX - rect.left) / rect.width - 0.5;
                setScaleTilt(Math.round(norm * 30));
              }}
            >
              {/* Tactile Brushed Brass Balance Beam (Centered Fulcrum Pillar) */}
              <div className="relative h-48 sm:h-56 flex items-center justify-center my-4">
                {/* Centered Vertical Brass Stand + Base */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 bottom-2 flex flex-col items-center pointer-events-none z-0">
                  <div className="w-3.5 h-3.5 -mt-1.5 rounded-full bg-[#D4A373] border-2 border-[#0B0807] z-20" />
                  <div className="w-1 flex-1 bg-gradient-to-b from-[#D4A373] to-[#4A3623]" />
                  <div className="w-20 h-1.5 rounded-full bg-[#5B422B]" />
                </div>

                <div
                  className="w-full max-w-2xl h-1.5 bg-gradient-to-r from-[#E85D04] via-[#D4A373] to-[#FFEDD7] rounded-full relative z-10 transition-transform duration-200 ease-out flex items-center justify-between px-4"
                  style={{ transform: `rotate(${scaleTilt}deg)` }}
                >
                  {/* Left Pan: 207 KG Trauma */}
                  <div
                    className="w-36 sm:w-48 -mt-20 p-3.5 rounded-xl bg-[#0B0807] border border-[#E85D04]/50 text-center"
                    style={{ transform: `rotate(${-scaleTilt}deg)` }}
                  >
                    <div className="font-unbounded font-bold text-base sm:text-lg text-[#E85D04]">
                      207 KG
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.18em] text-[#A69B91] mt-1 uppercase">
                      {lang === 'zh' ? '恐惧与童年创伤' : 'TRAUMA & FEAR'}
                    </div>
                  </div>

                  {/* Right Pan: 1 Gram Honesty */}
                  <div
                    className="w-36 sm:w-48 -mt-20 p-3.5 rounded-xl bg-[#0B0807] border border-[#FFEDD7]/30 text-center"
                    style={{ transform: `rotate(${-scaleTilt}deg)` }}
                  >
                    <div className="font-unbounded font-bold text-base sm:text-lg text-[#FFEDD7]">
                      1 GRAM
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.18em] text-[#A69B91] mt-1 uppercase">
                      {lang === 'zh' ? '直面自我的诚实' : 'PURE HONESTY'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean Architectural Pan Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#FFEDD7]/10 border border-[#FFEDD7]/10 rounded-xl overflow-hidden mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setScaleTilt(-14);
                    soundEngine.playScaleTilt('left');
                  }}
                  className="text-left p-6 bg-[#0D0A09] hover:bg-[#17110E] transition-colors"
                >
                  <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#E85D04] uppercase mb-2">
                    {t.scales.leftPanTitle}
                  </div>
                  <p className="text-xs sm:text-sm text-[#A69B91] leading-relaxed">{t.scales.leftPanSub}</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setScaleTilt(14);
                    soundEngine.playScaleTilt('right');
                  }}
                  className="text-left p-6 bg-[#0D0A09] hover:bg-[#17110E] transition-colors"
                >
                  <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#FFEDD7] uppercase mb-2">
                    {t.scales.rightPanTitle}
                  </div>
                  <p className="text-xs sm:text-sm text-[#A69B91] leading-relaxed">{t.scales.rightPanSub}</p>
                </button>
              </div>
            </div>
          </div>

          {/* Part B: Artyom's Diary X-Ray (Darkroom Safelight Flashlight Mask) */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#D4A373] mb-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.scales.xrayHeader}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#9E948B] hidden md:block">
                  {t.scales.xrayHintDesktop}
                </p>
                <p className="text-xs sm:text-sm text-[#9E948B] md:hidden">
                  {t.scales.xrayHintMobile}
                </p>
              </div>
            </div>

            <div
              ref={diaryBoxRef}
              onMouseMove={handleDiaryMouseMove}
              className="relative rounded-2xl overflow-hidden border border-[#FFEDD7]/14 bg-[#120E0C] select-none min-h-[280px] sm:min-h-[300px] cursor-crosshair"
            >
              {/* Surface Layer: Warm Cream Archival Motivational Quote */}
              <div className="p-7 sm:p-12 h-full flex flex-col justify-between">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4A373] mb-4">
                  {diaryData.surfaceTitle[lang]}
                </div>
                <blockquote className="font-unbounded font-semibold text-lg sm:text-2xl text-[#FFEDD7] leading-relaxed mb-6">
                  {diaryData.surfaceQuote[lang]}
                </blockquote>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6C635C]">
                  SURFACE LAYER · MOTIVATIONAL MYTH
                </div>
              </div>

              {/* Desktop Darkroom Safelight X-Ray Layer */}
              <div
                className="hidden md:flex absolute inset-0 p-7 sm:p-12 bg-[#1F0905] border border-[#E85D04]/70 flex-col justify-between pointer-events-none"
                style={{
                  WebkitMaskImage: `radial-gradient(250px circle at ${xrayCoords.x}px ${xrayCoords.y}px, #000 35%, transparent 100%)`,
                  maskImage: `radial-gradient(250px circle at ${xrayCoords.x}px ${xrayCoords.y}px, #000 35%, transparent 100%)`,
                }}
              >
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#E85D04] mb-4">
                  {diaryData.xrayTitle[lang]}
                </div>
                <p className="font-unbounded font-semibold text-lg sm:text-2xl text-[#FFEDD7] leading-relaxed mb-6">
                  {diaryData.xrayTruth[lang]}
                </p>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#E85D04]">
                  X-RAY REALITY · PONZI SCHEME & PRISON ARCHIVE
                </div>
              </div>

              {/* Mobile Split X-Ray Layer */}
              <div
                className="md:hidden absolute inset-0 p-7 bg-[#1F0905] flex flex-col justify-between pointer-events-none"
                style={{
                  clipPath: `inset(0 ${100 - mobileXraySlider}% 0 0)`,
                }}
              >
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#E85D04] mb-2">
                  {diaryData.xrayTitle[lang]}
                </div>
                <p className="font-medium text-sm text-[#FFEDD7] leading-relaxed">
                  {diaryData.xrayTruth[lang]}
                </p>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E85D04] mt-3">
                  X-RAY REALITY LAYER
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 md:hidden">
              <span className="font-mono text-[10px] text-[#D4A373] uppercase">MYTH</span>
              <input
                type="range"
                min={0}
                max={100}
                value={mobileXraySlider}
                onChange={(e) => setMobileXraySlider(Number(e.target.value))}
                aria-label="Diary X-Ray Reveal Slider"
                className="w-full h-1 bg-[#2A221E] rounded-full appearance-none cursor-pointer accent-[#E85D04]"
              />
              <span className="font-mono text-[10px] text-[#E85D04] uppercase">TRUTH</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCENE 3.5: DIRECTOR'S STATEMENT & 35MM CINEMATOGRAPHY LOOKBOOK ==================== */}
      <CinemaLookbookSection lang={lang} />

      {/* ==================== SCENE 4A: 42.2 KM CHROMATIC TRACK (APPLE MIDNIGHT GALLERY) ==================== */}
      <section
        id="track"
        ref={trackPinSectionRef}
        className="py-24 sm:py-32 hairline-dashed bg-[#080707] relative overflow-hidden"
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#E85D04] mb-3">
                <Film className="w-3.5 h-3.5" />
                <span>{t.track.tag}</span>
              </div>
              <h2 className="font-unbounded font-bold text-2xl sm:text-4xl text-[#FFEDD7]">
                {t.track.title}
              </h2>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7E746B]">
              {t.track.hint}
            </p>
          </div>

          {/* Linear-Style Hairline 4-Stage Selector Rail */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#FFEDD7]/10 border border-[#FFEDD7]/10 rounded-2xl overflow-hidden mb-8">
            {HORIZONTAL_TRACK_STAGES.map((st, idx) => {
              const active = idx === activeTrackIdx;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playUiTick();
                    setActiveTrackIdx(idx);
                  }}
                  className={`text-left p-5 transition-colors relative ${
                    active ? 'bg-[#171210]' : 'bg-[#0C0908] hover:bg-[#130E0C]'
                  }`}
                >
                  {active && (
                    <span className="absolute top-0 left-0 right-0 h-[2px] bg-[#E85D04]" />
                  )}
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em] mb-1.5">
                    <span className={active ? 'text-[#E85D04]' : 'text-[#7E746B]'}>{st.step}</span>
                    <span className="text-[#E9DEC9]">{st.km}</span>
                  </div>
                  <div className="font-unbounded font-bold text-base sm:text-lg text-[#FFEDD7]">
                    {st.weight}
                  </div>
                  <div className="text-[11px] text-[#9E948B] truncate mt-1">
                    {st.title[lang]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Film Still Plinth (100% Local Subtitle-Free 1080p Stills) */}
          <div className="rounded-2xl bg-[#110D0B] border border-[#FFEDD7]/12 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#060505] border border-[#FFEDD7]/10 relative">
                <img
                  src={`${currentTrackStage.image}?v=6`}
                  alt={currentTrackStage.title[lang]}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-full bg-[#0B0807]/85 backdrop-blur-md border border-[#FFEDD7]/12 flex items-center justify-between font-mono text-[10px] tracking-[0.16em]">
                  <span className="text-[#E85D04] font-semibold">{currentTrackStage.bpm}</span>
                  <span className="text-[#FFEDD7]">{currentTrackStage.km}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em]">
                <span className="text-[#E85D04] font-semibold">
                  {currentTrackStage.step} · {currentTrackStage.km}
                </span>
                <span className="text-[#FFEDD7]/20">|</span>
                <span className="text-[#9E948B]">
                  GRADE {currentTrackStage.hex}
                </span>
              </div>
              <h3 className="font-unbounded font-bold text-xl sm:text-3xl text-[#FFEDD7] leading-snug">
                {currentTrackStage.title[lang]}
              </h3>
              <p className="text-sm sm:text-[15px] text-[#B8AEA4] leading-relaxed">
                {currentTrackStage.desc[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCENE 4B: CAST & CREW EXHIBITION (APPLE MIDNIGHT GALLERY) ==================== */}
      <section id="cast" className="py-24 sm:py-32 hairline-dashed bg-[#070606]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#E85D04] mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>{t.cast.tag}</span>
            </div>
            <h2 className="font-unbounded font-bold text-2xl sm:text-4xl text-[#FFEDD7] mb-3">
              {t.cast.title}
            </h2>
            <p className="text-sm sm:text-[15px] text-[#9E948B]">{t.cast.sub}</p>
          </div>

          {/* 3x2 Lead Cast Exhibition Plinths */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {CAST_DATA.map((actor) => (
              <div
                key={actor.id}
                className={`group rounded-2xl bg-[#100C0B] border border-[#FFEDD7]/10 hover:border-[#FFEDD7]/30 overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                  actor.spanClass || ''
                }`}
              >
                <div>
                  <div className="aspect-[4/5] bg-[#060505] relative overflow-hidden border-b border-[#FFEDD7]/10 flex items-center justify-center">
                    <img
                      src={`${actor.image}?v=6`}
                      alt={actor.actor[lang]}
                      className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A09] via-[#0D0A09]/15 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0B0807]/85 backdrop-blur-md border border-[#FFEDD7]/15 text-[#FFEDD7] font-mono text-[9px] font-medium uppercase tracking-[0.18em]">
                      {actor.badge[lang]}
                    </span>
                    <div className="absolute bottom-4 left-5 right-5">
                      <h3 className="font-unbounded font-bold text-lg sm:text-xl text-[#FFEDD7]">
                        {actor.actor[lang]}
                      </h3>
                      <div className="font-mono text-[10px] tracking-[0.08em] text-[#D4A373] mt-1">
                        {actor.characterName[lang]} · {actor.role[lang]}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-xs sm:text-[13.5px] text-[#B8AEA4] leading-relaxed">
                      {actor.desc[lang]}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-[#0B0807]/80 border-t border-[#FFEDD7]/10 flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-bold text-[11px] text-[#E85D04] tracking-wider">
                    {actor.metric}
                  </span>
                  <span className="font-mono text-[10px] text-[#7E746B] text-right">
                    {actor.metricLabel[lang]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Complete Ensemble Cast Gallery (All 17 Portraits + Wide JANA MEN Group Frame) */}
          <div className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 pb-4 hairline-dashed-b">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#D4A373] mb-1.5">
                  {lang === 'zh'
                    ? '完整演员阵容 · 真实面孔与角色群像 (OFFICIAL CAST)'
                    : lang === 'en'
                    ? 'FULL ENSEMBLE CAST · OFFICIAL PORTRAITS'
                    : 'ПОЛНЫЙ АКТЁРСКИЙ АНСАМБЛЬ ФИЛЬМА (ОФИЦИАЛЬНЫЙ КАСТ)'}
                </div>
                <h3 className="font-unbounded font-bold text-xl sm:text-2xl text-[#FFEDD7]">
                  {lang === 'zh'
                    ? '《绝不多余》全明星与 JANA MEN 真实学员阵容'
                    : lang === 'en'
                    ? 'Supporting Stars, Cameos & Real JANA MEN Alumni'
                    : 'Актеры второго плана, камео чемпионов и участники JANA MEN'}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {ENSEMBLE_CAST_DATA.map((item, idx) => {
                const isWideGroup = item.image.includes('janamen_participants');
                return (
                  <div
                    key={idx}
                    className={`group rounded-2xl bg-[#0E0B0A] border border-[#FFEDD7]/10 hover:border-[#FFEDD7]/30 overflow-hidden flex flex-col justify-between transition-all ${
                      isWideGroup ? 'col-span-2 sm:col-span-2 md:col-span-3' : ''
                    }`}
                  >
                    <div
                      className={`${
                        isWideGroup ? 'h-full min-h-[260px]' : 'aspect-[4/5]'
                      } w-full bg-[#060505] relative overflow-hidden flex items-center justify-center`}
                    >
                      <img
                        src={`${item.image}?v=6`}
                        alt={item.name[lang]}
                        className={`w-full h-full ${
                          isWideGroup ? 'object-cover object-center' : 'object-cover object-top'
                        } group-hover:scale-[1.03] transition-transform duration-700`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0807] via-[#0B0807]/15 to-transparent" />
                      <div className="absolute bottom-3.5 left-3.5 right-3.5">
                        <div className="font-unbounded font-bold text-xs sm:text-sm text-[#FFEDD7] leading-snug">
                          {item.name[lang]}
                        </div>
                        <div className="font-mono text-[10px] text-[#D4A373] mt-0.5 leading-tight">
                          {item.role[lang]}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Creative Team (Local Self-Hosted Portraits — Instant in China) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#FFEDD7]/10 border border-[#FFEDD7]/10 rounded-2xl overflow-hidden mb-10">
            {KEY_CREW_DATA.map((crew, idx) => (
              <div
                key={idx}
                className="bg-[#0D0A09] hover:bg-[#140F0D] p-6 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={crew.photo}
                      alt={crew.name[lang]}
                      className="w-14 h-14 rounded-xl object-cover object-top border border-[#FFEDD7]/15 flex-shrink-0 bg-[#060505]"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="font-unbounded font-bold text-sm text-[#FFEDD7]">
                        {crew.name[lang]}
                      </h4>
                      <div className="font-mono text-[10px] text-[#E85D04] mt-1 leading-snug">
                        {crew.role[lang]}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#A69B91] leading-relaxed">
                    {crew.bio[lang]}
                  </p>
                </div>
                {crew.link && !hideWesternSocials && (
                  <div className="mt-4 pt-3 border-t border-[#FFEDD7]/10">
                    <a
                      href={crew.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4A373] hover:text-[#FFEDD7] transition-colors"
                    >
                      {crew.linkLabel}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Expandable Full Official Crew Credits Roll */}
          <div className="rounded-2xl bg-[#0F0B0A] border border-[#FFEDD7]/12 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowFullCredits((v) => !v)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#171210] transition-colors"
            >
              <span className="font-mono font-semibold text-xs uppercase tracking-[0.16em] text-[#FFEDD7]">
                {showFullCredits ? t.cast.collapseCredits : t.cast.expandCredits}
              </span>
              {showFullCredits ? (
                <ChevronUp className="w-4 h-4 text-[#E85D04]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#E85D04]" />
              )}
            </button>

            <div className={`p-6 border-t border-[#FFEDD7]/10 ${showFullCredits ? 'block' : 'hidden md:block'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {FULL_CREDITS_DATA.map((dept, dIdx) => (
                  <div key={dIdx} className="rounded-xl bg-[#0A0807] border border-[#FFEDD7]/10 p-5 space-y-2.5">
                    <h5 className="font-mono font-bold text-[10px] uppercase tracking-[0.2em] text-[#D4A373] border-b border-[#FFEDD7]/10 pb-2.5">
                      {dept.department[lang]}
                    </h5>
                    {dept.members.map((m, mIdx) => (
                      <div key={mIdx} className="text-xs border-b border-[#FFEDD7]/6 pb-2 last:border-none">
                        <div className="text-[#7E746B]">{m.role[lang]}</div>
                        <div className="font-medium text-[#E9DEC9] mt-0.5">{m.name[lang]}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCENE 5 (#sales): B2B BUYERS ROOM (LINEAR PRECISION INSTRUMENT) ==================== */}
      <section
        id="sales"
        data-testid="sales-section"
        className="py-24 sm:py-32 border-t-2 border-[#E85D04]/70 bg-[#0B0807] relative"
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 space-y-14">
          {/* Terminal Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 hairline-dashed-b">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E85D04] mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.sales.tag}</span>
              </div>
              <h2 className="font-unbounded font-bold text-2xl sm:text-4xl text-[#FFEDD7] mb-2">
                {t.sales.title}
              </h2>
              <p className="text-sm sm:text-[15px] text-[#A69B91]">{t.sales.sub}</p>
            </div>

            {/* Direct PDF Pitch Deck Download Buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="./NOT_EXTRA_CHINA_PITCH_DECK.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="download-china-pdf-btn"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FFEDD7] hover:bg-[#E85D04] text-[#0B0807] hover:text-[#FBF3E8] font-mono font-bold text-[11px] uppercase tracking-[0.14em] transition-all"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>{t.sales.downloadChinaDeck}</span>
              </a>
              <a
                href="./NE_LISHNIE_Film_Pitch_Deck_RU.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-transparent hover:bg-[#171210] border border-[#FFEDD7]/20 text-[#FFEDD7] font-mono font-semibold text-[11px] uppercase tracking-[0.14em] transition-all"
              >
                <FileDown className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>
                  {lang === 'ru'
                    ? 'Каст-презентация «НЕ ЛИШНИЕ» (RU)'
                    : lang === 'zh'
                    ? '原版全彩视觉推介册 (PDF)'
                    : 'Visual Pitch Deck (RU PDF)'}
                </span>
              </a>
            </div>
          </div>

          {/* 1. Engineering Technical & Market Passport (Hairline Architectural Grid) */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4A373] mb-4">
              {t.sales.specsTitle}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#FFEDD7]/10 border border-[#FFEDD7]/10 rounded-2xl overflow-hidden">
              <div className="p-5 bg-[#0F0C0A]">
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7E746B]">TITLES</div>
                <div className="font-semibold text-xs sm:text-sm text-[#FFEDD7] mt-1.5">NOT EXTRA / 《绝不多余》</div>
                <div className="text-[10px] text-[#9E948B] mt-1">《并非多余》 · НЕ ЛИШНИЕ</div>
              </div>
              <div className="p-5 bg-[#0F0C0A]">
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7E746B]">GENRE</div>
                <div className="font-semibold text-xs sm:text-sm text-[#E85D04] mt-1.5">Sports Dramedy</div>
                <div className="text-[10px] text-[#9E948B] mt-1">励志体育轻喜剧 / 剧情片</div>
              </div>
              <div className="p-5 bg-[#0F0C0A]">
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7E746B]">MASTER FORMAT</div>
                <div className="font-semibold text-xs sm:text-sm text-[#FFEDD7] mt-1.5">4K DCP · 2.39:1</div>
                <div className="text-[10px] text-[#9E948B] mt-1">4096 × 1716 · 24 fps DI</div>
              </div>
              <div className="p-5 bg-[#0F0C0A]">
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7E746B]">AUDIO & STEMS</div>
                <div className="font-semibold text-xs sm:text-sm text-[#FFEDD7] mt-1.5">5.1 & Dolby Atmos</div>
                <div className="text-[10px] text-[#9E948B] mt-1">Full M&E Stems for Dubbing</div>
              </div>
              <div className="p-5 bg-[#0F0C0A]">
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7E746B]">RUNTIME & ORIGIN</div>
                <div className="font-semibold text-xs sm:text-sm text-[#FFEDD7] mt-1.5">~115 min · KZ</div>
                <div className="text-[10px] text-[#9E948B] mt-1">Big Movie Studio × JANA MEN</div>
              </div>
              <div className="p-5 bg-[#0F0C0A]">
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7E746B]">DELIVERY WINDOW</div>
                <div className="font-semibold text-xs sm:text-sm text-[#D4A373] mt-1.5">Spring 2027</div>
                <div className="text-[10px] text-[#9E948B] mt-1">March – May 2027 (EN/ZH)</div>
              </div>
            </div>
          </div>

          {/* 1B. Market Comparables ("COMPS") Box-Office Proof Matrix (Ryan Camp Pitch-Deck Standard) */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4A373] mb-4">
              {lang === 'zh'
                ? '票房对标与市场验证矩阵 (MARKET COMPARABLES · COMPS)'
                : lang === 'en'
                ? 'MARKET COMPARABLES & BOX-OFFICE PROOF (COMPS)'
                : 'РЫНОЧНЫЕ РЕФЕРЕНСЫ И КАССОВЫЙ ПОТЕНЦИАЛ (MARKET COMPS)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#FFEDD7]/10 border border-[#FFEDD7]/10 rounded-2xl overflow-hidden">
              <div className="p-6 bg-[#0F0C0A] space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em]">
                  <span className="text-[#E85D04] font-bold">COMP 01 · CHINA HIT</span>
                  <span className="text-[#FFEDD7]">$480M+ CN BO</span>
                </div>
                <div className="font-unbounded font-bold text-base text-[#FFEDD7]">
                  YOLO / 《热辣滚烫》 (2024)
                </div>
                <p className="text-xs text-[#A69B91] leading-relaxed">
                  {lang === 'zh'
                    ? '证明了“演员真实减重蜕变 + 为自己赢一次”在华语院线拥有核爆级破圈情感共鸣。'
                    : lang === 'en'
                    ? 'Proves authentic actor physical transformation and “win once for yourself” redemption drives massive Asian box office.'
                    : 'Доказал, что реальная трансформация тела и история «победить ради себя» собирают рекордную кассу в Китае и Азии.'}
                </p>
              </div>

              <div className="p-6 bg-[#0F0C0A] space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em]">
                  <span className="text-[#D4A373] font-bold">COMP 02 · A24 PRESTIGE</span>
                  <span className="text-[#FFEDD7]">2× OSCARS · $55M+</span>
                </div>
                <div className="font-unbounded font-bold text-base text-[#FFEDD7]">
                  THE WHALE / 《鲸》 (2022)
                </div>
                <p className="text-xs text-[#A69B91] leading-relaxed">
                  {lang === 'zh'
                    ? '200公斤心理盔甲与父女救赎的情感深度，但《绝不多余》赋予观众更温暖、明亮的院线出口。'
                    : lang === 'en'
                    ? 'Deep psychological weight of a 200-kg recluse seeking forgiveness—elevated here with an uplifting sports-dramedy climax.'
                    : 'Психологическая глубина 200-килограммового затворника и искупления — со светлым зрительским катарсисом марафона.'}
                </p>
              </div>

              <div className="p-6 bg-[#0F0C0A] space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em]">
                  <span className="text-[#FFEDD7] font-bold">COMP 03 · SAME WRITER</span>
                  <span className="text-[#E85D04]">#1 CIS BOX OFFICE</span>
                </div>
                <div className="font-unbounded font-bold text-base text-[#FFEDD7]">
                  «Я ХУДЕЮ» / I AM LOSING WEIGHT
                </div>
                <p className="text-xs text-[#A69B91] leading-relaxed">
                  {lang === 'zh'
                    ? '由同款独联体票房冠军编剧康斯坦丁·迈耶 (Konstantin Mayer) 操刀，精准拿捏笑泪平衡的商业剧作公式。'
                    : lang === 'en'
                    ? 'Penned by the exact same hit screenwriter Konstantin Mayer—bringing proven crowd-pleasing humor and commercial pacing.'
                    : 'Написано тем же сценаристом Константином Майером — проверенная формула народного хита на стыке юмора и драмы.'}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Post-Production Roadmap (3 Precision Phases) */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4A373] mb-4">
              {t.sales.roadmapTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-[#100C0B] border border-[#FFEDD7]/10">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] mb-3">
                  <span className="text-[#9E948B]">PHASE 01 · AUG–OCT 2026</span>
                  <span className="inline-flex items-center gap-1 text-[#D4A373]">
                    <CheckCircle2 className="w-3 h-3" /> WRAPPED
                  </span>
                </div>
                <h4 className="font-unbounded font-bold text-sm sm:text-base text-[#FFEDD7] mb-2">
                  {lang === 'zh'
                    ? '实景拍摄与阿斯塔纳马拉松杀青'
                    : lang === 'ru'
                    ? 'Съёмки и живой марафон в Астане — ЗАВЕРШЕНО'
                    : 'Principal Photography & Live Astana Marathon'}
                </h4>
                <p className="text-xs text-[#9E948B] leading-relaxed">
                  {lang === 'zh'
                    ? '完成全部体育场内景、JANA MEN 训练营真实减重拍摄及阿斯塔纳官方万人马拉松实景跟拍。'
                    : '100% principal photography wrapped in Astana, including real JANA MEN camp transformation and live marathon capture.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#160E0A] border border-[#E85D04]/70 relative">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] mb-3">
                  <span className="text-[#E85D04] font-bold">PHASE 02 · NOV 2026 – WINTER</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E85D04] text-[#0B0807] text-[9px] font-bold">
                    <Clock className="w-2.5 h-2.5" /> ACTIVE
                  </span>
                </div>
                <h4 className="font-unbounded font-bold text-sm sm:text-base text-[#FFEDD7] mb-2">
                  {lang === 'zh'
                    ? '粗剪进行中 (Rough Cut) → 视效、配乐与杜比混音'
                    : lang === 'ru'
                    ? 'Черновой монтаж (Rough Cut) → VFX, звук 5.1 и DI'
                    : 'Rough Cut in Progress → VFX, Score, 5.1 Mix & DI'}
                </h4>
                <p className="text-xs text-[#E9DEC9] leading-relaxed">
                  {lang === 'zh'
                    ? '2026年11月：粗剪进行中并开放内部审片；2026/27冬季：完成大桥幻境VFX、原创配乐、DI调色及5.1/Atmos混音。'
                    : 'Nov 2026: Rough Cut assembly review open for buyers. Winter 2026/27: VFX bridge morphing, original score, 5.1/Atmos sound mix & DI color.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#100C0B] border border-[#FFEDD7]/10">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] mb-3">
                  <span className="text-[#D4A373]">PHASE 03 · MAR–MAY 2027</span>
                  <span className="inline-flex items-center gap-1 text-[#FFEDD7]">
                    <Sparkles className="w-3 h-3 text-[#E85D04]" /> SPRING 2027
                  </span>
                </div>
                <h4 className="font-unbounded font-bold text-sm sm:text-base text-[#FFEDD7] mb-2">
                  {lang === 'zh'
                    ? '2027年春季：4K DCP及中英字幕母带交付与公映'
                    : lang === 'ru'
                    ? 'Март – Май 2027: 4K DCP (EN/ZH) и Мировой релиз'
                    : 'March – May 2027: 4K DCP Delivery & World Release'}
                </h4>
                <p className="text-xs text-[#9E948B] leading-relaxed">
                  {lang === 'zh'
                    ? '交付4K DCP数字拷贝、中英文字幕母带、完整国际分轨（M&E）及全套引进申报文件。'
                    : 'Delivery of 4K DCP, English & Chinese subtitled masters, full M&E stems, and theatrical release.'}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Deal Structure + Flagship Music Co-Marketing ("Ya Eto Ty" x Dimash) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 p-7 sm:p-8 rounded-2xl bg-[#100C0B] border border-[#FFEDD7]/10 flex flex-col justify-between">
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4A373] mb-3">
                  GREATER CHINA & GLOBAL DISTRIBUTION RIGHTS
                </div>
                <h3 className="font-unbounded font-bold text-lg sm:text-xl text-[#FFEDD7] mb-3">
                  {t.sales.dealTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#A69B91] leading-relaxed mb-5">
                  {t.sales.dealBody}
                </p>
              </div>
              <div className="pt-4 hairline-dashed flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.14em] text-[#E9DEC9]">
                <span className="px-2.5 py-1 rounded-full bg-[#18120F] border border-[#FFEDD7]/10">MAINLAND CHINA</span>
                <span className="px-2.5 py-1 rounded-full bg-[#18120F] border border-[#FFEDD7]/10">HONG KONG & MACAU</span>
                <span className="px-2.5 py-1 rounded-full bg-[#18120F] border border-[#FFEDD7]/10">TAIWAN</span>
                <span className="px-2.5 py-1 rounded-full bg-[#18120F] border border-[#E85D04]/35 text-[#E85D04]">PRE-BUY / MOU READY</span>
              </div>
            </div>

            <div className="lg:col-span-6 p-7 sm:p-8 rounded-2xl bg-[#140F0B] border border-[#D4A373]/30 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4A373] mb-3">
                  <Disc className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                  <span>OFFICIAL OST RIGHTS & CHINA STAR COLLABORATION</span>
                </div>
                <h3 className="font-unbounded font-bold text-lg sm:text-xl text-[#FFEDD7] mb-3">
                  {t.sales.musicTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#B8AEA4] leading-relaxed mb-5">
                  {t.sales.musicBody}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0B0807] border border-[#D4A373]/25 text-xs text-[#E9DEC9] leading-relaxed">
                {lang === 'zh'
                  ? '★ 穆拉特·纳西罗夫继承人官方授权改编 "Ya Eto Ty" ("I Am You" / 《我是你》) · 支持特邀迪玛希 (Dimash) 或中国一线歌手录制专属中文主题曲'
                  : '★ Official rights cleared with Murat Nasyrov’s heirs for "Ya Eto Ty" ("I Am You" / 《我是你》) · Exclusive Mandarin OST recording option with Dimash Qudaibergen'}
              </div>
            </div>
          </div>

          {/* 4. Screening Room & Direct Producer Contact Desk */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 p-7 sm:p-8 rounded-2xl bg-[#100C0B] border border-[#FFEDD7]/10 flex flex-col justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E85D04] mb-3">
                  {t.sales.disclaimerBadge}
                </div>
                <h3 className="font-unbounded font-bold text-lg sm:text-xl text-[#FFEDD7] mb-3">
                  {t.sales.screeningRoomTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#A69B91] leading-relaxed mb-6">
                  {t.sales.disclaimerText}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsScreeningModalOpen(true)}
                  data-testid="open-screening-room-btn"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#FFEDD7] hover:bg-[#E85D04] text-[#0B0807] hover:text-[#FBF3E8] font-mono font-bold text-[11px] uppercase tracking-[0.14em] transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{t.hero.ctaTeaser}</span>
                </button>
                <a
                  href="./NOT_EXTRA_CHINA_PITCH_DECK.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-transparent hover:bg-[#171210] border border-[#FFEDD7]/20 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#D4A373] hover:text-[#FFEDD7] transition-all"
                >
                  <span>NOT_EXTRA_CHINA_PITCH_DECK.pdf ↗</span>
                </a>
              </div>
            </div>

            {/* Direct Producer Contact Desk (Hides Instagram strictly in ZH / ?market=cn) */}
            <div className="lg:col-span-5 p-7 sm:p-8 rounded-2xl bg-[#120D0B] border border-[#FFEDD7]/16 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E85D04]">
                  BIG MOVIE STUDIO · ASTANA, KAZAKHSTAN
                </div>
                <h3 className="font-unbounded font-bold text-xl text-[#FFEDD7]">
                  Sergey Bondarev {lang === 'zh' ? '· 谢尔盖·邦达列夫' : ''}
                </h3>
                <div className="text-xs text-[#9E948B]">
                  Showrunner & Lead Producer · Direct Acquisition & Co-Production Desk
                </div>

                {/* 1-Click Corporate Email Copy */}
                <div className="p-3.5 rounded-xl bg-[#0A0807] border border-[#FFEDD7]/12 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="w-4 h-4 text-[#E85D04] flex-shrink-0" />
                    <div className="truncate">
                      <div className="font-mono font-semibold text-xs sm:text-sm text-[#FFEDD7] truncate">
                        sergey@sijicbond.site
                      </div>
                      <div className="text-[10px] text-[#7E746B]">sijicbond@gmail.com</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 rounded-full bg-[#1C1613] hover:bg-[#FFEDD7] text-[#FFEDD7] hover:text-[#0B0807] text-[10px] font-mono font-semibold transition-colors flex items-center gap-1 flex-shrink-0"
                  >
                    {copiedEmail ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? t.sales.copied : 'COPY'}</span>
                  </button>
                </div>

                {/* Phone / WeChat */}
                <a
                  href="tel:+77768006262"
                  className="p-3.5 rounded-xl bg-[#0A0807] border border-[#FFEDD7]/12 hover:border-[#D4A373]/60 flex items-center gap-3 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#D4A373] flex-shrink-0" />
                  <div>
                    <div className="font-mono font-semibold text-xs sm:text-sm text-[#FFEDD7]">
                      +7 776 800 6262
                    </div>
                    <div className="text-[10px] text-[#7E746B]">
                      {lang === 'zh'
                        ? '微信 (WeChat ID) 及电话直联（欢迎邮件索取微信号）'
                        : 'Direct Line / WeChat ID Available upon Request'}
                    </div>
                  </div>
                </a>

                {/* Conditional Instagram Link: Strictly hidden when lang === 'zh' or ?market=cn */}
                {!hideWesternSocials && (
                  <a
                    href="https://www.instagram.com/ne_lishnie_film"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="instagram-link"
                    className="p-3.5 rounded-xl bg-[#0A0807] border border-[#FFEDD7]/12 hover:border-[#E85D04]/60 flex items-center gap-3 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-[#E85D04] flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-[#FFEDD7]">@ne_lishnie_film</div>
                      <div className="text-[10px] text-[#7E746B]">Official Film Instagram</div>
                    </div>
                  </a>
                )}
              </div>

              <div className="mt-5 pt-4 hairline-dashed flex items-center justify-between font-mono text-[10px] text-[#7E746B]">
                <span>DOMAIN: SIJICBOND.SITE</span>
                <span className="text-[#D4A373]">CHAIN OF TITLE: CLEAN</span>
              </div>
            </div>
          </div>

          {/* 5. Official Visual Pitch Deck Gallery (Neutral Greater China Deck + RU Visual Deck) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#100C0B] border border-[#FFEDD7]/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 hairline-dashed-b">
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E85D04]">
                  OFFICIAL VISUAL PITCH DECK GALLERY · ОФИЦИАЛЬНЫЕ СЛАЙДЫ ПРЕЗЕНТАЦИЙ
                </div>
                <h3 className="font-unbounded font-bold text-lg sm:text-2xl text-[#FFEDD7] mt-1">
                  {lang === 'zh'
                    ? '《绝不多余》 / 《并非多余》大中华区推介手册 (NOT_EXTRA_CHINA_PITCH_DECK.pdf)'
                    : 'Презентация для Большого Китая (NOT_EXTRA_CHINA_PITCH_DECK.pdf) и Каст-презентация «НЕ ЛИШНИЕ»'}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="./NOT_EXTRA_CHINA_PITCH_DECK.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#FFEDD7] hover:bg-[#E85D04] text-[#0B0807] hover:text-[#FBF3E8] font-mono font-bold text-[10px] uppercase tracking-[0.14em] transition-colors"
                >
                  GREATER CHINA DECK ↗
                </a>
                <a
                  href="./NE_LISHNIE_Film_Pitch_Deck_RU.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#191310] border border-[#FFEDD7]/15 text-[#FFEDD7] hover:border-[#FFEDD7]/40 font-mono font-semibold text-[10px] uppercase tracking-[0.14em] transition-colors"
                >
                  «НЕ ЛИШНИЕ» RU DECK ↗
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 9, 11].map((sNum) => (
                <a
                  key={`cn-${sNum}`}
                  href="./NOT_EXTRA_CHINA_PITCH_DECK.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl overflow-hidden border border-[#FFEDD7]/10 hover:border-[#E85D04]/70 bg-[#070606] transition-all"
                >
                  <img
                    src={`./slides/cn_slide_${String(sNum).padStart(2, '0')}.png?v=6`}
                    alt={`NOT_EXTRA_CHINA_PITCH_DECK Slide ${sNum}`}
                    className="w-full aspect-video object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="px-3 py-2 font-mono text-[10px] text-[#A69B91] flex justify-between">
                    <span>CHINA DECK · SLIDE {String(sNum).padStart(2, '0')}</span>
                    <span className="text-[#E85D04]">PDF ↗</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {[1, 8, 9, 10, 11, 12, 14, 21].map((rNum) => (
                <a
                  key={`ru-${rNum}`}
                  href="./NE_LISHNIE_Film_Pitch_Deck_RU.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl overflow-hidden border border-[#FFEDD7]/10 hover:border-[#D4A373]/70 bg-[#070606] transition-all"
                >
                  <img
                    src={`./slides/ru_slide_${String(rNum).padStart(2, '0')}.png`}
                    alt={`НЕ ЛИШНИЕ Pitch Deck Slide ${rNum}`}
                    className="w-full aspect-video object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="px-3 py-2 font-mono text-[10px] text-[#A69B91] flex justify-between">
                    <span>НЕ ЛИШНИЕ · СЛАЙД {String(rNum).padStart(2, '0')}</span>
                    <span className="text-[#D4A373]">PDF ↗</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MINIMALIST CINEMA FOOTER (Generous bottom clearance for centered SOS Telemetry Dock) */}
      <footer className="pt-14 pb-28 hairline-dashed bg-[#070606] text-center">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 space-y-3">
          <div className="font-unbounded font-bold text-xs sm:text-sm tracking-[0.22em] uppercase text-[#FFEDD7]">
            НЕ ЛИШНИЕ · NOT EXTRA · АРТЫҚ ЕМЕС · 《绝不多余》
          </div>
          <p className="text-xs text-[#7E746B] max-w-2xl mx-auto">
            © 2026–2027 Big Movie Studio & IBA JANA MEN Movement (Astana, Kazakhstan). All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] text-[#A69B91] pt-2">
            <a href="mailto:sergey@sijicbond.site" className="hover:text-[#E85D04] transition-colors">
              sergey@sijicbond.site
            </a>
            <a href="tel:+77768006262" className="hover:text-[#FFEDD7] transition-colors">
              +7 776 800 6262
            </a>
            {!hideWesternSocials && (
              <a
                href="https://www.instagram.com/ne_lishnie_film"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E85D04] transition-colors"
              >
                @ne_lishnie_film
              </a>
            )}
          </div>
        </div>
      </footer>

      {/* MODAL SCREENING ROOM (Darkroom Plinth + Local 1080p Film Still) */}
      {isScreeningModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#070504]/92 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setIsScreeningModalOpen(false)}
        >
          <div
            className="max-w-3xl w-full bg-[#120E0C] border border-[#FFEDD7]/16 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#0B0807] border-b border-[#FFEDD7]/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#E85D04] animate-pulse" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4A373]">
                  {t.sales.disclaimerBadge}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsScreeningModalOpen(false)}
                className="p-1.5 rounded-full bg-[#1A1411] text-[#A69B91] hover:text-[#FFEDD7] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="aspect-video rounded-xl overflow-hidden bg-[#060505] border border-[#FFEDD7]/10 relative flex items-center justify-center">
                <img
                  src="./stills/still_aitym_mentor.jpg"
                  alt="Rough Cut Reference Preview"
                  className="w-full h-full object-cover opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0807] via-[#0B0807]/55 to-transparent flex flex-col items-center justify-center p-6 text-center">
                  <span className="px-3.5 py-1 rounded-full bg-[#E85D04] text-[#0B0807] font-mono font-bold text-[10px] uppercase tracking-[0.16em] mb-3">
                    3-MIN SUBTITLED ROUGH-CUT ASSEMBLY
                  </span>
                  <h4 className="font-unbounded font-bold text-lg sm:text-2xl text-[#FFEDD7] mb-2">
                    {t.sales.screeningRoomTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#E9DEC9] max-w-xl leading-relaxed">
                    {t.sales.disclaimerText}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:sergey@sijicbond.site?subject=NOT%20EXTRA%20(%E3%80%8A%E7%BB%9D%E4%B8%8D%E5%A4%9A%E4%BD%99%E3%80%8B)%20-%20Request%20Private%20Rough%20Cut%20Screener"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#FFEDD7] hover:bg-[#E85D04] text-[#0B0807] hover:text-[#FBF3E8] font-mono font-bold text-[11px] uppercase tracking-[0.14em] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'zh'
                      ? '发送邮件申请加密审片链接 (sergey@sijicbond.site)'
                      : 'Request Private Screener Link (sergey@sijicbond.site)'}
                  </span>
                </a>
                <a
                  href="./NOT_EXTRA_CHINA_PITCH_DECK.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-transparent border border-[#FFEDD7]/20 hover:border-[#E85D04] text-[#FFEDD7] font-mono font-semibold text-[11px] uppercase tracking-[0.14em] transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5 text-[#E85D04]" />
                  <span>{t.sales.downloadChinaDeck}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
