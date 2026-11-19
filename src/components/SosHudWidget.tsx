import React from 'react';
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
    { id: 'hero', label: 'I' },
    { id: 'scales', label: 'II' },
    { id: 'track', label: 'III' },
    { id: 'sales', label: 'B2B' },
  ];

  return (
    <div
      data-testid="sos-hud-widget"
      className="fixed bottom-3.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-24px)] rounded-full bg-[#110D0B]/92 backdrop-blur-xl px-3.5 sm:px-5 py-2 select-none transition-all duration-300"
      style={{
        border: isSos
          ? '1px solid rgba(232, 93, 4, 0.8)'
          : '1px solid rgba(255, 237, 215, 0.14)',
        boxShadow: isSos
          ? '0 10px 36px rgba(232, 93, 4, 0.25), inset 0 1px 0 rgba(255, 237, 215, 0.08)'
          : '0 14px 36px rgba(0, 0, 0, 0.72), inset 0 1px 0 rgba(255, 237, 215, 0.06)',
      }}
    >
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Live SOS Status Dot + Telemetry Counters */}
        <div className="flex items-center gap-2.5 sm:gap-4 font-mono text-[10px] sm:text-[11px] tracking-wider whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isSos ? 'bg-[#E85D04] animate-ping' : 'bg-[#E85D04]'
              }`}
            />
            <span className="text-[#9E948B] hidden md:inline uppercase">SOS-WATCH</span>
          </div>

          <span className="text-[#FFEDD7]/20 hidden md:inline">|</span>

          <div className="flex items-baseline gap-1">
            <span className="text-[#FBF3E8] font-bold">{km}</span>
            <span className="text-[#7E746B] text-[9px]">/ 42.2 KM</span>
          </div>

          <span className="text-[#FFEDD7]/20">|</span>

          <div className="flex items-baseline gap-1">
            <span className="text-[#D4A373] font-bold">{weightDisplay}</span>
          </div>

          <span className="text-[#FFEDD7]/20">|</span>

          <div className="flex items-baseline gap-1">
            <span className={`font-bold ${isSos ? 'text-[#E85D04]' : 'text-[#FBF3E8]'}`}>
              {bpm}
            </span>
            <span className={`text-[9px] ${isSos ? 'text-[#E85D04] font-bold' : 'text-[#7E746B]'}`}>
              {isSos ? 'SOS' : 'BPM'}
            </span>
          </div>
        </div>

        {/* Hairline Separator */}
        <div className="w-px h-4 bg-[#FFEDD7]/15 hidden sm:block" />

        {/* Compact Tactile Act Jump Pills */}
        <div className="hidden sm:flex items-center gap-1">
          {phases.map((ph) => (
            <button
              key={ph.id}
              type="button"
              onClick={() => onJumpToSection(ph.id)}
              className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-medium tracking-wider transition-colors ${
                ph.id === 'sales'
                  ? 'text-[#E85D04] hover:bg-[#E85D04] hover:text-[#0B0807] border border-[#E85D04]/40'
                  : 'text-[#A69B91] hover:text-[#FBF3E8] hover:bg-[#FFEDD7]/10'
              }`}
            >
              {ph.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
