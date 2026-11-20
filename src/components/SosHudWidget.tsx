import React from 'react';
import { UILang } from './PromoPlayerModal';
import { SITE_MODE } from '../config/siteConfig';

interface SosHudWidgetProps {
  scrollProgress: number;
  lang: UILang;
  onJumpToSection: (sectionId: string) => void;
}

const HUD_TEXT: Record<
  UILang,
  {
    watchName: string;
    kmUnit: string;
    weightUnit: string;
    reclaimed: string;
    bpmUnit: string;
    sosUnit: string;
    act1: string;
    act2: string;
    act3: string;
    finalTab: string;
    ticketsTab: string;
  }
> = {
  en: {
    watchName: 'SOS-WATCH',
    kmUnit: 'KM',
    weightUnit: 'KG',
    reclaimed: 'FREE',
    bpmUnit: 'BPM',
    sosUnit: 'SOS',
    act1: 'I',
    act2: 'II',
    act3: 'III',
    finalTab: 'B2B',
    ticketsTab: 'TICKETS',
  },
  zh: {
    watchName: '心率表',
    kmUnit: '公里',
    weightUnit: '公斤',
    reclaimed: '自由',
    bpmUnit: '次/分',
    sosUnit: '警报',
    act1: '一',
    act2: '二',
    act3: '三',
    finalTab: '发行',
    ticketsTab: '购票',
  },
  ru: {
    watchName: 'SOS-ЧАСЫ',
    kmUnit: 'КМ',
    weightUnit: 'КГ',
    reclaimed: 'СВОБОДА',
    bpmUnit: 'УД/М',
    sosUnit: 'SOS',
    act1: 'I',
    act2: 'II',
    act3: 'III',
    finalTab: 'B2B',
    ticketsTab: 'БИЛЕТЫ',
  },
  kk: {
    watchName: 'SOS-САҒАТ',
    kmUnit: 'КМ',
    weightUnit: 'КГ',
    reclaimed: 'ЕРКІНДІК',
    bpmUnit: 'СОҚ/М',
    sosUnit: 'SOS',
    act1: 'I',
    act2: 'II',
    act3: 'III',
    finalTab: 'B2B',
    ticketsTab: 'БИЛЕТ',
  },
};

export const SosHudWidget: React.FC<SosHudWidgetProps> = ({
  scrollProgress,
  lang,
  onJumpToSection,
}) => {
  const p = Math.max(0, Math.min(1, scrollProgress));
  const km = (p * 42.2).toFixed(1).padStart(4, '0');
  const bpm = Math.round(64 + p * 124);
  const isSos = bpm >= 168;
  const copy = HUD_TEXT[lang];

  const weightNum = Math.round(207 - p * 35);
  const weightDisplay = p > 0.86 ? copy.reclaimed : `${weightNum} ${copy.weightUnit}`;

  const phases = [
    { id: 'hero', label: copy.act1 },
    { id: 'diary', label: copy.act2 },
    { id: 'lookbook', label: copy.act3 },
    { id: 'sales', label: SITE_MODE === 'DISTRIBUTOR' ? copy.finalTab : copy.ticketsTab },
  ];

  return (
    <div
      data-testid="sos-hud-widget"
      className="hidden md:block fixed bottom-5 left-1/2 -translate-x-1/2 z-40 rounded-full bg-[#091221]/92 backdrop-blur-xl px-5 py-2 select-none transition-all duration-300"
      style={{
        border: isSos
          ? '1px solid rgba(230, 30, 42, 0.85)'
          : '1px solid rgba(148, 163, 184, 0.22)',
        boxShadow: isSos
          ? '0 10px 36px rgba(230, 30, 42, 0.28), inset 0 1px 0 rgba(248, 250, 252, 0.08)'
          : '0 14px 36px rgba(2, 6, 16, 0.78), inset 0 1px 0 rgba(248, 250, 252, 0.06)',
      }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3.5 font-mono text-[11px] tracking-wider whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isSos ? 'bg-[#E61E2A] animate-ping' : 'bg-[#E61E2A]'
              }`}
            />
            <span className="text-[#94A3B8]">{copy.watchName}</span>
          </div>

          <span className="text-[#94A3B8]/25">|</span>

          <div className="flex items-baseline gap-1">
            <span className="text-[#F8FAFC] font-bold">{km}</span>
            <span className="text-[#64748B] text-[9px]">/ 42.2 {copy.kmUnit}</span>
          </div>

          <span className="text-[#94A3B8]/25">|</span>

          <span className="text-[#38BDF8] font-bold">{weightDisplay}</span>

          <span className="text-[#94A3B8]/25">|</span>

          <div className="flex items-baseline gap-1">
            <span className={`font-bold ${isSos ? 'text-[#E61E2A]' : 'text-[#F8FAFC]'}`}>
              {bpm}
            </span>
            <span className={`text-[9px] ${isSos ? 'text-[#E61E2A] font-bold' : 'text-[#64748B]'}`}>
              {isSos ? copy.sosUnit : copy.bpmUnit}
            </span>
          </div>
        </div>

        <div className="w-px h-4 bg-[#94A3B8]/20" />

        <div className="flex items-center gap-1">
          {phases.map((ph) => (
            <button
              key={ph.id}
              type="button"
              onClick={() => onJumpToSection(ph.id)}
              className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-medium tracking-wider transition-colors ${
                ph.id === 'sales'
                  ? 'text-[#38BDF8] hover:bg-[#38BDF8] hover:text-[#060B14] border border-[#38BDF8]/40'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10'
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
