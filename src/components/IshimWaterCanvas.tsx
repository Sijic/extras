import React, { useEffect, useRef } from 'react';

interface IshimWaterCanvasProps {
  shatterProgress: number; // 0 = warm golden Ishim river mirage, 1 = darkroom raw concrete #0B0807
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const render = () => {
      time += 0.014;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const s = Math.max(0, Math.min(1, progressRef.current));

      // Interpolate cinema sky/water from Astana deep twilight navy (#0C1E3A) to midnight (#060B14)
      const rBg = Math.round(12 - s * 6);
      const gBg = Math.round(30 - s * 19);
      const bBg = Math.round(58 - s * 38);
      ctx.fillStyle = `rgb(${rBg}, ${gBg}, ${bBg})`;
      ctx.fillRect(0, 0, w, h);

      // Subtle Astana river & sky blue caustics matching @ne_lishnie_film poster palette
      if (s < 0.92) {
        const waveAlpha = (1 - s) * 0.16;
        for (let i = 0; i < 12; i++) {
          const yBase = (h / 12) * i;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 56) {
            const yOffset =
              Math.sin(x * 0.007 + time + i * 0.65) * (12 * (1 - s * 0.65)) +
              Math.cos(x * 0.013 - time * 1.1 + i) * 5;
            if (x === 0) ctx.moveTo(x, yBase + yOffset);
            else ctx.lineTo(x, yBase + yOffset);
          }
          ctx.strokeStyle =
            i % 4 === 0
              ? `rgba(230, 30, 42, ${waveAlpha * 0.75})`
              : `rgba(56, 189, 248, ${waveAlpha * 0.65})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Precision concrete hairlines when shattered
      if (s > 0.12) {
        const concreteAlpha = Math.min(1, (s - 0.12) / 0.88) * 0.08;
        ctx.strokeStyle = `rgba(148, 163, 184, ${concreteAlpha})`;
        ctx.lineWidth = 1;
        const step = 96;
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
