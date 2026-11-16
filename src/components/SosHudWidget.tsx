import React from 'react';
import { HeartPulse, Footprints, Weight } from 'lucide-react';
import { Lang } from '../data/filmData';

interface SosHudWidgetProps {
  scrollProgress: number; // 0 to 1
  lang: Lang;
  onJumpToSection: (sectionId: string) => void;
}

export const SosHudWidget: React.FC<SosHudWidgetProps> = ({
  scrollProgress,
  lang,
  onJumpToSection,
}) => {
  const p = Math.max(0, Math.min(1, scrollProgress));
  const km = (p * 42.2).toFixed(1).padStart(4, '0');
  const bpm = Math.round(64 + p * 124);
  const isSos = bpm >= 168;

  const weightNum = Math.round(207 - p * 35);
  const weightDisplay =
    p > 0.86
      ? lang === 'zh'
        ? '灵魂自由'
        : lang === 'ru'
        ? 'СВОБОДА'
        : lang === 'kk'
        ? 'ЕРКІНДІК'
        : 'RECLAIMED'
      : `${weightNum} KG`;

  const phases = [
    { id: 'hero', label: 'ACT I', km: '0.0' },
    { id: 'scales', label: 'ACT II', km: '14.5' },
    { id: 'track', label: 'ACT III', km: '42.2' },
    { id: 'sales', label: 'B2B', km: 'BUY' },
  ];

  return (
    <div
      data-testid="sos-hud-widget"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-[250px] sm:w-[285px] rounded-2xl bg-[#090D16]/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl p-3.5 sm:p-4 select-none transition-colors"
      style={{
        borderColor: isSos ? 'rgba(249, 115, 22, 0.85)' : 'rgba(51, 65, 85, 0.85)',
        boxShadow: isSos
          ? '0 0 28px rgba(249, 115, 22, 0.28), inset 0 1px 0 rgba(255,255,255,0.12)'
          : '0 12px 32px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {/* Top Watch Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isSos ? 'bg-red-500 animate-ping' : 'bg-[#F97316] animate-pulse'
            }`}
          />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-300">
            ARTYOM SOS-WATCH
          </span>
        </div>
        <span
          className={`font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
            isSos
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'bg-slate-800 text-[#38BDF8]'
          }`}
        >
          {isSos ? 'SOS ALERT' : 'BIOMETRIC'}
        </span>
      </div>

      {/* 3 Live Telemetry Counters */}
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-2">
          <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 uppercase font-mono">
            <Footprints className="w-2.5 h-2.5 text-[#38BDF8]" />
            <span>DIST</span>
          </div>
          <div className="font-unbounded font-extrabold text-xs sm:text-sm text-[#38BDF8] mt-0.5">
            {km}
          </div>
          <div className="text-[8px] font-mono text-slate-500">OF 42.2 KM</div>
        </div>

        <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-2">
          <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 uppercase font-mono">
            <Weight className="w-2.5 h-2.5 text-[#F97316]" />
            <span>ARMOR</span>
          </div>
          <div className="font-unbounded font-extrabold text-xs sm:text-sm text-white mt-0.5 truncate">
            {weightDisplay}
          </div>
          <div className="text-[8px] font-mono text-slate-500">INERTIA</div>
        </div>

        <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-2">
          <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 uppercase font-mono">
            <HeartPulse className="w-2.5 h-2.5 text-red-400" />
            <span>PULSE</span>
          </div>
          <div
            className={`font-unbounded font-extrabold text-xs sm:text-sm mt-0.5 ${
              isSos ? 'text-red-400' : 'text-[#F97316]'
            }`}
          >
            {bpm}
          </div>
          <div className="text-[8px] font-mono text-slate-500">BPM</div>
        </div>
      </div>

      {/* Tactile Phase Jump Buttons */}
      <div className="grid grid-cols-4 gap-1">
        {phases.map((ph) => (
          <button
            key={ph.id}
            type="button"
            onClick={() => onJumpToSection(ph.id)}
            className="px-1.5 py-1 rounded-lg bg-slate-900 hover:bg-[#F97316] text-slate-300 hover:text-slate-950 border border-slate-800 font-mono text-[9px] font-bold uppercase tracking-wider transition-colors text-center"
          >
            {ph.label}
          </button>
        ))}
      </div>
    </div>
  );
};
