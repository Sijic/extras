import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { UILang } from './PromoPlayerModal';

interface SamsaScalesHeroProps {
  lang: UILang;
  onPlayPromo: () => void;
}

const SCALES_COPY: Record<
  UILang,
  {
    badge: string;
    hint: string;
    droppedLabel: string;
    playBtn: string;
    resetLabel: string;
    unit: string;
    samsaTag: string;
  }
> = {
  en: {
    badge: 'TACTILE FLOOR SCALES · 207 KG',
    hint: 'Tap or swipe the hot samsa off the scales',
    droppedLabel: 'WEIGHT DROPPED · READY FOR SCREENING',
    playBtn: 'Watch 3-Min Promo',
    resetLabel: 'Reset',
    unit: 'KG',
    samsaTag: 'HOT SAMSA',
  },
  zh: {
    badge: '交互体重秤 · 207 公斤',
    hint: '点击或划走热腾腾的烤包子，卸下重量',
    droppedLabel: '重负已卸 · 立即观看推介片',
    playBtn: '播放3分钟推介片',
    resetLabel: '重置',
    unit: 'KG',
    samsaTag: '热烤包子',
  },
  ru: {
    badge: 'НАПОЛЬНЫЕ ВЕСЫ · 207 КГ',
    hint: 'Нажмите или смахните горячую самсу с весов',
    droppedLabel: 'ГРУЗ СБРОШЕН · МОЖНО СМОТРЕТЬ',
    playBtn: 'Смотреть промо 3 мин',
    resetLabel: 'Сбросить',
    unit: 'КГ',
    samsaTag: 'ГОРЯЧАЯ САМСА',
  },
};

