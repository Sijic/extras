import React, { useEffect, useRef } from 'react';

interface IshimWaterCanvasProps {
  shatterProgress: number; // 0 = sunlit Ishim river, 1 = shattered cold concrete #090D16
}

export const IshimWaterCanvas: React.FC<IshimWaterCanvasProps> = ({ shatterProgress }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef<number>(shatterProgress);

  useEffect(() => {
    progressRef.current = shatterProgress;
  }, [shatterProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let time = 0;

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const render = () => {
      time += 0.018;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const s = Math.max(0, Math.min(1, progressRef.current));

      // Interpolate background from warm sunlit Ishim reflection to cold stadium concrete #090D16
      const rBg = Math.round(24 - s * 15);
      const gBg = Math.round(36 - s * 23);
      const bBg = Math.round(58 - s * 36);
      ctx.fillStyle = `rgb(${rBg}, ${gBg}, ${bBg})`;
      ctx.fillRect(0, 0, w, h);

      // Sunlit water caustics (fades as shatterProgress increases)
      if (s < 0.92) {
        const waveAlpha = (1 - s) * 0.22;
        for (let i = 0; i < 14; i++) {
          const yBase = (h / 14) * i;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 48) {
            const yOffset =
              Math.sin(x * 0.008 + time + i * 0.6) * (14 * (1 - s * 0.7)) +
              Math.cos(x * 0.015 - time * 1.2 + i) * 6;
            if (x === 0) ctx.moveTo(x, yBase + yOffset);
            else ctx.lineTo(x, yBase + yOffset);
          }
          ctx.strokeStyle = i % 2 === 0
            ? `rgba(249, 115, 22, ${waveAlpha})`
            : `rgba(56, 189, 248, ${waveAlpha * 0.85})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
      }

      // Cold concrete industrial grid & orange vest pulse when shattered
      if (s > 0.12) {
        const concreteAlpha = Math.min(1, (s - 0.12) / 0.88) * 0.18;
        ctx.strokeStyle = `rgba(148, 163, 184, ${concreteAlpha * 0.45})`;
        ctx.lineWidth = 1;
        const step = 72;
        for (let x = 0; x < w; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
      }

      animId = window.requestAnimationFrame(render);
    };

    animId = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
