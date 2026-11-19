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

      // Interpolate darkroom canvas from warm twilight walnut (#1A120D) to deep obsidian (#0B0807)
      const rBg = Math.round(26 - s * 15);
      const gBg = Math.round(18 - s * 10);
      const bBg = Math.round(13 - s * 6);
      ctx.fillStyle = `rgb(${rBg}, ${gBg}, ${bBg})`;
      ctx.fillRect(0, 0, w, h);

      // Subtle warm sunlight Ishim caustics (warm cream & ember gold, zero cheap neon cyan)
      if (s < 0.92) {
        const waveAlpha = (1 - s) * 0.14;
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
            i % 3 === 0
              ? `rgba(232, 93, 4, ${waveAlpha})`
              : `rgba(255, 237, 215, ${waveAlpha * 0.55})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Precision darkroom concrete hairlines when shattered
      if (s > 0.12) {
        const concreteAlpha = Math.min(1, (s - 0.12) / 0.88) * 0.09;
        ctx.strokeStyle = `rgba(255, 237, 215, ${concreteAlpha})`;
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