interface SteamParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export const SamsaScalesHero: React.FC<SamsaScalesHeroProps> = ({ lang, onPlayPromo }) => {
  const [swipedOff, setSwipedOff] = useState(false);
  const [displayWeight, setDisplayWeight] = useState(207.0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const steamCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const animWeightRef = useRef<number>(207.0);
  const targetWeightRef = useRef<number>(207.0);
  const velWeightRef = useRef<number>(0);

  const copy = SCALES_COPY[lang];

  // Spring physics for the scale needle & digital weight readout (207.0 -> 0.0 with metallic bounce)
  useEffect(() => {
    targetWeightRef.current = swipedOff ? 0 : 207.0;
    let rafId = 0;

    const tick = () => {
      const diff = targetWeightRef.current - animWeightRef.current;
      velWeightRef.current = velWeightRef.current * 0.78 + diff * 0.19;
      animWeightRef.current += velWeightRef.current;

      const clamped = Math.max(0, Math.min(220, animWeightRef.current));
      setDisplayWeight(clamped);

      if (Math.abs(diff) > 0.15 || Math.abs(velWeightRef.current) > 0.15) {
        rafId = requestAnimationFrame(tick);
      } else {
        animWeightRef.current = targetWeightRef.current;
        setDisplayWeight(targetWeightRef.current);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [swipedOff]);

  // Lightweight 60fps HTML5 Canvas translucent steam rising from the hot samsa
  useEffect(() => {
    const canvas = steamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: SteamParticle[] = [];
    let rafId = 0;

    const spawn = () => {
      particles.push({
        x: 110 + (Math.random() - 0.5) * 44,
        y: 86 + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.55 - Math.random() * 0.6,
        r: 7 + Math.random() * 10,
        alpha: 0.24 + Math.random() * 0.14,
        life: 0,
        maxLife: 70 + Math.random() * 50,
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!swipedOff && particles.length < 18 && Math.random() < 0.28) {
        spawn();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.life += 1;
        pt.x += pt.vx + Math.sin(pt.life * 0.07) * 0.28;
        pt.y += pt.vy;
        pt.r += 0.22;

        const t = pt.life / pt.maxLife;
        const opacity = t < 0.2 ? (t / 0.2) * pt.alpha : (1 - t) * pt.alpha;

        if (pt.life >= pt.maxLife || opacity <= 0.004) {
          particles.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(pt.x, pt.y, 1, pt.x, pt.y, pt.r);
        grad.addColorStop(0, `rgba(255, 237, 215, ${opacity})`);
        grad.addColorStop(1, 'rgba(255, 237, 215, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [swipedOff]);

  const triggerDrop = () => {
    if (swipedOff) return;
    soundEngine.unlockOnFirstGesture();
    soundEngine.playScaleSpring();
    setSwipedOff(true);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const handleReset = () => {
    soundEngine.playUiTick();
    setSwipedOff(false);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (swipedOff) return;
    soundEngine.unlockOnFirstGesture();
    soundEngine.playSteamHiss();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || swipedOff) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
    if (Math.hypot(dx, dy) > 42) {
      triggerDrop();
    }
  };

  const handlePointerUp = () => {
    if (!isDragging || swipedOff) return;
    setIsDragging(false);
    // Tap also cleanly triggers the scale drop!
    triggerDrop();
  };

  // Needle angle: 0 KG -> -68 deg, 207 KG -> +66 deg
  const needleAngle = -68 + (displayWeight / 215) * 134;

  return (
    <div
      data-testid="samsa-scales-widget"
      className="relative rounded-2xl bg-[#130E0C]/92 border border-[#FFEDD7]/14 p-5 sm:p-6 overflow-hidden select-none shadow-2xl"
    >
      {/* Top Instrument Label */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#FFEDD7]/10">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A373]">
          <span className={`w-2 h-2 rounded-full ${swipedOff ? 'bg-[#FFEDD7]' : 'bg-[#E85D04] animate-pulse'}`} />
          <span>{swipedOff ? copy.droppedLabel : copy.badge}</span>
        </div>
        {swipedOff && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 font-mono text-[10px] text-[#9E948B] hover:text-[#FFEDD7] transition-colors"
            title={copy.resetLabel}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{copy.resetLabel}</span>
          </button>
        )}
      </div>

      {/* Interactive Stage: Steaming Samsa OR Unlocked Promo Trigger */}
      <div className="relative h-36 sm:h-40 flex flex-col items-center justify-end mb-4">
        {/* Live 60fps Canvas Steam Plume */}
        <canvas
          ref={steamCanvasRef}
          width={220}
          height={110}
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-10"
          aria-hidden="true"
        />

        {!swipedOff ? (
          <div
            role="button"
            tabIndex={0}
            data-testid="samsa-swipe-target"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerDrop();
              }
            }}
            onMouseEnter={() => soundEngine.playSteamHiss()}
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.14}deg)`,
              touchAction: 'none',
            }}
            className="relative z-20 cursor-grab active:cursor-grabbing group flex flex-col items-center transition-transform duration-75"
          >
            {/* Golden-Baked Flaky Triangular Samsa SVG */}
            <svg
              viewBox="0 0 180 110"
              className="w-40 sm:w-44 h-24 sm:h-28 drop-shadow-[0_14px_20px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform"
              aria-label={copy.samsaTag}
            >
              <defs>
                <linearGradient id="samsaCrust" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5B971" />
                  <stop offset="52%" stopColor="#D97B29" />
                  <stop offset="100%" stopColor="#8C3E0D" />
                </linearGradient>
                <radialGradient id="samsaGlow" cx="48%" cy="38%" r="52%">
                  <stop offset="0%" stopColor="#FFE4B5" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#D97B29" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Soft Contact Shadow on Scale Platform */}
              <ellipse cx="90" cy="98" rx="64" ry="8" fill="rgba(0,0,0,0.55)" />
              {/* Main Triangular Samsa Pastry */}
              <path
                d="M 90 12 C 102 12, 152 64, 158 84 C 161 93, 149 98, 90 98 C 31 98, 19 93, 22 84 C 28 64, 78 12, 90 12 Z"
                fill="url(#samsaCrust)"
                stroke="#FDE2B8"
                strokeOpacity="0.35"
                strokeWidth="1.5"
              />
              {/* Flaky Baked Layer Lines */}
              <path
                d="M 46 72 Q 90 60 134 72"
                fill="none"
                stroke="#6E2D07"
                strokeOpacity="0.45"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 62 50 Q 90 42 118 50"
                fill="none"
                stroke="#FFE7C2"
                strokeOpacity="0.35"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <ellipse cx="88" cy="48" rx="44" ry="26" fill="url(#samsaGlow)" />
              {/* Toasted Sesame Seeds */}
              <ellipse cx="88" cy="34" rx="2.4" ry="1.3" fill="#FFF3D6" transform="rotate(-15 88 34)" />
              <ellipse cx="98" cy="44" rx="2.2" ry="1.2" fill="#FFF3D6" transform="rotate(24 98 44)" />
              <ellipse cx="76" cy="48" rx="2.3" ry="1.2" fill="#FFF3D6" transform="rotate(-28 76 48)" />
              <ellipse cx="89" cy="58" rx="2.5" ry="1.3" fill="#2A160A" transform="rotate(12 89 58)" />
              <ellipse cx="106" cy="62" rx="2.2" ry="1.2" fill="#FFF3D6" transform="rotate(-18 106 62)" />
              <ellipse cx="68" cy="66" rx="2.2" ry="1.2" fill="#2A160A" transform="rotate(32 68 66)" />
              <ellipse cx="94" cy="72" rx="2.4" ry="1.2" fill="#FFF3D6" transform="rotate(-10 94 72)" />
            </svg>
            <span className="mt-1 font-mono text-[10px] tracking-[0.14em] text-[#FFEDD7]/80 uppercase">
              {copy.hint}
            </span>
          </div>
        ) : (
          <div className="relative z-20 flex flex-col items-center justify-center gap-2.5 py-2 animate-fadeIn">
            <button
              type="button"
              onClick={onPlayPromo}
              data-testid="scales-play-promo-btn"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#E85D04] hover:bg-[#FFEDD7] text-[#FBF3E8] hover:text-[#0B0807] font-mono text-xs font-bold uppercase tracking-[0.14em] shadow-[0_0_28px_rgba(232,93,4,0.45)] transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{copy.playBtn}</span>
            </button>
          </div>
        )}
      </div>

      {/* Large Mechanical Floor Scale Dial + Readout (Super Readable on 375x667) */}
      <div className="rounded-xl bg-[#0A0807] border border-[#FFEDD7]/14 px-4 py-3.5 relative overflow-hidden">
        {/* Analog Dial Arc + Live Spring Needle */}
        <div className="relative h-14 sm:h-16 flex items-end justify-center overflow-hidden mb-1">
          <svg viewBox="0 0 240 90" className="w-56 sm:w-64 h-16 overflow-visible">
            {/* Outer Brass Scale Rim */}
            <path
              d="M 24 84 A 96 96 0 0 1 216 84"
              fill="none"
              stroke="rgba(255,237,215,0.16)"
              strokeWidth="2"
            />
            {/* Tick Marks (0 to 220 KG) */}
            {Array.from({ length: 13 }).map((_, idx) => {
              const deg = -68 + (idx / 12) * 136;
              const rad = ((deg - 90) * Math.PI) / 180;
              const x1 = 120 + Math.cos(rad) * 80;
              const y1 = 84 + Math.sin(rad) * 80;
              const x2 = 120 + Math.cos(rad) * (idx % 3 === 0 ? 66 : 72);
              const y2 = 84 + Math.sin(rad) * (idx % 3 === 0 ? 66 : 72);
              return (
                <line
                  key={idx}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={idx >= 10 ? '#E85D04' : 'rgba(255,237,215,0.42)'}
                  strokeWidth={idx % 3 === 0 ? 2 : 1}
                />
              );
            })}
            {/* Animated Scale Needle */}
            <g transform={`translate(120, 84) rotate(${needleAngle})`}>
              <line x1="0" y1="0" x2="0" y2="-72" stroke="#E85D04" strokeWidth="2.8" strokeLinecap="round" />
              <circle cx="0" cy="0" r="5" fill="#D4A373" stroke="#0A0807" strokeWidth="1.5" />
            </g>
          </svg>
        </div>

        {/* High-Contrast Numeric Weight Window */}
        <div className="flex items-baseline justify-center gap-2 pt-1 border-t border-[#FFEDD7]/10">
          <span
            data-testid="scales-weight-readout"
            className={`font-unbounded font-black text-3xl sm:text-4xl tabular-nums tracking-tight transition-colors ${
              swipedOff ? 'text-[#FFEDD7]' : 'text-[#E85D04]'
            }`}
          >
            {displayWeight.toFixed(1)}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#9E948B]">
            {copy.unit}
          </span>
        </div>
      </div>
    </div>
  );
};
