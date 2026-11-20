import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { UILang } from './PromoPlayerModal';

interface VerletShoelacesCanvasProps {
  lang: UILang;
}

interface VerletNode {
  x: number;
  y: number;
  ox: number;
  oy: number;
  pinned?: boolean;
}

const LACE_UI: Record<
  UILang,
  {
    hint: string;
    untied: string;
    tied: string;
    tieBtn: string;
    untieBtn: string;
  }
> = {
  en: {
    hint: 'Grab and pull either shoelace with your mouse or finger',
    untied: 'UNTIED · NIGHT TRACK',
    tied: 'DOUBLE KNOT · SECURE',
    tieBtn: 'Tie Double Knot',
    untieBtn: 'Untie Laces',
  },
  zh: {
    hint: '用鼠标或手指直接拖拽任意一根鞋带，感受真实垂坠物理',
    untied: '散开的鞋带 · 深夜跑道',
    tied: '双结系紧 · 稳固前行',
    tieBtn: '系紧双结',
    untieBtn: '松开鞋带',
  },
  ru: {
    hint: 'Потяните за любой шнурок мышкой или пальцем — живая физика',
    untied: 'РАЗВЯЗАН · НОЧНАЯ ДОРОЖКА',
    tied: 'КРЕПКИЙ УЗЕЛ · ГОТОВ К БЕГУ',
    tieBtn: 'Завязать узел',
    untieBtn: 'Развязать',
  },
};

