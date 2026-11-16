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
  Compass,
  Eye,
  Award,
  CheckCircle2,
  Clock,
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

gsap.registerPlugin(ScrollTrigger);

const LANG_BUTTONS: Array<{ code: Lang; label: string }> = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'kk', label: 'KK' },
  { code: 'zh', label: '中文' },
];

export default function App() {
  // Detect ?market=cn or saved language
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
  const [scaleTilt, setScaleTilt] = useState<number>(-14); // degrees (-18 to +18)
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
      document.title = '《绝不多余》 (NOT EXTRA) — 官方互动网站与大中华区发行专区 (2027春季)';
    } else if (lang === 'en') {
      document.title = 'NOT EXTRA — Official Interactive Film Experience (Spring 2027)';
    } else if (lang === 'kk') {
      document.title = 'АРТЫҚ ЕМЕС / НЕ ЛИШНИЕ — Фильмнің ресми интерактивті сайты (2027)';
    } else {
      document.title = 'НЕ ЛИШНИЕ / NOT EXTRA — Официальный интерактивный сайт фильма (Весна 2027)';
    }
  }, [lang]);

  // Initialize Lenis smooth scroll with dynamic weight physics + GSAP ScrollTrigger sync
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

      // Kinetic typography reaction to scroll velocity
      setTitleWeightVar({
        tracking: Math.max(-2, Math.min(8, Math.abs(vel) * 0.45)),
        skew: Math.max(-4, Math.min(4, vel * 0.12)),
      });

      // Dynamic weight inertia:
      // First 25% of page feels heavy/viscous (207 kg body physics)
      // Middle feels balanced
      // Marathon track feels fast & responsive
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

    // Check direct hash navigation (e.g. /#sales) on initial load
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

  // Setup GSAP ScrollTriggers for Scene 1 (Hero Shatter), Scene 2 (Shoelace Knot), Scene 4 (42.2km Track)
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
    <div className="min-h-screen bg-[#090D16] text-slate-100 overflow-x-hidden relative selection:bg-[#F97316] selection:text-slate-950">
      {/* Sticky Glassmorphic Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#090D16]/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Logo & Working/Export Title */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleJumpToSection('hero');
            }}
            className="flex items-center gap-2.5 group min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#0284C7] p-[1.5px] flex-shrink-0 shadow-lg shadow-[#F97316]/20">
              <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center font-unbounded font-black text-xs text-white group-hover:bg-transparent transition-colors">
                42.2
              </div>
            </div>
            <div className="truncate">
              <div className="font-unbounded font-extrabold text-xs sm:text-base text-white tracking-wider truncate">
                {t.title}
              </div>
              <div className="text-[10px] text-slate-400 tracking-widest uppercase hidden md:block truncate">
                Big Movie Studio × JANA MEN
              </div>
            </div>
          </a>

          {/* Scrollytelling Scene Navigation */}
          <nav className="hidden xl:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-300">
            <button onClick={() => handleJumpToSection('hero')} className="hover:text-[#F97316] transition-colors">
              {t.nav.hero}
            </button>
            <button onClick={() => handleJumpToSection('lace')} className="hover:text-[#F97316] transition-colors">
              {t.nav.lace}
            </button>
            <button onClick={() => handleJumpToSection('scales')} className="hover:text-[#F97316] transition-colors">
              {t.nav.scales}
            </button>
            <button onClick={() => handleJumpToSection('track')} className="hover:text-[#38BDF8] transition-colors">
              {t.nav.track}
            </button>
            <button onClick={() => handleJumpToSection('cast')} className="hover:text-[#F97316] transition-colors">
              {t.nav.cast}
            </button>
            <a
              href="#sales"
              onClick={() => handleJumpToSection('sales')}
              className="px-3 py-1.5 rounded-lg bg-[#0284C7]/20 border border-[#0284C7]/50 text-[#38BDF8] hover:bg-[#0284C7] hover:text-white transition-all"
            >
              {t.nav.sales}
            </a>
          </nav>

          {/* Right Controls: Procedural Sound Toggle + 4-Language Switcher (RU / EN / KK / 中文) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Web Audio API Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              data-testid="sound-toggle-btn"
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                soundEnabled
                  ? 'bg-[#F97316]/20 border-[#F97316] text-[#F97316] shadow-md shadow-[#F97316]/20'
                  : 'bg-slate-900/90 border-slate-700/80 text-slate-400 hover:text-white'
              }`}
              title="Procedural Web Audio API (Breath -> Metronome -> 188 BPM SOS)"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{soundEnabled ? t.soundOn : t.soundOff}</span>
            </button>

            {/* 4-Language Switcher */}
            <div
              className="flex items-center bg-slate-900/95 border border-slate-700/80 rounded-xl p-1"
              role="group"
              aria-label="4-Language Switcher"
            >
              {LANG_BUTTONS.map((item) => {
                const active = lang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLang(item.code)}
                    data-testid={`lang-btn-${item.code}`}
                    className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold tracking-wider transition-all ${
                      active
                        ? 'bg-[#F97316] text-slate-950 shadow-sm shadow-[#F97316]/40'
                        : 'text-slate-400 hover:text-white'
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

      {/* Fixed SOS Heart-Rate Monitor HUD Widget */}
      <SosHudWidget
        scrollProgress={scrollProgress}
        lang={lang}
        onJumpToSection={handleJumpToSection}
      />

      {/* ==================== SCENE 1 (HERO): THE MIRAGE TRAP ON ASTANA BRIDGE ==================== */}
      <section
        id="hero"
        ref={heroSectionRef}
        className="relative min-h-[125vh] flex flex-col justify-center pt-24 pb-20 overflow-hidden"
      >
        {/* Lightweight 60fps 2D Canvas Shader: Sunlit Ishim River -> Cold Concrete Shatter */}
        <IshimWaterCanvas shatterProgress={heroShatter} />

        {/* Key Art Overlay with Dynamic Shatter Opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-500"
          style={{
            backgroundImage: `url('./cast/directors_cut_stadium.webp')`,
            opacity: 0.35 + heroShatter * 0.25,
            filter: `saturate(${1.15 - heroShatter * 0.35}) contrast(${1.08 + heroShatter * 0.2})`,
          }}
        />

        {/* SVG Concrete Crack Graphic Line that fractures across the screen on scroll */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 180 L 340 290 L 520 220 L 780 460 L 960 410 L 1190 670 L 1440 740"
            fill="none"
            stroke="#F97316"
            strokeWidth={1.5 + heroShatter * 3}
            strokeDasharray="1800"
            strokeDashoffset={1800 - heroShatter * 1800}
            opacity={0.25 + heroShatter * 0.65}
          />
        </svg>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Scene & Status Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono font-bold uppercase tracking-widest text-[#38BDF8]">
              <Compass className="w-3.5 h-3.5 text-[#F97316]" />
              {t.hero.bridgeTag}
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#F97316]/15 border border-[#F97316]/40 text-[11px] font-bold uppercase tracking-wider text-[#F97316]">
                {t.statusPill}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#0284C7]/20 border border-[#0284C7]/50 text-[11px] font-bold uppercase tracking-wider text-[#38BDF8]">
                {t.releasePill}
              </span>
            </div>
          </div>

          {/* Genre Eyebrow */}
          <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#F97316] mb-3">
            {t.genre}
          </div>

          {/* Brutalist Kinetic Display Typography reacting to scroll velocity & mouse */}
          <h1
            className="font-unbounded font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase text-white leading-[1.02] tracking-tight transition-transform duration-150 mb-3"
            style={{
              letterSpacing: `${titleWeightVar.tracking}px`,
              transform: `skewX(${titleWeightVar.skew}deg)`,
            }}
          >
            {t.title}
          </h1>

          <div className="text-xs sm:text-sm font-mono uppercase tracking-[0.28em] text-slate-400 mb-8">
            {t.subTitle}
          </div>

          {/* Mirage vs Reality Interactive State Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-10">
            <div className="lg:col-span-7 rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-wider mb-4">
                  <span className={heroShatter < 0.45 ? 'text-[#38BDF8] font-bold' : 'text-slate-500'}>
                    {t.hero.dreamState}
                  </span>
                  <span className={heroShatter >= 0.45 ? 'text-[#F97316] font-bold' : 'text-slate-500'}>
                    {t.hero.realityState}
                  </span>
                </div>

                {/* Visual Shatter Bar */}
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden mb-6 border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-[#38BDF8] via-[#F97316] to-red-500 transition-all duration-150"
                    style={{ width: `${Math.max(12, Math.round(heroShatter * 100))}%` }}
                  />
                </div>

                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug mb-4">
                  {t.hero.pitchLine}
                </p>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {t.hero.hookLine}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <a
                  href="#sales"
                  onClick={() => handleJumpToSection('sales')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-slate-950 font-unbounded font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#F97316]/25"
                >
                  <Globe className="w-4 h-4" />
                  <span>{t.hero.ctaSales}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsScreeningModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-950/90 hover:bg-slate-800 border border-slate-700 text-white font-unbounded font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <Play className="w-4 h-4 text-[#38BDF8] fill-current" />
                  <span>{t.hero.ctaTeaser}</span>
                </button>
              </div>
            </div>

            {/* Cultural Bridge / HK Cinema & YOLO Highlight Card */}
            <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#0B1324]/90 to-slate-950/90 backdrop-blur-xl border border-[#F97316]/40 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest text-[#F97316] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'zh'
                      ? '中哈文化桥梁 ·《热辣滚烫》× 黄金港片基因'
                      : 'GLOBAL & ASIAN CULTURAL BRIDGE'}
                  </span>
                </div>
                <h2 className="font-unbounded font-bold text-lg sm:text-xl text-white mb-3">
                  {lang === 'zh'
                    ? '207公斤的心理盔甲 × 成龙与李小龙的精神图腾'
                    : lang === 'ru'
                    ? 'Резонанс «YOLO» (热辣滚烫) и код Джеки Чана 80-х'
                    : 'The Resonance of "YOLO" (热辣滚烫) & 1980s Jackie Chan DNA'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lang === 'zh'
                    ? '男主角拉苏尔将童年创伤锁进207公斤的身体里，他狭小的球场储物间贴满80年代成龙与李小龙的海报。通过真实的极限减重与马拉松奔跑重塑自我尊严，高度契合《热辣滚烫》“为自己赢一次”的全民共鸣。'
                    : lang === 'ru'
                    ? 'Расул прячет детскую травму внутри 207-килограммового тела, а единственным моральным компасом в его подтрибунной каморке служат плакаты боевиков 80-х с Джеки Чаном и Брюсом Ли. Фильм говорит на универсальном языке преодоления в духе народного хита «YOLO» (热辣滚烫).'
                    : 'Rasul hides childhood trauma inside a 207-kg frame while 1980s Jackie Chan and Bruce Lee posters on his stadium room walls serve as his moral compass—echoing the massive inspirational wave of "YOLO" (热辣滚烫).'}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>207 KG INERTIA</span>
                <span className="text-[#38BDF8]">{t.hero.scrollHint} ↓</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCENE 2: THE UNTIED SHOELACE & 10 METERS OF ETERNITY ==================== */}
      <section
        id="lace"
        ref={laceSectionRef}
        className="relative py-24 sm:py-32 border-t border-slate-800/80 bg-gradient-to-b from-[#160B0E] via-[#090D16] to-[#090D16] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#F97316] mb-3">
              <Footprints className="w-4 h-4" />
              <span>{t.lace.tag}</span>
            </div>
            <h2 className="font-unbounded font-extrabold text-2xl sm:text-4xl text-white mb-4">
              {t.lace.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{t.lace.desc}</p>
          </div>

          {/* Interactive Scroll-Bound SVG Shoelace Bezier Knot on Red Running Tartan Texture */}
          <div className="rounded-3xl bg-[#1A0D12]/90 border border-[#F97316]/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono uppercase tracking-wider mb-4">
              <span className={laceProgress < 0.5 ? 'text-red-400 font-bold' : 'text-slate-500'}>
                {t.lace.untiedLabel}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[#F97316] font-bold">
                KNOT TENSION: {Math.round(laceProgress * 100)}%
              </span>
              <span className={laceProgress >= 0.5 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {t.lace.tiedLabel}
              </span>
            </div>

            <svg
              viewBox="0 0 1000 240"
              className="w-full h-40 sm:h-52 overflow-visible"
              aria-label="Interactive Shoelace Knot Animation"
            >
              {/* Red Running Track Lane Lines */}
              <line x1="0" y1="60" x2="1000" y2="60" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="16 12" />
              <line x1="0" y1="180" x2="1000" y2="180" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="16 12" />

              {/* Left Shoelace Strand */}
              <path
                d={`M 40,${40 + laceProgress * 80} C ${260 + laceProgress * 140},${
                  20 + laceProgress * 100
                } ${380 + laceProgress * 100},${210 - laceProgress * 90} 500,120`}
                fill="none"
                stroke="#F97316"
                strokeWidth="9"
                strokeLinecap="round"
              />
              {/* Right Shoelace Strand */}
              <path
                d={`M 960,${200 - laceProgress * 80} C ${740 - laceProgress * 140},${
                  220 - laceProgress * 100
                } ${620 - laceProgress * 100},${30 + laceProgress * 90} 500,120`}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="9"
                strokeLinecap="round"
              />

              {/* Central Knot Loop that tightens with scroll */}
              <ellipse
                cx="500"
                cy="120"
                rx={Math.max(14, 72 - laceProgress * 56)}
                ry={Math.max(14, 48 - laceProgress * 32)}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={4 + laceProgress * 5}
              />
            </svg>

            {/* Manual Knot Slider for instant tactile feedback */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-[11px] font-mono uppercase text-slate-400">UNTIED</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(laceProgress * 100)}
                onChange={(e) => setLaceProgress(Number(e.target.value) / 100)}
                aria-label="Tighten shoelace knot"
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-[#F97316]"
              />
              <span className="text-[11px] font-mono uppercase text-emerald-400">TIED KNOT</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCENE 3: AITYM'S BRASS SCALES & DIARY X-RAY ==================== */}
      <section id="scales" className="py-24 sm:py-32 border-t border-slate-800/80 bg-[#070A12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Part A: Interactive Brass Apothecary Scales */}
          <div>
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#F97316] mb-3">
                <Scale className="w-4 h-4" />
                <span>{t.scales.tag}</span>
              </div>
              <h2 className="font-unbounded font-extrabold text-2xl sm:text-4xl text-white mb-4">
                {t.scales.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{t.scales.desc}</p>
            </div>

            <div
              className="rounded-3xl bg-slate-900/75 border border-slate-800 p-6 sm:p-10 shadow-2xl"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const norm = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to +0.5
                setScaleTilt(Math.round(norm * 32));
              }}
            >
              {/* Interactive Balance Beam */}
              <div className="relative h-44 sm:h-52 flex items-center justify-center my-4">
                {/* Center Pillar */}
                <div className="w-3 h-36 bg-gradient-to-b from-amber-400 to-amber-700 rounded-full z-10 shadow-lg" />

                {/* Tilting Brass Beam */}
                <div
                  className="w-full max-w-2xl h-3 bg-gradient-to-r from-[#F97316] via-amber-300 to-[#38BDF8] rounded-full relative transition-transform duration-200 ease-out flex items-center justify-between px-4"
                  style={{ transform: `rotate(${scaleTilt}deg)` }}
                >
                  {/* Left Pan: 207 KG Trauma */}
                  <div
                    className="w-36 sm:w-48 -mt-20 p-3 rounded-2xl bg-slate-950/95 border border-[#F97316]/60 text-center shadow-xl"
                    style={{ transform: `rotate(${-scaleTilt}deg)` }}
                  >
                    <div className="font-unbounded font-black text-base sm:text-lg text-[#F97316]">
                      207 KG
                    </div>
                    <div className="text-[10px] text-slate-300 font-semibold mt-0.5">
                      {lang === 'zh' ? '恐惧与童年创伤' : 'TRAUMA & FEAR'}
                    </div>
                  </div>

                  {/* Right Pan: 1 Gram Honesty */}
                  <div
                    className="w-36 sm:w-48 -mt-20 p-3 rounded-2xl bg-slate-950/95 border border-[#38BDF8]/60 text-center shadow-xl"
                    style={{ transform: `rotate(${-scaleTilt}deg)` }}
                  >
                    <div className="font-unbounded font-black text-base sm:text-lg text-[#38BDF8]">
                      1 GRAM
                    </div>
                    <div className="text-[10px] text-slate-300 font-semibold mt-0.5">
                      {lang === 'zh' ? '直面自我的诚实' : 'PURE HONESTY'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pan Descriptions & Touch Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <button
                  type="button"
                  onClick={() => setScaleTilt(-14)}
                  className="text-left p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-[#F97316] transition-all"
                >
                  <div className="text-xs font-mono font-bold text-[#F97316] uppercase mb-1">
                    {t.scales.leftPanTitle}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300">{t.scales.leftPanSub}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setScaleTilt(14)}
                  className="text-left p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-[#38BDF8] transition-all"
                >
                  <div className="text-xs font-mono font-bold text-[#38BDF8] uppercase mb-1">
                    {t.scales.rightPanTitle}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300">{t.scales.rightPanSub}</p>
                </button>
              </div>
            </div>
          </div>

          {/* Part B: Artyom's Diary X-Ray (Desktop Flashlight Mask + Mobile Before/After Slider) */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8] mb-2">
                  <Eye className="w-4 h-4" />
                  <span>{t.scales.xrayHeader}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 hidden md:block">
                  {t.scales.xrayHintDesktop}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 md:hidden">
                  {t.scales.xrayHintMobile}
                </p>
              </div>
            </div>

            {/* Desktop Flashlight Radial Mask + Mobile Split Slider Container */}
            <div
              ref={diaryBoxRef}
              onMouseMove={handleDiaryMouseMove}
              className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-950 select-none min-h-[280px] sm:min-h-[300px] cursor-crosshair shadow-2xl"
            >
              {/* Base Layer: Surface Motivational Fantasy (1980s Jackie Chan / Bruce Lee Quotes) */}
              <div className="p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-[#0E1726] to-slate-950 h-full flex flex-col justify-between">
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8] mb-3">
                  {diaryData.surfaceTitle[lang]}
                </div>
                <blockquote className="font-unbounded font-bold text-lg sm:text-2xl text-slate-100 leading-relaxed mb-6">
                  {diaryData.surfaceQuote[lang]}
                </blockquote>
                <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                  SURFACE LAYER · MOTIVATIONAL MYTH
                </div>
              </div>

              {/* Desktop Radial Flashlight X-Ray Layer */}
              <div
                className="hidden md:flex absolute inset-0 p-6 sm:p-10 bg-[#1F090D] border-2 border-[#F97316] flex-col justify-between pointer-events-none"
                style={{
                  WebkitMaskImage: `radial-gradient(240px circle at ${xrayCoords.x}px ${xrayCoords.y}px, #000 35%, transparent 100%)`,
                  maskImage: `radial-gradient(240px circle at ${xrayCoords.x}px ${xrayCoords.y}px, #000 35%, transparent 100%)`,
                }}
              >
                <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#F97316] mb-3">
                  {diaryData.xrayTitle[lang]}
                </div>
                <p className="font-unbounded font-bold text-lg sm:text-2xl text-amber-200 leading-relaxed mb-6">
                  {diaryData.xrayTruth[lang]}
                </p>
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#F97316]">
                  X-RAY REALITY · PONZI SCHEME & PRISON ARCHIVE
                </div>
              </div>

              {/* Mobile Tactile Before/After X-Ray Layer (375px safe, no heavy cursor effect) */}
              <div
                className="md:hidden absolute inset-0 p-6 bg-[#1F090D] flex flex-col justify-between pointer-events-none"
                style={{
                  clipPath: `inset(0 ${100 - mobileXraySlider}% 0 0)`,
                }}
              >
                <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#F97316] mb-2">
                  {diaryData.xrayTitle[lang]}
                </div>
                <p className="font-bold text-sm text-amber-100 leading-relaxed">
                  {diaryData.xrayTruth[lang]}
                </p>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#F97316] mt-3">
                  X-RAY REALITY LAYER
                </div>
              </div>
            </div>

            {/* Mobile & Desktop X-Ray Slider Control */}
            <div className="mt-4 flex items-center gap-3 md:hidden">
              <span className="text-[10px] font-mono text-[#38BDF8] uppercase">MYTH</span>
              <input
                type="range"
                min={0}
                max={100}
                value={mobileXraySlider}
                onChange={(e) => setMobileXraySlider(Number(e.target.value))}
                aria-label="Diary X-Ray Reveal Slider"
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F97316]"
              />
              <span className="text-[10px] font-mono text-[#F97316] uppercase">TRUTH</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCENE 4A: 42.2 KM CHROMATIC TRACK ==================== */}
      <section
        id="track"
        ref={trackPinSectionRef}
        className="py-24 sm:py-32 border-t border-slate-800/80 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8] mb-3">
                <Film className="w-4 h-4 text-[#F97316]" />
                <span>{t.track.tag}</span>
              </div>
              <h2 className="font-unbounded font-extrabold text-2xl sm:text-4xl text-white">
                {t.track.title}
              </h2>
            </div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {t.track.hint}
            </p>
          </div>

          {/* 4-Stage Horizontal Selector Rail */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {HORIZONTAL_TRACK_STAGES.map((st, idx) => {
              const active = idx === activeTrackIdx;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActiveTrackIdx(idx)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    active
                      ? 'bg-slate-900 border-[#F97316] shadow-xl shadow-[#F97316]/15 scale-[1.01]'
                      : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                    <span style={{ color: st.accent }}>{st.step}</span>
                    <span className="text-white">{st.km}</span>
                  </div>
                  <div className="font-unbounded font-black text-base sm:text-lg text-white">
                    {st.weight}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-1">
                    {st.title[lang]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Showcase Card */}
          <div
            className="rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl transition-all"
            style={{ borderLeftWidth: '6px', borderLeftColor: currentTrackStage.accent }}
          >
            <div className="lg:col-span-5">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                <img
                  src={currentTrackStage.image}
                  alt={currentTrackStage.title[lang]}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#F97316]">{currentTrackStage.bpm}</span>
                  <span className="font-bold text-[#38BDF8]">{currentTrackStage.km}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-lg bg-[#F97316]/20 text-[#F97316] font-mono font-bold text-xs">
                  {currentTrackStage.step} · {currentTrackStage.km}
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs">
                  COLOR CODE: {currentTrackStage.hex}
                </span>
              </div>
              <h3 className="font-unbounded font-bold text-xl sm:text-3xl text-white leading-snug">
                {currentTrackStage.title[lang]}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {currentTrackStage.desc[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCENE 4B: 3D BENTO GRID OF CAST & FULL OFFICIAL CREW ==================== */}
      <section id="cast" className="py-24 sm:py-32 border-t border-slate-800/80 bg-[#070A12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#F97316] mb-3">
              <Award className="w-4 h-4" />
              <span>{t.cast.tag}</span>
            </div>
            <h2 className="font-unbounded font-extrabold text-2xl sm:text-4xl text-white mb-3">
              {t.cast.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-400">{t.cast.sub}</p>
          </div>

          {/* Modular Bento Cast Grid with Real Actor Portraits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {CAST_DATA.map((actor) => (
              <div
                key={actor.id}
                className={`group rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800/90 hover:border-[#F97316]/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl ${
                  actor.spanClass || ''
                }`}
                style={{
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                }}
              >
                <div>
                  <div className="aspect-[4/5] bg-[#060911] relative overflow-hidden border-b border-slate-800/80 flex items-center justify-center">
                    <img
                      src={`${actor.image}?v=5`}
                      alt={actor.actor[lang]}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#F97316] text-slate-950 font-mono font-extrabold text-[10px] uppercase tracking-wider">
                      {actor.badge[lang]}
                    </span>
                    <div className="absolute bottom-3.5 left-5 right-5">
                      <h3 className="font-unbounded font-bold text-lg sm:text-xl text-white">
                        {actor.actor[lang]}
                      </h3>
                      <div className="text-xs font-semibold text-[#38BDF8] mt-0.5">
                        {actor.characterName[lang]} · {actor.role[lang]}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {actor.desc[lang]}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <span className="font-unbounded font-bold text-[#F97316]">{actor.metric}</span>
                  <span className="text-[11px] text-slate-400 text-right">{actor.metricLabel[lang]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Complete Ensemble Cast Gallery with Real Actor Faces from Pitch Deck */}
          <div className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8] mb-1">
                  {lang === 'zh'
                    ? '完整演员阵容 · 真实面孔与角色群像 (OFFICIAL PITCH DECK CAST)'
                    : lang === 'en'
                    ? 'FULL ENSEMBLE CAST · OFFICIAL PITCH DECK PORTRAITS'
                    : 'ПОЛНЫЙ АКТЁРСКИЙ АНСАМБЛЬ ФИЛЬМА (ОФИЦИАЛЬНЫЙ КАСТ)'}
                </div>
                <h3 className="font-unbounded font-extrabold text-xl sm:text-2xl text-white">
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
                    className={`group rounded-2xl bg-[#070B13] border border-slate-800 hover:border-[#38BDF8]/60 overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 shadow-lg ${
                      isWideGroup ? 'col-span-2 sm:col-span-2 md:col-span-3' : ''
                    }`}
                  >
                    <div
                      className={`${
                        isWideGroup ? 'h-full min-h-[260px]' : 'aspect-[4/5]'
                      } w-full bg-[#060911] relative overflow-hidden flex items-center justify-center`}
                    >
                      <img
                        src={`${item.image}?v=5`}
                        alt={item.name[lang]}
                        className={`w-full h-full ${
                          isWideGroup ? 'object-cover object-center' : 'object-cover object-top'
                        } group-hover:scale-105 transition-transform duration-500`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="font-unbounded font-bold text-xs sm:text-sm text-white leading-snug">
                          {item.name[lang]}
                        </div>
                        <div className="text-[11px] font-medium text-[#F97316] mt-0.5 leading-tight">
                          {item.role[lang]}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Creative Team Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {KEY_CREW_DATA.map((crew, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/75 border border-slate-800/90 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <img
                      src={crew.photo}
                      alt={crew.name[lang]}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="font-unbounded font-bold text-sm sm:text-base text-white">
                        {crew.name[lang]}
                      </h4>
                      <div className="text-[11px] font-semibold text-[#F97316] mt-0.5">
                        {crew.role[lang]}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {crew.bio[lang]}
                  </p>
                </div>
                {crew.link && !hideWesternSocials && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <a
                      href={crew.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#38BDF8] hover:text-white"
                    >
                      {crew.linkLabel}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Expandable Full Official Crew Credits Roll */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowFullCredits((v) => !v)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
            >
              <span className="font-unbounded font-bold text-xs sm:text-sm text-white">
                {showFullCredits ? t.cast.collapseCredits : t.cast.expandCredits}
              </span>
              {showFullCredits ? (
                <ChevronUp className="w-5 h-5 text-[#F97316]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#F97316]" />
              )}
            </button>

            <div className={`p-6 border-t border-slate-800 ${showFullCredits ? 'block' : 'hidden md:block'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {FULL_CREDITS_DATA.map((dept, dIdx) => (
                  <div key={dIdx} className="rounded-xl bg-slate-950/80 border border-slate-800/90 p-4 space-y-2.5">
                    <h5 className="font-unbounded font-bold text-xs uppercase tracking-wider text-[#38BDF8] border-b border-slate-800 pb-2">
                      {dept.department[lang]}
                    </h5>
                    {dept.members.map((m, mIdx) => (
                      <div key={mIdx} className="text-xs border-b border-slate-900 pb-1.5 last:border-none">
                        <div className="text-slate-400">{m.role[lang]}</div>
                        <div className="font-semibold text-slate-100">{m.name[lang]}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCENE 5 (#sales): B2B PRODUCER TERMINAL & BUYERS ROOM ==================== */}
      <section
        id="sales"
        data-testid="sales-section"
        className="py-24 sm:py-32 border-t-2 border-[#F97316]/60 bg-gradient-to-b from-[#060911] via-[#090F1C] to-[#05080F] relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Terminal Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F97316]/15 border border-[#F97316]/40 text-xs font-mono font-bold uppercase tracking-widest text-[#F97316] mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.sales.tag}</span>
              </div>
              <h2 className="font-unbounded font-black text-2xl sm:text-4xl text-white mb-2">
                {t.sales.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300">{t.sales.sub}</p>
            </div>

            {/* Direct PDF Pitch Deck Download Buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="./Not_Extra_Pitch_Deck_CHINA.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="download-china-pdf-btn"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-slate-950 font-unbounded font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#F97316]/25"
              >
                <FileDown className="w-4 h-4" />
                <span>{t.sales.downloadChinaDeck} (Not_Extra_Pitch_Deck_CHINA.pdf)</span>
              </a>
              <a
                href="./NE_LISHNIE_Film_Pitch_Deck_RU.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-unbounded font-bold text-xs uppercase tracking-wider transition-all"
              >
                <FileDown className="w-4 h-4 text-[#38BDF8]" />
                <span>
                  {lang === 'ru'
                    ? 'Скачать презентацию «НЕ ЛИШНИЕ» (RU PDF)'
                    : lang === 'zh'
                    ? '下载原版全彩视觉推介册 (PDF)'
                    : 'Download Original Visual Pitch Deck (PDF)'}
                </span>
              </a>
            </div>
          </div>

          {/* 1. Engineering Technical & Market Passport Grid */}
          <div>
            <h3 className="font-unbounded font-bold text-sm sm:text-base uppercase tracking-wider text-[#38BDF8] mb-4">
              {t.sales.specsTitle}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">TITLES</div>
                <div className="font-bold text-xs sm:text-sm text-white mt-1">NOT EXTRA / 《绝不多余》</div>
                <div className="text-[10px] text-slate-400 mt-0.5">НЕ ЛИШНИЕ · АРТЫҚ ЕМЕС</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">GENRE</div>
                <div className="font-bold text-xs sm:text-sm text-[#F97316] mt-1">Sports Dramedy</div>
                <div className="text-[10px] text-slate-400 mt-0.5">励志体育轻喜剧 / 剧情片</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">MASTER FORMAT</div>
                <div className="font-bold text-xs sm:text-sm text-white mt-1">4K DCP · 2.39:1 Scope</div>
                <div className="text-[10px] text-slate-400 mt-0.5">24 fps · Full DI Grading</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">AUDIO & STEMS</div>
                <div className="font-bold text-xs sm:text-sm text-white mt-1">5.1 & Dolby Atmos</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Full M&E Stems for Dubbing</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">RUNTIME & ORIGIN</div>
                <div className="font-bold text-xs sm:text-sm text-white mt-1">~115 min · Kazakhstan</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Big Movie Studio × JANA MEN</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">DELIVERY WINDOW</div>
                <div className="font-bold text-xs sm:text-sm text-emerald-400 mt-1">Spring 2027</div>
                <div className="text-[10px] text-slate-400 mt-0.5">March – May 2027 (EN/ZH Subs)</div>
              </div>
            </div>
          </div>

          {/* 2. Post-Production Roadmap (3 Phases) */}
          <div>
            <h3 className="font-unbounded font-bold text-sm sm:text-base uppercase tracking-wider text-[#F97316] mb-4">
              {t.sales.roadmapTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/40">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-emerald-400 font-bold">PHASE 01 · AUG–OCT 2026</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> COMPLETED
                  </span>
                </div>
                <h4 className="font-unbounded font-bold text-base text-white mb-2">
                  {lang === 'zh'
                    ? '实景拍摄与阿斯塔纳马拉松杀青'
                    : lang === 'ru'
                    ? 'Съёмки и живой марафон в Астане — ЗАВЕРШЕНО'
                    : 'Principal Photography & Live Astana Marathon — WRAPPED'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'zh'
                    ? '完成全部体育场内景、JANA MEN 训练营真实减重拍摄及阿斯塔纳官方万人马拉松实景跟拍。'
                    : '100% principal photography wrapped in Astana, including real JANA MEN camp transformation and live marathon capture.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F97316]/15 to-slate-900 border-2 border-[#F97316] shadow-xl">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-[#F97316] font-bold">PHASE 02 · NOV 2026 – WINTER 26/27</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F97316] text-slate-950 text-[10px] font-bold">
                    <Clock className="w-3 h-3" /> ACTIVE NOW
                  </span>
                </div>
                <h4 className="font-unbounded font-bold text-base text-white mb-2">
                  {lang === 'zh'
                    ? '粗剪审片 (Nov 2026) → 视效、配乐与杜比混音 (Winter)'
                    : lang === 'ru'
                    ? 'Черновой монтаж (Rough Cut) → VFX, музыка, звук 5.1 и DI'
                    : 'Rough Cut Assembly (Now) → VFX, Score, 5.1 Mix & DI'}
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {lang === 'zh'
                    ? '2026年11月：粗剪组装完成并开放内部审片；2026/27冬季：完成大桥幻境VFX、原创配乐、DI调色及5.1/Atmos混音。'
                    : 'Nov 2026: Rough Cut assembly review open for buyers. Winter 2026/27: VFX bridge morphing, original score, 5.1/Atmos sound mix & DI color.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-[#0284C7]/60">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-[#38BDF8] font-bold">PHASE 03 · MARCH – MAY 2027</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0284C7]/30 text-[#38BDF8] text-[10px] font-bold">
                    <Sparkles className="w-3 h-3" /> SPRING 2027
                  </span>
                </div>
                <h4 className="font-unbounded font-bold text-base text-white mb-2">
                  {lang === 'zh'
                    ? '2027年春季：4K DCP及中英字幕母带交付与全球公映'
                    : lang === 'ru'
                    ? 'Март – Май 2027: Сдача 4K DCP (EN/ZH субтитры) и Мировой релиз'
                    : 'March – May 2027: 4K DCP Delivery (EN/ZH Subs) & World Release'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'zh'
                    ? '交付4K DCP数字拷贝、中英文字幕母带、完整国际分轨（M&E）及全套引进申报文件。'
                    : 'Delivery of 4K DCP, English & Chinese subtitled masters, full M&E stems, and theatrical release.'}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Deal Structure + Flagship Music Co-Marketing ("Ya Eto Ty" x Dimash) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900/85 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8] mb-2">
                  GREATER CHINA & GLOBAL DISTRIBUTION RIGHTS
                </div>
                <h3 className="font-unbounded font-bold text-lg sm:text-xl text-white mb-3">
                  {t.sales.dealTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {t.sales.dealBody}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">MAINLAND CHINA</span>
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">HONG KONG & MACAU</span>
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">TAIWAN</span>
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">PRE-BUY / MOU READY</span>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/40 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-400 mb-2">
                  <Disc className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>OFFICIAL OST RIGHTS & CHINA STAR COLLABORATION</span>
                </div>
                <h3 className="font-unbounded font-bold text-lg sm:text-xl text-white mb-3">
                  {t.sales.musicTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                  {t.sales.musicBody}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-amber-500/30 text-xs text-amber-200 font-medium">
                {lang === 'zh'
                  ? '★ 穆拉特·纳西罗夫继承人官方授权改编《Я это ты》(I Am You) · 支持与迪玛希 (Dimash) 或中国一线歌手录制官方中文主题曲'
                  : '★ Official rights cleared with Murat Nasyrov’s heirs for “Ya Eto Ty” (“I Am You”) · Exclusive Mandarin OST recording option with Dimash Qudaibergen'}
              </div>
            </div>
          </div>

          {/* 4. Reference Promo Reel Screening Room & Direct Producer Contact Desk */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Screening Room Card */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] sm:text-xs font-bold mb-3">
                  {t.sales.disclaimerBadge}
                </div>
                <h3 className="font-unbounded font-bold text-lg sm:text-xl text-white mb-2">
                  {t.sales.screeningRoomTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {t.sales.disclaimerText}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsScreeningModalOpen(true)}
                  data-testid="open-screening-room-btn"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-slate-950 font-unbounded font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{t.hero.ctaTeaser}</span>
                </button>
                <a
                  href="./Not_Extra_Pitch_Deck_CHINA.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]"
                >
                  <span>Not_Extra_Pitch_Deck_CHINA.pdf ↗</span>
                </a>
              </div>
            </div>

            {/* Direct Producer Contact Desk (Strictly hides Instagram in ZH / China mode) */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-950 border border-[#0284C7]/60 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#F97316]">
                  BIG MOVIE STUDIO · ASTANA, KAZAKHSTAN
                </div>
                <h3 className="font-unbounded font-bold text-xl text-white">
                  Sergey Bondarev {lang === 'zh' ? '· 谢尔盖·邦达列夫' : ''}
                </h3>
                <div className="text-xs text-slate-400">
                  Showrunner & Lead Producer · Direct Acquisition & Co-Production Desk
                </div>

                {/* 1-Click Email Copy + Direct Mailto */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Mail className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                    <div className="truncate">
                      <div className="font-mono font-bold text-xs sm:text-sm text-white truncate">
                        sergey@sijicbond.site
                      </div>
                      <div className="text-[10px] text-slate-400">sijicbond@gmail.com</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#F97316] text-slate-200 hover:text-slate-950 text-[11px] font-mono font-bold transition-colors flex items-center gap-1 flex-shrink-0"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? t.sales.copied : 'COPY'}</span>
                  </button>
                </div>

                {/* Phone / WeChat */}
                <a
                  href="tel:+77768006262"
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#38BDF8] flex items-center gap-3 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                  <div>
                    <div className="font-mono font-bold text-xs sm:text-sm text-white">
                      +7 776 800 6262
                    </div>
                    <div className="text-[10px] text-slate-400">
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
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#F97316] flex items-center gap-3 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white">@ne_lishnie_film</div>
                      <div className="text-[10px] text-slate-400">Official Film Instagram</div>
                    </div>
                  </a>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>DOMAIN: SIJICBOND.SITE</span>
                <span className="text-emerald-400">CHAIN OF TITLE: CLEAN</span>
              </div>
            </div>
          </div>
          {/* 5. Interactive Visual Presentation Viewer (Not_Extra_Pitch_Deck_CHINA.pdf & «НЕ ЛИШНИЕ» Pitch Deck) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#F97316]">
                  OFFICIAL VISUAL PITCH DECK GALLERY · ОФИЦИАЛЬНЫЕ СЛАЙДЫ ПРЕЗЕНТАЦИЙ
                </div>
                <h3 className="font-unbounded font-bold text-lg sm:text-2xl text-white mt-1">
                  {lang === 'zh'
                    ? '《绝不多余》中国区推介手册 (Not_Extra_Pitch_Deck_CHINA.pdf) 预览'
                    : 'Презентация для Китая (Not_Extra_Pitch_Deck_CHINA.pdf) и Каст-презентация «НЕ ЛИШНИЕ»'}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="./Not_Extra_Pitch_Deck_CHINA.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#F97316] text-slate-950 font-unbounded font-bold text-xs uppercase"
                >
                  Not_Extra_Pitch_Deck_CHINA.pdf ↗
                </a>
                <a
                  href="./NE_LISHNIE_Film_Pitch_Deck_RU.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white font-unbounded font-bold text-xs uppercase"
                >
                  «НЕ ЛИШНИЕ» Pitch Deck (RU) ↗
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 9, 12].map((sNum) => (
                <a
                  key={`cn-${sNum}`}
                  href="./Not_Extra_Pitch_Deck_CHINA.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl overflow-hidden border border-slate-800 hover:border-[#F97316] bg-slate-950 transition-all"
                >
                  <img
                    src={`./slides/cn_slide_${String(sNum).padStart(2, '0')}.png`}
                    alt={`Not_Extra_Pitch_Deck_CHINA Slide ${sNum}`}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="px-3 py-2 text-[11px] font-mono text-slate-300 flex justify-between">
                    <span>CHINA DECK · SLIDE {String(sNum).padStart(2, '0')}</span>
                    <span className="text-[#F97316]">PDF ↗</span>
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
                  className="group rounded-2xl overflow-hidden border border-slate-800 hover:border-[#38BDF8] bg-slate-950 transition-all"
                >
                  <img
                    src={`./slides/ru_slide_${String(rNum).padStart(2, '0')}.png`}
                    alt={`НЕ ЛИШНИЕ Pitch Deck Slide ${rNum}`}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="px-3 py-2 text-[11px] font-mono text-slate-300 flex justify-between">
                    <span>НЕ ЛИШНИЕ · СЛАЙД {String(rNum).padStart(2, '0')}</span>
                    <span className="text-[#38BDF8]">PDF ↗</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-800/80 bg-[#05080F] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="font-unbounded font-extrabold text-xs sm:text-sm tracking-widest uppercase text-white">
            НЕ ЛИШНИЕ · NOT EXTRA · АРТЫҚ ЕМЕС · 《绝不多余》
          </div>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto">
            © 2026–2027 Big Movie Studio & IBA JANA MEN Movement (Astana, Kazakhstan). All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400 pt-2">
            <a href="mailto:sergey@sijicbond.site" className="hover:text-[#F97316]">
              sergey@sijicbond.site
            </a>
            <a href="tel:+77768006262" className="hover:text-[#38BDF8]">
              +7 776 800 6262
            </a>
            {!hideWesternSocials && (
              <a
                href="https://www.instagram.com/ne_lishnie_film"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F97316]"
              >
                @ne_lishnie_film
              </a>
            )}
          </div>
        </div>
      </footer>

      {/* MODAL SCREENING ROOM WITH EXPLICIT WORK-IN-PROGRESS DISCLAIMER */}
      {isScreeningModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setIsScreeningModalOpen(false)}
        >
          <div
            className="max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                  {t.sales.disclaimerBadge}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsScreeningModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative flex items-center justify-center">
                <img
                  src="https://i.postimg.cc/fL7x7bLr/peremeny.png"
                  alt="Rough Cut Reference Preview"
                  className="w-full h-full object-cover opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col items-center justify-center p-6 text-center">
                  <span className="px-3.5 py-1 rounded-full bg-[#F97316] text-slate-950 font-unbounded font-bold text-xs uppercase mb-3">
                    3-MIN SUBTITLED ROUGH-CUT ASSEMBLY
                  </span>
                  <h4 className="font-unbounded font-bold text-lg sm:text-2xl text-white mb-2">
                    {t.sales.screeningRoomTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
                    {t.sales.disclaimerText}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:sergey@sijicbond.site?subject=NOT%20EXTRA%20(%E3%80%8A%E7%BB%9D%E4%B8%8D%E5%A4%9A%E4%BD%99%E3%80%8B)%20-%20Request%20Private%20Rough%20Cut%20Screener"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#F97316] text-slate-950 font-unbounded font-bold text-xs uppercase tracking-wider"
                >
                  <Mail className="w-4 h-4" />
                  <span>
                    {lang === 'zh'
                      ? '发送邮件申请加密审片链接 (sergey@sijicbond.site)'
                      : 'Request Private Screener Link (sergey@sijicbond.site)'}
                  </span>
                </a>
                <a
                  href="./Not_Extra_Pitch_Deck_CHINA.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#0284C7] text-white font-unbounded font-bold text-xs uppercase tracking-wider"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{t.sales.downloadChinaDeck} (Not_Extra_Pitch_Deck_CHINA.pdf)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