export const VerletShoelacesCanvas: React.FC<VerletShoelacesCanvasProps> = ({ lang }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isTied, setIsTied] = useState(false);
  const isTiedRef = useRef(false);
  const lastScrollYRef = useRef(0);

  const copy = LACE_UI[lang];

  useEffect(() => {
    isTiedRef.current = isTied;
  }, [isTied]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SEGMENTS = 14;
    const SEG_LEN = 15;
    let width = 720;
    let height = 280;

    const leftRope: VerletNode[] = [];
    const rightRope: VerletNode[] = [];

    const buildRopes = (w: number) => {
      leftRope.length = 0;
      rightRope.length = 0;
      const anchorLeftX = w * 0.36;
      const anchorRightX = w * 0.64;
      const anchorY = 38;

      for (let i = 0; i <= SEGMENTS; i++) {
        leftRope.push({
          x: anchorLeftX - i * 4,
          y: anchorY + i * SEG_LEN,
          ox: anchorLeftX - i * 4,
          oy: anchorY + i * SEG_LEN,
          pinned: i === 0,
        });
        rightRope.push({
          x: anchorRightX + i * 4,
          y: anchorY + i * SEG_LEN,
          ox: anchorRightX + i * 4,
          oy: anchorY + i * SEG_LEN,
          pinned: i === 0,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(300, Math.floor(rect.width));
      height = Math.max(240, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildRopes(width);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let activeRope: VerletNode[] | null = null;
    let activeIdx = -1;
    let pointerPos = { x: 0, y: 0 };

    const getCanvasCoords = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const onPointerDown = (e: PointerEvent) => {
      soundEngine.unlockOnFirstGesture();
      const pt = getCanvasCoords(e.clientX, e.clientY);
      pointerPos = pt;

      let bestDist = 48;
      let chosenRope: VerletNode[] | null = null;
      let chosenIdx = -1;

      [leftRope, rightRope].forEach((rope) => {
        for (let i = 2; i < rope.length; i++) {
          const d = Math.hypot(rope[i].x - pt.x, rope[i].y - pt.y);
          if (d < bestDist) {
            bestDist = d;
            chosenRope = rope;
            chosenIdx = i;
          }
        }
      });

      if (chosenRope && chosenIdx >= 0) {
        if (isTiedRef.current) setIsTied(false);
        activeRope = chosenRope;
        activeIdx = chosenIdx;
        canvas.setPointerCapture(e.pointerId);
        soundEngine.playShoelacePull(0.4);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const pt = getCanvasCoords(e.clientX, e.clientY);
      if (activeRope && activeIdx >= 0) {
        const dx = pt.x - pointerPos.x;
        const dy = pt.y - pointerPos.y;
        pointerPos = pt;
        if (Math.hypot(dx, dy) > 8) {
          soundEngine.playShoelacePull(Math.min(1, Math.hypot(dx, dy) / 28));
        }
      } else {
        // Gentle brush sway even without clicking
        [leftRope, rightRope].forEach((rope) => {
          for (let i = 4; i < rope.length; i++) {
            const d = Math.hypot(rope[i].x - pt.x, rope[i].y - pt.y);
            if (d < 34) {
              rope[i].x += (rope[i].x - pt.x) * 0.08;
            }
          }
        });
      }
    };

    const onPointerUp = () => {
      if (activeRope) {
        // Check if tips were brought close together -> auto-tie knot!
        const lTip = leftRope[leftRope.length - 1];
        const rTip = rightRope[rightRope.length - 1];
        if (Math.hypot(lTip.x - rTip.x, lTip.y - rTip.y) < 58) {
          setIsTied(true);
          soundEngine.playShoelacePull(1.0);
        }
      }
      activeRope = null;
      activeIdx = -1;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    let rafId = 0;

    const updateRope = (rope: VerletNode[], scrollImpulse: number) => {
      const gravity = 0.42;
      const damping = 0.985;

      for (let i = 0; i < rope.length; i++) {
        const n = rope[i];
        if (n.pinned) continue;
        const vx = (n.x - n.ox) * damping + scrollImpulse * 0.04;
        const vy = (n.y - n.oy) * damping + gravity;
        n.ox = n.x;
        n.oy = n.y;
        n.x += vx;
        n.y += vy;
      }

      // Apply user drag
      if (activeRope === rope && activeIdx >= 0) {
        rope[activeIdx].x = pointerPos.x;
        rope[activeIdx].y = pointerPos.y;
      }

      // If tied, gently pull midpoint nodes toward the center knot
      if (isTiedRef.current) {
        const kx = width * 0.5;
        const ky = 112;
        const mid = rope[6];
        mid.x += (kx - mid.x) * 0.28;
        mid.y += (ky - mid.y) * 0.28;
      }

      // Distance constraints (6 iterations for crisp inextensible shoelace feel)
      for (let iter = 0; iter < 6; iter++) {
        for (let i = 0; i < rope.length - 1; i++) {
          const a = rope[i];
          const b = rope[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const diff = (SEG_LEN - dist) / dist;
          if (a.pinned) {
            b.x += dx * diff;
            b.y += dy * diff;
          } else {
            a.x -= dx * diff * 0.5;
            a.y -= dy * diff * 0.5;
            b.x += dx * diff * 0.5;
            b.y += dy * diff * 0.5;
          }
        }
        // Keep inside canvas floor/walls
        for (let i = 1; i < rope.length; i++) {
          rope[i].x = Math.max(16, Math.min(width - 16, rope[i].x));
          rope[i].y = Math.max(16, Math.min(height - 14, rope[i].y));
        }
      }
    };

    const drawLace = (rope: VerletNode[], color: string, agletColor: string) => {
      if (rope.length < 2) return;
      // Subtle drop shadow
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(rope[0].x, rope[0].y + 4);
      for (let i = 1; i < rope.length; i++) {
        ctx.lineTo(rope[i].x, rope[i].y + 4);
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Main woven shoelace
      ctx.beginPath();
      ctx.moveTo(rope[0].x, rope[0].y);
      for (let i = 1; i < rope.length; i++) {
        ctx.lineTo(rope[i].x, rope[i].y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 7.5;
      ctx.stroke();

      // Subtle weave highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Metal aglet tip
      const last = rope[rope.length - 1];
      const prev = rope[rope.length - 2];
      const ang = Math.atan2(last.y - prev.y, last.x - prev.x);
      ctx.translate(last.x, last.y);
      ctx.rotate(ang);
      ctx.fillStyle = agletColor;
      ctx.fillRect(-2, -3.5, 14, 7);
      ctx.restore();
    };

    const render = () => {
      const scrollNow = window.scrollY || 0;
      const scrollDelta = Math.max(-18, Math.min(18, scrollNow - lastScrollYRef.current));
      lastScrollYRef.current = scrollNow;

      updateRope(leftRope, scrollDelta);
      updateRope(rightRope, -scrollDelta);

      ctx.clearRect(0, 0, width, height);

      // Running tartan track lane markings
      ctx.strokeStyle = 'rgba(255, 237, 215, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(0, 95);
      ctx.lineTo(width, 95);
      ctx.moveTo(0, 205);
      ctx.lineTo(width, 205);
      ctx.stroke();
      ctx.setLineDash([]);

      // Shoe Eyelets (Brass Rings at top anchors)
      [leftRope[0], rightRope[0]].forEach((anchor) => {
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#0B0807';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#D4A373';
        ctx.stroke();
      });

      // Draw laces
      drawLace(leftRope, '#E85D04', '#D4A373');
      drawLace(rightRope, '#FFEDD7', '#D4A373');

      // Knot badge if tied
      if (isTiedRef.current) {
        const kx = width * 0.5;
        const ky = 112;
        ctx.beginPath();
        ctx.arc(kx, ky, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#140B0A';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#D4A373';
        ctx.stroke();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  return (
    <div className="rounded-2xl bg-[#140B0A] border border-[#FFEDD7]/12 p-5 sm:p-8 relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 hairline-dashed-b">
        <span className={`font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] ${isTied ? 'text-[#D4A373] font-bold' : 'text-[#E85D04] font-bold'}`}>
          {isTied ? copy.tied : copy.untied}
        </span>

        <button
          type="button"
          data-testid="toggle-knot-btn"
          onClick={() => {
            soundEngine.unlockOnFirstGesture();
            soundEngine.playShoelacePull(1.0);
            setIsTied((v) => !v);
          }}
          className="px-4 py-1.5 rounded-full border border-[#FFEDD7]/20 hover:border-[#E85D04] bg-[#0B0807] text-[#FFEDD7] hover:text-[#E85D04] font-mono text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors"
        >
          {isTied ? copy.untieBtn : copy.tieBtn}
        </button>
      </div>

      {/* Interactive 2D Verlet Physics Shoelace Canvas */}
      <div className="relative w-full h-64 sm:h-72 rounded-xl bg-[#0D0707]/85 border border-[#FFEDD7]/8 overflow-hidden">
        <canvas
          ref={canvasRef}
          data-testid="verlet-shoelaces-canvas"
          style={{ touchAction: 'none' }}
          className="w-full h-full block cursor-grab active:cursor-grabbing"
          aria-label={copy.hint}
        />
      </div>

      <div className="mt-3.5 text-center font-mono text-[10px] tracking-[0.14em] text-[#9E948B] uppercase">
        {copy.hint}
      </div>
    </div>
  );
};
